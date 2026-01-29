import { google } from 'googleapis'
import { getAuthenticatedClient } from '../utils/googleAuth'

type ClassroomCourse = {
  id: string
  title: string
  subtitle?: string
  description?: string
  room?: string
  link?: string
  updateTime?: string
  teacherNames: string[]
}

type ClassroomTopic = {
  id: string
  name: string
  updateTime?: string
}

type ClassroomMaterial = {
  id: string
  title: string
  description?: string
  alternateLink?: string
  materials: Array<
    | { type: 'drive'; title: string; fileId: string; alternateLink?: string }
    | { type: 'link'; title: string; url: string }
    | { type: 'youtube'; title: string; url: string }
    | { type: 'form'; title: string; url: string }
  >
  updateTime?: string
  topicId?: string
}

type ClassroomDetail = {
  course: ClassroomCourse
  topics: ClassroomTopic[]
  courseWorkMaterials: ClassroomMaterial[]
}

const mapCourse = (course: any): ClassroomCourse => ({
  id: course.id,
  title: course.name ?? 'Corso senza titolo',
  subtitle: course.section ?? undefined,
  description: course.descriptionHeading ?? course.description ?? undefined,
  room: course.room ?? undefined,
  link: course.alternateLink ?? undefined,
  updateTime: course.updateTime ?? undefined,
  teacherNames: (course.teachers ?? []).map((teacher: any) => teacher.profile?.name?.fullName).filter(Boolean),
})

const mapTopic = (topic: any): ClassroomTopic => ({
  id: topic.topicId,
  name: topic.name ?? 'Senza titolo',
  updateTime: topic.updateTime ?? undefined,
})

const mapMaterial = (material: any): ClassroomMaterial => {
  const attachments = material.materials ?? []

  return {
    id: material.id,
    title: material.title ?? 'Risorsa',
    description: material.description ?? undefined,
    alternateLink: material.alternateLink ?? undefined,
    updateTime: material.updateTime ?? undefined,
    topicId: material.topicId ?? undefined,
    materials: attachments
      .map((entry: any) => {
        if (entry.driveFile?.driveFile) {
          return {
            type: 'drive' as const,
            title: entry.driveFile.driveFile.title ?? 'Documento',
            fileId: entry.driveFile.driveFile.id ?? '',
            alternateLink: entry.driveFile.driveFile.alternateLink ?? undefined,
          }
        }

        if (entry.link?.url) {
          return {
            type: 'link' as const,
            title: entry.link.title ?? entry.link.url,
            url: entry.link.url,
          }
        }

        if (entry.youtubeVideo?.alternateLink) {
          return {
            type: 'youtube' as const,
            title: entry.youtubeVideo.title ?? 'Video YouTube',
            url: entry.youtubeVideo.alternateLink,
          }
        }

        if (entry.form?.formUrl) {
          return {
            type: 'form' as const,
            title: entry.form.title ?? 'Modulo',
            url: entry.form.formUrl,
          }
        }

        return null
      })
      .filter(Boolean) as ClassroomMaterial['materials'],
  }
}

export const getCourses = async (): Promise<ClassroomCourse[]> => {
  const auth = await getAuthenticatedClient()
  const classroom = google.classroom({ version: 'v1', auth })

  const response = await classroom.courses.list({
    courseStates: ['ACTIVE'],
    pageSize: 100,
  })

  const courses = response.data.courses ?? []
  return courses.map(mapCourse)
}

export const getCourseDetail = async (courseId: string): Promise<ClassroomDetail> => {
  const auth = await getAuthenticatedClient()
  const classroom = google.classroom({ version: 'v1', auth })

  const [courseResponse, topicsResponse, materialsResponse] = await Promise.all([
    classroom.courses.get({ id: courseId }),
    classroom.courses.topics.list({ courseId, pageSize: 100 }),
    classroom.courses.courseWorkMaterials.list({ courseId, pageSize: 100 }),
  ])

  if (!courseResponse.data.id) {
    throw new Error(`Corso con id ${courseId} non trovato`)
  }

  const course = mapCourse(courseResponse.data)
  const topics = (topicsResponse.data.topic ?? []).map(mapTopic)
  const courseWorkMaterials = (materialsResponse.data.courseWorkMaterial ?? []).map(mapMaterial)

  return {
    course,
    topics,
    courseWorkMaterials,
  }
}
