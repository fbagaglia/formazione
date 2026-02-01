import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getCourses, getCourseDetail } from './classroom.js'

/**
 * Franco, questo è il nuovo cuore pulsante del backend.
 * Ho impostato il basePath su '/api' per gestire correttamente
 * l'instradamento di Vercel.
 */
const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error) {
    console.error('Errore backend corsi:', error)
    return c.json({ error: 'Sincronizzazione fallita: il sapere è temporaneamente inaccessibile' }, 500)
  }
})

app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error) {
    console.error(`Errore backend dettaglio ${id}:`, error)
    return c.json({ error: 'Il sentiero richiesto non è stato trovato' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
