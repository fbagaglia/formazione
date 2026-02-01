import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getCourses, getCourseDetail } from '../src/classroom'

/**
 * Standard Entry Point: api/index.ts
 * Utilizziamo basePath('/api') affinché Hono gestisca correttamente
 * i percorsi riscritti da vercel.json.
 */
const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error) {
    console.error('Errore getCourses:', error)
    return c.json({ error: 'Errore interno server' }, 500)
  }
})

app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error) {
    console.error('Errore getCourseDetail:', error)
    return c.json({ error: 'Corso non trovato' }, 404)
  }
})

export const GET = handle(app)
export const POST = handle(app)
