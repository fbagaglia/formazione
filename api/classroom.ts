import { google } from 'googleapis';

// Definizione delle interfacce per garantire la correttezza dei tipi (Fix TS18046)
interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  description?: string;
  alternateLink: string;
}

interface ClassroomAnnouncement {
  id: string;
  text?: string;
  updateTime: string;
  materials?: any[];
}

interface ClassroomCourseWork {
  id: string;
  title: string;
  alternateLink: string;
  dueDate?: any;
}

interface ClassroomTopic {
  topicId: string;
  name: string;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Credenziali Google mancanti.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { token } = await oauth2Client.getAccessToken();
  if (!token) throw new Error("Impossibile ottenere il token.");
  return token;
}

export async function getCourses() {
  const token = await getAccessToken();
  const resp = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await resp.json() as { courses?: ClassroomCourse[] };
  return (data.courses || []).map(c => ({
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
  
  const c = await resp.json() as ClassroomCourse;
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
  
  const data = await resp.json() as { announcements?: ClassroomAnnouncement[] };
  return data.announcements || [];
}

export async function getCourseWork(courseId: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  const data = await resp.json() as { courseWork?: ClassroomCourseWork[] };
  return data.courseWork || [];
}

// Implementazione mancante per i materiali (Fix TS2305)
export async function getMaterials(courseId: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWorkMaterials`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json() as { courseWorkMaterial?: any[] };
  return data.courseWorkMaterial || [];
}

// Implementazione mancante per gli argomenti (Fix TS2305)
export async function getTopics(courseId: string) {
  const token = await getAccessToken();
  const resp = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/topics`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json() as { topic?: ClassroomTopic[] };
  return data.topic || [];
}
