const params = new URLSearchParams(window.location.search)
const courseId = params.get('id')
const courseRoot = document.querySelector('#course-root')

if (!courseId) {
  courseRoot.innerHTML = renderError(
    'Nessun corso indicato',
    'Aggiungi il parametro "id" all’URL per visualizzare una scheda corso.'
  )
} else {
  loadCourse(courseId)
}

async function loadCourse(id) {
  try {
    const response = await fetch(`/api/${encodeURIComponent(id)}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const course = await response.json()
    renderCourse(course)
  } catch (error) {
    console.error('Errore caricamento corso', error)
    courseRoot.innerHTML = renderError(
      'Impossibile caricare il corso',
      'Controlla che il corso esista su Google Classroom o riprova più tardi.'
    )
  }
}

function renderCourse(course) {
  const template = document.querySelector('#course-template')
  const node = template.content.cloneNode(true)

  const titleEls = node.querySelectorAll('[data-course-title]')
  titleEls.forEach((el) => (el.textContent = course.title || 'Corso senza titolo'))

  node.querySelector('[data-course-subtitle]').textContent =
    course.subtitle || 'Percorso di formazione sull’Umanesimo Digitale'

  const cta = node.querySelector('[data-course-link]')
  if (course.link) {
    cta.href = course.link
  } else {
    cta.remove()
  }

  const descEl = node.querySelector('[data-course-description]')
  descEl.textContent = course.description ||
    'Questo corso è collegato a Google Classroom. Accedi per consultare materiali, attività e sessioni.'

  const metadataEl = node.querySelector('[data-course-metadata]')
  const badges = []
  if (course.audience) badges.push(createInfoCard('Destinatari', course.audience))
  if (course.duration) badges.push(createInfoCard('Durata', course.duration))
  if (Array.isArray(course.tags) && course.tags.length > 0) {
    badges.push(createInfoCard('Competenze', course.tags.join(', ')))
  }
  if (badges.length > 0) {
    badges.forEach((card) => metadataEl.appendChild(card))
  } else {
    metadataEl.remove()
  }

  if (Array.isArray(course.sessions) && course.sessions.length > 0) {
    const sessionSection = node.querySelector('[data-session-section]')
    const sessionGrid = node.querySelector('[data-session-grid]')
    const sessionTemplate = document.querySelector('#session-card-template')

    course.sessions.forEach((session) => {
      const sessionNode = sessionTemplate.content.cloneNode(true)
      sessionNode.querySelector('[data-session-title]').textContent = session.title || 'Sessione'
      sessionNode.querySelector('[data-session-subtitle]').textContent =
        session.subtitle || 'Approfondimento narrativo'
      sessionNode.querySelector('[data-session-summary]').textContent =
        session.summary || 'Accedi a Google Classroom per consultare i materiali.'

      const linkEl = sessionNode.querySelector('[data-session-link]')
      if (session.link) {
        linkEl.href = session.link
      } else {
        linkEl.remove()
      }

      sessionGrid.appendChild(sessionNode)
    })

    sessionSection.hidden = false
  }

  if (Array.isArray(course.resources) && course.resources.length > 0) {
    const resourceSection = node.querySelector('[data-resource-section]')
    const resourceList = node.querySelector('[data-resource-list]')
    const resourceTemplate = document.querySelector('#resource-item-template')

    course.resources.forEach((resource) => {
      const resourceNode = resourceTemplate.content.cloneNode(true)
      const linkEl = resourceNode.querySelector('[data-resource-link]')
      const titleEl = resourceNode.querySelector('[data-resource-title]')
      const descEl = resourceNode.querySelector('[data-resource-description]')

      if (resource.url) {
        linkEl.href = resource.url
      } else {
        linkEl.removeAttribute('href')
      }

      titleEl.textContent = resource.title || 'Risorsa'
      descEl.textContent = resource.description || ''

      resourceList.appendChild(resourceNode)
    })

    resourceSection.hidden = false
  }

  courseRoot.innerHTML = ''
  courseRoot.appendChild(node)
}

function createInfoCard(label, value) {
  const div = document.createElement('div')
  div.className = 'info-card'
  div.innerHTML = `
    <span class="meta-label">${escapeHtml(label)}</span>
    <p>${escapeHtml(value)}</p>
  `
  return div
}

function renderError(title, message) {
  return `
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">${escapeHtml(title)}</h2>
        <p class="section__subtitle">${escapeHtml(message)}</p>
      </div>
    </section>
  `
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
