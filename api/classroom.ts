import { google } from 'googleapis'

/**
 * Funzione per ottenere il token di accesso.
 * Ricorda di aver impostato le variabili GOOGLE_CLIENT_ID, 
 * GOOGLE_CLIENT_SECRET e GOOGLE_REFRESH_TOKEN su Vercel.
 */
async function getAccessToken() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  })

  const { token } = await oauth2Client.getAccessToken()
  return token || ''
}

export async function getCourses() {
  const token = await getAccessToken()
  const resp = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  const data = await resp.json()
  const courses = data.courses || []

  return courses.map((corso: any) => ({
    id: corso.id,
    title: corso.name,
    subtitle: corso.section,
    link: corso.alternateLink,
    creationTime: corso.creationTime
  }))
}

export async function getCourseDetail(id: string) {
  const token = await getAccessToken()
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  const corso = await resp.json()

  return {
    id: corso.id,
    title: corso.name,
    subtitle: corso.section,
    description: corso.description,
    link: corso.alternateLink,
    creationTime: corso.creationTime
  }
}
