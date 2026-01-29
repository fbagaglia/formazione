import { google } from 'googleapis'

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('[googleAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables.')
}

if (!GOOGLE_REFRESH_TOKEN) {
  console.warn('[googleAuth] Missing GOOGLE_REFRESH_TOKEN environment variable. Google Classroom API calls will fail.')
}

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

oauth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN,
})

export const getAuthenticatedClient = async () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google OAuth credentials are not configured correctly.')
  }

  // The googleapis client automatically refreshes the access token when needed.
  return oauth2Client
}
