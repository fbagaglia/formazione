import { google } from 'googleapis';

/**
 * Funzione per ottenere un token di accesso valido utilizzando il Refresh Token.
 * Richiede le variabili d'ambiente: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN.
 */
async function getAccessToken(): Promise<string> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  try {
    // getAccessToken() rinfresca automaticamente il token se scaduto utilizzando il refresh_token
    const { token } = await oauth2Client.getAccessToken();
    return token || '';
  } catch (error) {
    console.error('Errore durante il recupero del token di accesso:', error);
    throw new Error('Autenticazione Google fallita: verifica Client ID, Secret e Refresh Token');
  }
}

/**
 * Recupera l'elenco dei corsi attivi dall'account Google Classroom collegato.
 */
export async function getCourses() {
  const token = await getAccessToken();
  
  const response = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    // Diagnostica avanzata: leggiamo il motivo del "Forbidden" fornito da Google
    const errorBody = await response.json().catch(() => ({}));
    console.error('Google API Error Details:', JSON.stringify(errorBody, null, 2));
    
    const message = errorBody.error?.message || response.statusText;
    throw new Error(`Google API error: ${response.status} ${message}. Verifica se la Classroom API è abilitata e se gli scope del token sono corretti.`);
  }

  const data = await response.json();
  const courses = data.courses || [];

  return courses.map((course: any) => ({
    id: course.id,
    title: course.name,
    subtitle: course.section,
    link: course.alternateLink,
    creationTime: course.creationTime
  }));
}

/**
 * Recupera i dettagli di un singolo corso tramite il suo ID.
 */
export async function getCourseDetail(id: string) {
  const token = await getAccessToken();
  
  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${id}`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error('Google API Error Details:', JSON.stringify(errorBody, null, 2));
    
    const message = errorBody.error?.message || response.statusText;
    throw new Error(`Google API error: ${response.status} ${message}`);
  }

  const course = await response.json();

  return {
    id: course.id,
    title: course.name,
    subtitle: course.section,
    description: course.description,
    link: course.alternateLink,
    creationTime: course.creationTime
  };
}
