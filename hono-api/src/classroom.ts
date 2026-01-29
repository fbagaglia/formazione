import { google, classroom_v1 } from 'googleapis'

const CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
]

type OAuthEnv = {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GOOGLE_REFRESH_TOKEN?: string
}

function ensureEnv(): Required<OAuthEnv> {
  const env: OAuthEnv = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  }

  const missing = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Variabili d'ambiente mancanti per Google OAuth: ${missing.join(
        ', '
      )}. Configurare i segreti su Vercel.`
    )
  }

  return env as Required<OAuthEnv>
}

function createOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = ensureEnv()

  const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
  client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
    scope: CLASSROOM_SCOPES.join(' '),
  })

  return client
}

async function getClassroomClient() {
  const auth = createOAuthClient()
  // Verifica access token per evidenziare subito eventuali errori di permessi
  const token = await auth.getAccessToken()
  if (!token || !token.token) {
    throw new Error('Impossibile ottenere un access token valido da Google OAuth')
  }
  return google.classroom({ version: 'v1', auth })
}

export type ClassroomCourse = {
  id: string
  title: string
  subtitle?: string
  link: string
  updateTime?: string
  section?: string
  subject?: string
}

export type ClassroomCourseDetail = ClassroomCourse & {
  description?: string
  audience?: string
  duration?: string
  tags?: string[]
  sessions?: Array<{
    id: string
    title: string
    subtitle?: string
    summary?: string
    link?: string
  }>
  resources?: Array<{
    title: string
    description?: string
    url?: string
  }>
}

export async function listClassroomCourses(): Promise<ClassroomCourse[]> {
  const classroom = await getClassroomClient()

  const response = await classroom.courses.list({
    courseStates: ['ACTIVE'],
    pageSize: 100,
  })

  const courses = response.data.courses ?? []

  return courses
    .filter((course): course is classroom_v1.Schema$Course => Boolean(course?.id))
    .map((course) => ({
      id: course.id!,
      title: course.name ?? 'Corso senza titolo',
      subtitle: course.section ?? course.descriptionHeading ?? undefined,
      link: course.alternateLink ?? 'https://classroom.google.com',
      updateTime: course.updateTime ?? course.creationTime ?? undefined,
      section: course.section ?? undefined,
      subject: course.subject ?? undefined,
    }))
}

export async function getClassroomCourse(courseId: string): Promise<ClassroomCourseDetail | null> {
  const classroom = await getClassroomClient()

  try {
    const [courseRes, topicsRes, courseworkRes, materialsRes] = await Promise.all([
      classroom.courses.get({ id: courseId }),
      classroom.courses.topics.list({ courseId }),
      classroom.courses.courseWork.list({ courseId, pageSize: 100 }),
      classroom.courses.courseWorkMaterials.list({ courseId, pageSize: 100 }),
    ])

    const course = courseRes.data

    if (!course?.id) {
      return null
    }

    const topics = topicsRes.data.topic ?? []
    const topicMap = new Map(topics.filter((t) => t.topicId).map((t) => [t.topicId!, t]))

    const courseWork = courseworkRes.data.courseWork ?? []
    const courseMaterials = materialsRes.data.courseWorkMaterial ?? []

    const sessions = courseWork
      .filter((work): work is classroom_v1.Schema$CourseWork => Boolean(work.id))
      .map((work) => ({
        id: work.id!,
        title: work.title ?? 'Attività',
        subtitle:
          (work.topicId && topicMap.get(work.topicId)?.name) ||
          (work.workType ? formatWorkType(work.workType) : undefined),
        summary: work.description ?? undefined,
        link: work.alternateLink ?? undefined,
      }))

    const resourcesMap = new Map<string, { title: string; description?: string; url?: string }>()

    const collectMaterials = (materials?: classroom_v1.Schema$Material[], prefix?: string) => {
      if (!materials) return
      materials.forEach((material, index) => {
        const resource = transformMaterial(material, prefix ? `${prefix} #${index + 1}` : undefined)
        if (resource && resource.url) {
          resourcesMap.set(resource.url, resource)
        } else if (resource) {
          // Se manca URL, creiamo una chiave sintetica per evitare duplicati ma conservare il contenuto
          const syntheticKey = `${resource.title}|${resource.description}`
          if (!resourcesMap.has(syntheticKey)) {
            resourcesMap.set(syntheticKey, resource)
          }
        }
      })
    }

    courseWork.forEach((work) => collectMaterials(work.materials, work.title ?? undefined))
    courseMaterials.forEach((material) => collectMaterials(material.materials, material.title ?? undefined))

    const description = buildDescription(course)

    return {
      id: course.id,
      title: course.name ?? 'Corso senza titolo',
      subtitle: course.section ?? course.descriptionHeading ?? undefined,
      link: course.alternateLink ?? 'https://classroom.google.com',
      updateTime: course.updateTime ?? course.creationTime ?? undefined,
      section: course.section ?? undefined,
      subject: course.subject ?? undefined,
      description,
      audience: course.room ?? undefined,
      duration: undefined,
      tags: buildTags(course, topics),
      sessions,
      resources: Array.from(resourcesMap.values()),
    }
  } catch (error: unknown) {
    if (isGoogleNotFound(error)) {
      return null
    }
    console.error('Errore recupero corso Classroom', error)
    throw new Error('Impossibile recuperare il corso da Google Classroom')
  }
}

function buildDescription(course: classroom_v1.Schema$Course): string | undefined {
  if (course.descriptionHeading || course.description) {
    const heading = course.descriptionHeading ? `${course.descriptionHeading}\n\n` : ''
    return `${heading}${course.description ?? ''}`.trim()
  }
  return undefined
}

function buildTags(course: classroom_v1.Schema$Course, topics: classroom_v1.Schema$Topic[]): string[] {
  const tags = new Set<string>()
  if (course.subject) tags.add(course.subject)
  topics.forEach((topic) => {
    if (topic.name) tags.add(topic.name)
  })
  return Array.from(tags)
}

function transformMaterial(
  material: classroom_v1.Schema$Material,
  fallbackTitle?: string
): { title: string; description?: string; url?: string } | null {
  if (material.link?.url) {
    return {
      title: material.link.title ?? fallbackTitle ?? 'Link risorsa',
      description: material.link.description ?? undefined,
      url: material.link.url,
    }
  }

  if (material.driveFile?.driveFile) {
    return {
      title: material.driveFile.driveFile.title ?? fallbackTitle ?? 'File Drive',
      description: material.driveFile.driveFile.alternateLink ? 'Google Drive' : undefined,
      url: material.driveFile.driveFile.alternateLink ?? undefined,
    }
  }

  if (material.youtubeVideo?.alternateLink) {
    return {
      title: material.youtubeVideo.title ?? fallbackTitle ?? 'Video YouTube',
      description: 'Contenuto video',
      url: material.youtubeVideo.alternateLink,
    }
  }

  if (material.form?.formUrl) {
    return {
      title: material.form.title ?? fallbackTitle ?? 'Modulo Google',
      description: 'Questionario o modulo interattivo',
      url: material.form.formUrl,
    }
  }

  return fallbackTitle
    ? {
        title: fallbackTitle,
        description: 'Materiale privo di URL diretto',
      }
    : null
}

function formatWorkType(workType: string): string {
  switch (workType) {
    case 'ASSIGNMENT':
      return 'Compito'
    case 'MULTIPLE_CHOICE_QUESTION':
      return 'Quiz a scelta multipla'
    case 'SHORT_ANSWER_QUESTION':
      return 'Domanda aperta'
    case 'ANNOUNCEMENT':
      return 'Annuncio'
    default:
      return workType
  }
}

function isGoogleNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as { code?: number; response?: { status?: number } }
  return err.code === 404 || err.response?.status === 404
}
