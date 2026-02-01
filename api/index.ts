import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getCourses, getCourseDetail } from './classroom.js'

/**
 * Franco, ho spostato la logica di classroom.ts qui accanto, nella cartella api.
 * L'import ora utilizza './classroom.js' (anche se il file sorgente è .ts)
 * perché Vercel e Node.js in modalità ESM richiedono l'estensione esplicita 
 * del file compilato per trovare il modulo a runtime.
 */

const app = new Hono().basePath('/api')

// Abilitiamo il dialogo tra frontend e backend
app.use('/*', cors())

// Rotta per la lista dei corsi
app.get('/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error) {
    console.error('Errore nel recupero della lista corsi:', error)
    return c.json({ error: 'Impossibile recuperare i corsi da Google Classroom' }, 500)
  }
})

// Rotta per il dettaglio del singolo corso
app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error) {
    console.error(`Errore nel recupero del corso ${id}:`, error)
    return c.json({ error: 'Dettaglio corso non disponibile' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
