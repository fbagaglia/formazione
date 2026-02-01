import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { google } from 'googleapis'

/**
 * Franco, ho corretto l'errore semantico: 
 * Google Classroom API usa 'creationTime' e non 'createTime'.
 * Inoltre, ho strutturato il file per essere pienamente compatibile con Vercel.
 */

const app = new Hono().basePath('/api')

async function getAccessToken() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })
  const { token } = await oauth2Client.getAccessToken()
  return token
}

// Rotta per l'elenco corsi
app.get('/classroom/courses', async (c) => {
  try {
    const token = await getAccessToken()
    const resp = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await resp.json()
    const courses = data.courses || []

    return c.json(courses.map((corso: any) => ({
      id: corso.id,
      title: corso.name,
      subtitle: corso.section,
      link: corso.alternateLink,
      creationTime: corso.creationTime // CORRETTO: era createTime
    })))
  } catch (error) {
    return c.json({ error: 'Errore nel recupero corsi' }, 500)
  }
})

// Rotta per il dettaglio del corso
app.get('/classroom/courses/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const token = await getAccessToken()
    const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const corso = await resp.json()

    return c.json({
      id: corso.id,
      title: corso.name,
      subtitle: corso.section,
      description: corso.description,
      link: corso.alternateLink,
      creationTime: corso.creationTime // CORRETTO: era createTime
    })
  } catch (error) {
    return c.json({ error: 'Errore nel recupero dettaglio corso' }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
