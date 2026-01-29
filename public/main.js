const ENDPOINT = '/api/classroom/courses'

const courseListEl = document.querySelector('#course-list')

async function loadCourses() {
  try {
    const response = await fetch(ENDPOINT)
    if (!response.ok) {
      throw new Error(`Impossibile recuperare i corsi (status ${response.status})`)
    }

    const courses = await response.json()

    if (!Array.isArray(courses) || courses.length === 0) {
      courseListEl.innerHTML = renderEmptyState()
      return
    }

    const fragment = document.createDocumentFragment()

    courses.forEach((course) => {
      const card = document.createElement('article')
      card.className = 'course-card'
      card.role = 'listitem'

      const updatedAt = course.updateTime ? formatDate(course.updateTime) : null

      card.innerHTML = `
        <div>
          <h3>${escapeHtml(course.title || 'Corso senza titolo')}</h3>
          <p>${escapeHtml(course.subtitle || 'Formazione umanista digitale')}</p>
        </div>
        <div class="meta-row">
          ${updatedAt ? `<span>Aggiornato il ${updatedAt}</span>` : ''}
          ${course.section ? `<span>Sezione: ${escapeHtml(course.section)}</span>` : ''}
          ${course.subject ? `<span>Materia: ${escapeHtml(course.subject)}</span>` : ''}
        </div>
        <div>
          <a class="button button--inline" href="./corso.html?id=${encodeURIComponent(course.id)}">
            Apri scheda
            <span aria-hidden="true">→</span>
          </a>
        </div>
      `

      fragment.appendChild(card)
    })

    courseListEl.innerHTML = ''
    courseListEl.appendChild(fragment)
  } catch (error) {
    console.error('Errore caricamento corsi', error)
    courseListEl.innerHTML = renderErrorState(error)
  }
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <h3>Nessun corso disponibile</h3>
      <p>Al momento non risultano corsi attivi su Google Classroom collegati all'Accademia.</p>
    </div>
  `
}

function renderErrorState(error) {
  return `
    <div class="error-state">
      <h3>Ops, qualcosa non va</h3>
      <p>Non siamo riusciti a recuperare i corsi. Riprova più tardi.</p>
      <pre>${escapeHtml(error.message || 'Errore sconosciuto')}</pre>
    </div>
  `
}

function formatDate(isoString) {
  const formatter = new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return formatter.format(new Date(isoString))
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

loadCourses()
