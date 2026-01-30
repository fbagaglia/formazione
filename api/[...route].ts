import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Credenziali Google Classroom non configurate (GOOGLE_* env vars mancanti).')
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  return oauth2Client
}

async function listClassroomCourses() {
  const auth = createOAuthClient()
  const classroom = google.classroom({ version: 'v1', auth })

  const response = await classroom.courses.list({
    courseStates: ['ACTIVE'],
    pageSize: 50,
  })

  const courses = response.data.courses ?? []

  return courses.map((course) => ({
    id: course.id,
    title: course.name,
    subtitle: course.section || course.enrollmentCode || '',
    link: course.alternateLink || '',
    updateTime: course.updateTime || course.createTime || '',
    section: course.section || '',
    room: course.room || '',
    ownerId: course.ownerId || '',
  }))
}

async function getClassroomCourse(courseId: string) {
  if (!courseId) {
    throw new Error('Corso non specificato')
  }

  const auth = createOAuthClient()
  const classroom = google.classroom({ version: 'v1', auth })

  const courseResponse = await classroom.courses.get({ id: courseId })
  const course = courseResponse.data
  if (!course?.id) {
    return null
  }

  const materialsResponse = await classroom.courses.courseWorkMaterials.list({
    courseId,
    pageSize: 100,
  })

  const resources = (materialsResponse.data.courseWorkMaterial ?? []).map((material) => ({
    id: material.id || '',
    title: material.title || '',
    link: material.alternateLink || '',
    description: material.description || '',
  }))

  return {
    id: course.id,
    title: course.name,
    subtitle: course.section || course.enrollmentCode || '',
    link: course.alternateLink || '',
    updateTime: course.updateTime || course.createTime || '',
    section: course.section || '',
    room: course.room || '',
    ownerId: course.ownerId || '',
    description: course.descriptionHeading || '',
    resources,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method && req.method !== 'GET') {
      res.status(405).json({ message: 'Metodo non consentito' })
      return
    }

    const { route = [] } = req.query
    const segments = Array.isArray(route) ? route : [route]

    if (segments.length === 0) {
      const courses = await listClassroomCourses()
      res.status(200).json(courses)
      return
    }

    const courseId = segments[0]
    const course = await getClassroomCourse(courseId)
    if (!course) {
      res.status(404).json({ message: 'Corso non trovato su Google Classroom' })
      return
    }

    res.status(200).json(course)
  } catch (error) {
    console.error('Errore API classroom', error)
    res.status(500).json({
      message: 'Impossibile recuperare i dati da Google Classroom',
      detail: error instanceof Error ? error.message : error,
    })
  }
}
