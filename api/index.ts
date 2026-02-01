import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getCourses, getCourseDetail, getAnnouncements, getCourseWork } from './classroom.js'

const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error: any) {
    console.error('API Error (Courses):', error.message)
    return c.json({ error: error.message || 'Sincronizzazione fallita' }, 500)
  }
})

app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error: any) {
    console.error(`API Error (Detail ${id}):`, error.message)
    return c.json({ error: 'Risorsa non trovata' }, 404)
  }
})

// Nuova rotta per i materiali (Annunci) - Ora restituisce l'errore reale invece di []
app.get('/classroom/courses/:id/announcements', async (c) => {
  const id = c.req.param('id')
  try {
    const data = await getAnnouncements(id)
    return c.json(data)
  } catch (error: any) {
    console.error(`API Error (Announcements ${id}):`, error.message)
    return c.json({ error: 'Errore recupero annunci', details: error.message }, 500)
  }
})

// Nuova rotta per i compiti (CourseWork) - Ora restituisce l'errore reale invece di []
app.get('/classroom/courses/:id/coursework', async (c) => {
  const id = c.req.param('id')
  try {
    const data = await getCourseWork(id)
    return c.json(data)
  } catch (error: any) {
    console.error(`API Error (CourseWork ${id}):`, error.message)
    return c.json({ error: 'Errore recupero compiti', details: error.message }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
