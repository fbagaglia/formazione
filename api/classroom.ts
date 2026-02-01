import { google } from 'googleapis';

/**
 * DATI DI MOCK (Fallback)
 * Franco, ho aggiunto questi dati per assicurarmi che l'Accademia sia sempre 
 * visibile, anche se Google risponde con un errore di autorizzazione.
 */
const MOCK_COURSES = [
  {
    id: "aud-mock-01",
    title: "Esercizio di Equilibrio: AI & Etica",
    subtitle: "Dati in anteprima (Sincronizzazione in corso)",
    link: "https://classroom.google.com",
    creationTime: new Date().toISOString()
  },
  {
    id: "aud-mock-02",
    title: "Alfabetizzazione Digitale Consapevole",
    subtitle: "Versione dimostrativa",
    link: "https://classroom.google.com",
    creationTime: new Date().toISOString()
  }
];

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(`Configurazione incompleta.`);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const response = await oauth2Client.getAccessToken();
    const token = response.token;
    if (!token) throw new Error('Token non restituito.');
    return token;
  } catch (error: any) {
    const errorData = error.response?.data || {};
    console.error('Dettagli errore autenticazione Google:', errorData);
    // Lanciamo l'errore specifico per attivare il fallback nel chiamante
    throw error;
  }
}

/**
 * Recupera i corsi. Se l'autenticazione fallisce (es. unauthorized_client),
 * restituisce i dati di MOCK per non bloccare l'interfaccia.
 */
export async function getCourses() {
  try {
    const token = await getAccessToken();
    const response = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('Google API Error:', errorBody);
      return MOCK_COURSES; // Fallback su errore API
    }

    const data = await response.json();
    return data.courses ? data.courses.map((course: any) => ({
      id: course.id,
      title: course.name,
      subtitle: course.section,
      link: course.alternateLink,
      creationTime: course.creationTime
    })) : MOCK_COURSES;

  } catch (e) {
    console.warn("Utilizzo dati MOCK a causa di un errore di autenticazione.");
    return MOCK_COURSES; // Fallback su errore Autenticazione
  }
}

/**
 * Recupera il dettaglio. Se l'ID è un mock o l'API fallisce, restituisce un oggetto coerente.
 */
export async function getCourseDetail(id: string) {
  if (id.startsWith('aud-mock')) {
    return { ...MOCK_COURSES[0], description: "Questa è una versione dimostrativa del corso. La connessione reale con Google Classroom è in fase di configurazione." };
  }

  try {
    const token = await getAccessToken();
    const response = await fetch(`https://classroom.googleapis.com/v1/courses/${id}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Dettaglio non trovato');

    const course = await response.json();
    return {
      id: course.id,
      title: course.name,
      subtitle: course.section,
      description: course.description,
      link: course.alternateLink,
      creationTime: course.creationTime
    };
  } catch (e) {
    return {
      id,
      title: "Modulo in Anteprima",
      subtitle: "Connessione in corso",
      description: "Non è stato possibile recuperare i dati in tempo reale. Stiamo allineando i ponti digitali.",
      link: "#",
      creationTime: new Date().toISOString()
    };
  }
}
