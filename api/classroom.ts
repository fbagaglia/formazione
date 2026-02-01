import { google } from 'googleapis';

/**
 * Funzione per ottenere un token di accesso valido utilizzando il Refresh Token.
 * L'errore 'unauthorized_client' indica che le credenziali (ID o Secret) non corrispondono
 * al progetto che ha emesso il Refresh Token.
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push('GOOGLE_CLIENT_ID');
    if (!clientSecret) missing.push('GOOGLE_CLIENT_SECRET');
    if (!refreshToken) missing.push('GOOGLE_REFRESH_TOKEN');
    
    throw new Error(`Configurazione incompleta. Variabili mancanti: ${missing.join(', ')}.`);
  }

  // Inizializzazione client OAuth2
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  try {
    // Scambio del Refresh Token per un Access Token
    const response = await oauth2Client.getAccessToken();
    const token = response.token;
    
    if (!token) {
      throw new Error('Google non ha restituito un token di accesso.');
    }
    
    return token;
  } catch (error: any) {
    // Log tecnico specifico per individuare la causa nel pannello Vercel
    const errorData = error.response?.data || {};
    console.error('Dettagli errore autenticazione Google:', {
      message: error.message,
      error_code: errorData.error,
      error_description: errorData.error_description
    });

    if (errorData.error === 'unauthorized_client' || error.message.includes('unauthorized_client')) {
      throw new Error('Autenticazione Fallita (unauthorized_client): Il Client ID o il Secret non corrispondono a quelli usati per generare il Refresh Token. Rigenera le credenziali o il token.');
    }
    
    throw new Error(`Autenticazione Google fallita: ${error.message}`);
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
    const errorBody = await response.json().catch(() => ({}));
    console.error('Google API Error Details (Courses):', JSON.stringify(errorBody, null, 2));
    
    const message = errorBody.error?.message || response.statusText;
    throw new Error(`Google API error: ${response.status} ${message}.`);
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
    console.error('Google API Error Details (Detail):', JSON.stringify(errorBody, null, 2));
    
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
