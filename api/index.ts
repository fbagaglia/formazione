import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
// Assicurati che src/classroom.ts esporti queste funzioni
import { 
  getCourses, 
  getCourseDetail, 
  getAnnouncements, 
  getCourseWork,
  getMaterials,
  getTopics 
} from '../src/classroom'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error) {
    return c.json({ error: 'Errore interno' }, 500)
  }
})

app.get('/api/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error) {
    return c.json({ error: 'Corso non trovato' }, 404)
  }
})

// Nuove rotte per risolvere il tuo problema
app.get('/api/classroom/courses/:id/announcements', async (c) => {
  try {
    const data = await getAnnouncements(c.req.param('id'))
    return c.json(data)
  } catch (error) { return c.json([]) }
})

app.get('/api/classroom/courses/:id/coursework', async (c) => {
  try {
    const data = await getCourseWork(c.req.param('id'))
    return c.json(data)
  } catch (error) { return c.json([]) }
})

app.get('/api/classroom/courses/:id/materials', async (c) => {
  try {
    const data = await getMaterials(c.req.param('id'))
    return c.json(data)
  } catch (error) { return c.json([]) }
})

app.get('/api/classroom/courses/:id/topics', async (c) => {
  try {
    const data = await getTopics(c.req.param('id'))
    return c.json(data)
  } catch (error) { return c.json([]) }
})

export const GET = handle(app)
export const POST = handle(app)
