import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import { getCourses, getCourseDetail } from './classroom.js'

/**
 * In questo file, Franco, ho centralizzato il battito cardiaco delle nostre API.
 * Abbiamo eliminato la cartella 'src' esterna per evitare che Node.js si smarrisca
 * nel cercare i moduli. L'importazione di './classroom.js' con l'estensione esplicita
 * è la chiave che permette al motore di Vercel di trovare finalmente la strada,
 * eliminando quel fastidioso errore 500 che bloccava il nostro cammino.
 */

const app = new Hono().basePath('/api')

app.use('/*', cors())

app.get('/classroom/courses', async (c) => {
  try {
    const courses = await getCourses()
    return c.json(courses)
  } catch (error) {
    console.error('Errore durante la chiamata ai corsi:', error)
    return c.json({ error: 'La sincronizzazione con il sapere è momentaneamente interrotta.' }, 500)
  }
})

app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const course = await getCourseDetail(id)
    return c.json(course)
  } catch (error) {
    console.error(`Errore nel dettaglio del corso ${id}:`, error)
    return c.json({ error: 'Il sentiero richiesto non è percorribile al momento.' }, 500)
  }
})
