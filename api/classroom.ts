import { google } from 'googleapis';

/**
 * Franco, ho rimosso tutti i dati "MOCK" da questo file.
 * Ora, se le variabili d'ambiente sono corrette, vedrai solo i dati del tuo Classroom.
 * Se c'è un errore di autorizzazione, il sistema solleverà un'eccezione visibile nei log.
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Credenziali Google mancanti nelle variabili d'ambiente.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { token } = await oauth2Client.getAccessToken();
    if (!token) throw new Error("Google non ha restituito un token di accesso.");
    return token;
  } catch (error: any) {
    throw new Error(`OAuth2 Refresh failed: ${error.message}`);
  }
}

export async function getCourses() {
  const token = await getAccessToken();
  const resp = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!resp.ok) throw new Error(`Classroom API error: ${resp.statusText}`);
  const data = await resp.json();
  return (data.courses || []).map((c: any) => ({
    id: c.id,
    title: c.name,
    subtitle: c.section,
    link: c.alternateLink
  }));
}

export async function getCourseDetail(id: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!resp.ok) throw new Error(`Course detail error: ${resp.statusText}`);
  const c = await resp.json();
  return {
    id: c.id,
    title: c.name,
    subtitle: c.section,
    description: c.description,
    link: c.alternateLink
  };
}

export async function getAnnouncements(courseId: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!resp.ok) throw new Error(`Announcements error: ${resp.statusText}`);
  const data = await resp.json();
  return data.announcements || [];
}

export async function getCourseWork(courseId: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!resp.ok) throw new Error(`CourseWork error: ${resp.statusText}`);
  const data = await resp.json();
  return data.courseWork || [];
}
