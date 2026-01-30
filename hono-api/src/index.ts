import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { getClassroomCourse, listClassroomCourses } from './classroom'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => c.text('Accademia API attiva'))

app.get('/api/hello', (c) => c.json({ message: "Benvenuto nella API dell'Accademia" }))

app.get('/api/classroom/courses', async (c) => {
  try {
    const courses = await listClassroomCourses()
    return c.json(courses)
  } catch (error: unknown) {
    console.error('Errore elenco corsi Classroom', error)
    const detail = error instanceof Error ? error.message : JSON.stringify(error)
    return c.json({
      message: 'Impossibile recuperare l\'elenco dei corsi',
      detail,
    }, 500)
  }
})

app.get('/api/classroom/courses/:id', async (c) => {
  const { id } = c.req.param()
  try {
    const course = await getClassroomCourse(id)
    if (!course) {
      return c.json({ message: 'Corso non trovato su Google Classroom' }, 404)
    }
    return c.json(course)
  } catch (error: unknown) {
    console.error('Errore dettaglio corso Classroom', error)
    const detail = error instanceof Error ? error.message : JSON.stringify(error)
    return c.json({
      message: 'Impossibile recuperare il corso richiesto',
      detail,
    }, 500)
  }
})

export default app
