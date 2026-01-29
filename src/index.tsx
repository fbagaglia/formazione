import { Hono } from 'hono'
import { renderer } from './renderer'

const SITE_TITLE = "Accademia dell'Umanesimo Digitale"
const SITE_SUBTITLE = `Laboratorio di Longlife Learning sulle competenze digitali e l'intelligenza artificiale`
const SITE_TAGLINE =
  'Un ecosistema di apprendimento continuo per coltivare consapevolezza tecnologica, creatività e responsabilità sociale.'

type ResourceLink = {
  label: string
  url: string
  description?: string
}

type SessionElement =
  | {
      type: 'text'
      heading?: string
      body: string
    }
  | {
      type: 'image'
      src: string
      alt: string
      caption?: string
    }
  | {
      type: 'video'
      platform?: 'youtube'
      title: string
      videoId: string
      description?: string
    }
  | {
      type: 'link'
      title: string
      url: string
      description?: string
    }
  | {
      type: 'html'
      title?: string
      html: string
    }
  | {
      type: 'code'
      title?: string
      language: string
      code: string
      description?: string
    }

type Session = {
  slug: string
  title: string
  subtitle: string
  summary: string
  image: string
  youtubeId: string
  flow: SessionElement[]
  keyConcepts: string[]
  resources: ResourceLink[]
  practiceIdeas: string[]
  inspirationalQuote?: {
    text: string
    author: string
  }
}

type Course = {
  slug: string
  title: string
  description: string
  audience: string
  duration: string
  skills: string[]
  sessions: Session[]
}

const courses: Course[] = [
  {
    slug: 'alfabetizzazione-ai',
    title: "Alfabetizzazione Critica all'Intelligenza Artificiale",
    description:
      "Leggere gli algoritmi con occhi umanisti per accompagnare persone e comunità in un uso consapevole delle tecnologie emergenti.",
    audience: 'Docenti, formatori, professionisti della cultura',
    duration: '6 moduli · 18 ore',
    skills: ['Pensiero critico', "Etica dell'AI", 'Analisi dei dati'],
    sessions: [
      {
        slug: 'sguardi-umanisti-sull-ai',
        title: "Sguardi Umanisti sull'Intelligenza Artificiale",
        subtitle: 'Comprendere la tecnologia a partire dalle persone',
        summary:
          "Una panoramica narrativa sulle tappe fondamentali dell'AI interpretate attraverso i valori dell'umanesimo digitale, con casi studio e momenti di riflessione guidata.",
        image:
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'JMUxmLyrhSk',
        flow: [
          {
            type: 'text',
            heading: 'Ecologia dei dati',
            body:
              "Mappiamo le traiettorie dei dati che alimentano gli algoritmi e analizziamo cosa significa progettare dataset equi, rappresentativi e rispettosi delle persone coinvolte.",
          },
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
            alt: 'Mappa concettuale collaborativa con post-it colorati e laptop',
            caption: 'Visual mapping collettivo per tracciare fonti e qualità dei dataset utilizzati.',
          },
          {
            type: 'text',
            heading: 'Trasparenza e narrativa',
            body:
              'Esploriamo come raccontare il funzionamento di un modello complesso attraverso metafore accessibili, storyboard e strumenti visuali che favoriscono la comprensione collettiva.',
          },
          {
            type: 'link',
            title: 'Toolkit Data Storytelling di School of Data',
            url: 'https://schoolofdata.org/toolkit/',
            description: 'Strumenti pratici per trasformare dataset in narrazioni civiche e accessibili.',
          },
          {
            type: 'text',
            heading: 'Diritti digitali attivi',
            body:
              "Dal GDPR ai manifesti etici: costruiamo un kit di domande critiche per valutare la qualità di un servizio AI e scegliere con cognizione di causa.",
          },
          {
            type: 'html',
            title: 'Domande guida per il dibattito',
            html: `<ul class="flow-list"><li>Chi trae beneficio dal modello e chi resta invisibile?</li><li>Quali diritti attiviamo nel momento in cui raccogliamo nuovi dati?</li><li>Quali contro-narrazioni possiamo attivare per includere prospettive marginalizzate?</li></ul>`,
          },
          {
            type: 'video',
            title: 'Conversazione con Kate Crawford',
            videoId: '8uj0bvoTH5M',
            description: 'Un dialogo sulle implicazioni sociali dell’AI e sulle responsabilità condivise delle comunità educative.',
          },
        ],
        keyConcepts: ['Accountability', 'Explainability', 'Dati come beni comuni'],
        resources: [
          {
            label: 'Manifesto per un Umanesimo Digitale',
            url: 'https://content.unesco.org',
            description: 'Linee guida UNESCO su AI e diritti umani.',
          },
          {
            label: 'Algorithmic Accountability Policy Toolkit',
            url: 'https://ainowinstitute.org/aap-toolkit.pdf',
            description: 'Toolkit pratico per valutare progetti AI.',
          },
          {
            label: 'Valutare un dataset',
            url: 'https://montrealethics.ai',
            description: 'Checklist per audit di dati in ottica etica.',
          },
        ],
        practiceIdeas: [
          'Mappa le fonti di dati del tuo contesto educativo e valuta rischi e opportunità con il canvas etico fornito.',
          'Organizza un laboratorio narrativo per spiegare un algoritmo attraverso una storia o una metafora visiva.',
          'Redigi una carta dei diritti digitali per i partecipanti al tuo corso o progetto.',
        ],
        inspirationalQuote: {
          text: 'La tecnologia è davvero umana quando restituisce alle persone la loro capacità di immaginare il futuro.',
          author: 'Franco Bagaglia',
        },
      },
      {
        slug: 'laboratori-di-etica-applicata',
        title: 'Laboratori di etica applicata per progettisti digitali',
        subtitle: 'Dal dilemma teorico alla decisione condivisa',
        summary:
          'Sessione laboratoriale che guida la trasformazione di principi etici in pratiche concrete per team educativi, culturali e aziendali.',
        image:
          'https://images.unsplash.com/photo-1531498860502-7c67cf02f77b?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'h8K9kTnJY2A',
        flow: [
          {
            type: 'text',
            heading: 'Mappe di stakeholder empatiche',
            body:
              'Disegniamo insieme le emozioni, i bisogni e le paure delle persone coinvolte in un progetto AI per anticipare impatti e trovare soluzioni inclusive.',
          },
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80',
            alt: 'Team interdisciplinare che analizza sticky notes e customer journey map',
            caption: 'Workshop con stakeholder map per far emergere emozioni e rischi.',
          },
          {
            type: 'text',
            heading: 'Simulazioni decisionali',
            body:
              'Applichiamo framework etici (care ethics, consequentialism) a casi reali per allenare la valutazione rapida e dialogica nei team interdisciplinari.',
          },
          {
            type: 'code',
            title: 'Canvas per decisioni etiche condivise',
            language: 'markdown',
            code: `### Decision Canvas\n- Scenario: scegliere un algoritmo di valutazione candidature\n- Valori guida: equità, trasparenza, cura\n- Domande chiave:\n  1. Chi resta escluso dai dati?\n  2. Qual è il piano di ascolto continuo?\n  3. Come misuriamo la fiducia?`,
            description: 'Schema rapido da duplicare durante il laboratorio per orientare il confronto.',
          },
          {
            type: 'text',
            heading: 'Indicatori di equità',
            body:
              'Creiamo metriche offerte alle comunità per monitorare nel tempo la coerenza di un servizio digitale con i valori dichiarati.',
          },
          {
            type: 'link',
            title: 'Checklist Equità + Inclusione',
            url: 'https://inclusive.design/checklist',
            description: 'Una checklist aperta per valutare impatto e inclusione nei servizi digitali.',
          },
        ],
        keyConcepts: ['Stakeholder empathy map', 'Design justice', 'Metriche di equità'],
        resources: [
          {
            label: 'Design Justice Network Principles',
            url: 'https://designjustice.org',
            description: 'Principi per pratiche progettuali inclusive.',
          },
          {
            label: 'Ethics Canvas',
            url: 'https://www.ethicscanvas.org',
            description: 'Strumento collaborativo per valutare impatti etici.',
          },
          {
            label: 'IEEE Ethically Aligned Design',
            url: 'https://ethicsinaction.ieee.org',
            description: 'Standard internazionali per sistemi intelligenti affidabili.',
          },
        ],
        practiceIdeas: [
          'Facilita una simulazione di comitato etico con ruoli assegnati e briefing narrativo.',
          'Costruisci una matrice rischi/benefici per un progetto AI della tua organizzazione.',
          'Progetta un kit di indicatori qualitativi da integrare nei report periodici.',
        ],
      },
    ],
  },
  {
    slug: 'progettazione-formativa-digitale',
    title: 'Progettazione Formativa Digitale Inclusiva',
    description:
      'Strumenti e metodologie per ripensare la didattica con il supporto dell’AI generativa, mantenendo l’apprendente al centro del percorso.',
    audience: 'Coordinatori didattici, instructional designer, tutor',
    duration: '5 moduli · 15 ore',
    skills: ['Learning design', 'Valutazione personalizzata', 'Storytelling multimediale'],
    sessions: [
      {
        slug: 'architetture-di-apprendimento-ibrido',
        title: 'Architetture di apprendimento ibrido con AI generativa',
        subtitle: 'Esperienze blended che valorizzano autonomia e comunità',
        summary:
          'Descriviamo strutture didattiche che combinano incontri sincroni, microlearning, tutoraggio algoritmico e pratiche riflessive supportate da co-piloti intelligenti.',
        image:
          'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'Gv0J55JpAzE',
        flow: [
          {
            type: 'text',
            heading: 'Blueprint modulare',
            body: 'Analizziamo come suddividere un percorso in unità flessibili, con obiettivi misurabili e momenti di cura relazionale potenziati dall’AI.',
          },
          {
            type: 'html',
            title: 'Sequenza consigliata',
            html: `<ol class="flow-ol"><li>Warm-up narrativo e definizione aspettative</li><li>Microlearning asincrono guidato da AI tutor</li><li>Laboratorio sincrono di co-design</li><li>Riflessione guidata e piano d'azione</li></ol>`,
          },
          {
            type: 'text',
            heading: 'Persona-matrice',
            body:
              'Costruiamo profili narrativi di studenti e professionisti per progettare micro-esperienze adattive e percorsi di mentoring personalizzati.',
          },
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
            alt: 'Designer che annota appunti su tablet durante sessione di co-design',
            caption: 'Persona canvas digitale condiviso in tempo reale con i partecipanti.',
          },
          {
            type: 'text',
            heading: 'Metriche di apprendimento profondo',
            body:
              'Definiamo indicatori qualitativi e quantitativi che misurino crescita, consapevolezza e impatto nel tempo, evitando la gamification fine a sé stessa.',
          },
          {
            type: 'code',
            title: 'Esempio di learning analytics etico (JSON)',
            language: 'json',
            code: `{
  "learner_id": "pseudonym-218",
  "signals": [
    { "type": "reflection", "quality": "approfondita" },
    { "type": "collaboration", "evidence": "canvas condiviso" }
  ],
  "actions": ["invia feedback narrativo", "proponi mentoring pari"]
}`,
            description: 'Struttura dati anonimizzata per una dashboard di apprendimento responsabile.',
          },
        ],
        keyConcepts: ['Adaptive learning', 'Microlearning riflessivo', 'Learning analytics etico'],
        resources: [
          {
            label: 'AI and the Future of Teaching & Learning',
            url: 'https://tech.ed.gov/ai-future/',
            description: 'Linee guida del Department of Education USA.',
          },
          {
            label: 'Learning Designer Toolkit',
            url: 'https://learningdesigner.org',
            description: 'Risorse per progettare attività ibride personalizzate.',
          },
          {
            label: 'Jisc AI in Learning',
            url: 'https://www.jisc.ac.uk/reports/a-beginners-guide-to-using-ai-in-learning',
            description: 'Rapporto pratico su AI e inclusione educativa.',
          },
        ],
        practiceIdeas: [
          'Crea una mappa concettuale del tuo percorso e identifica gli snodi dove un co-pilota AI può sostenere la personalizzazione.',
          'Disegna tre scenari di studente tipo e pianifica le relative micro-esperienze.',
          'Stabilisci indicatori narrativi di impatto e definisci come raccogliere feedback qualitativi.',
        ],
      },
      {
        slug: 'valutazione-dialogica',
        title: 'Valutazione dialogica e tracciamento narrativo',
        subtitle: 'Rubriche qualitative per accompagnare la crescita continua',
        summary:
          'Esploriamo strumenti di valutazione che intrecciano evidenze quantitative e narrazioni riflessive, sfruttando l’AI per fornire feedback contestuale senza perdere l’ascolto umano.',
        image:
          'https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'de2s1pDjWnM',
        flow: [
          {
            type: 'text',
            heading: 'Rubriche conversazionali',
            body:
              'Progettiamo rubriche che generano dialogo: suggeriamo prompt e micro-feedback precompilati che il docente può personalizzare, mantenendo trasparenza e calore.',
          },
          {
            type: 'link',
            title: 'Template di rubrica dialogica (Google Doc)',
            url: 'https://docs.google.com/document/d/feedback-dialogico-template',
            description: 'Modello duplicabile per impostare rubriche narrative ibride.',
          },
          {
            type: 'text',
            heading: 'Portfolio dinamico',
            body:
              'Guidiamo la costruzione di un portfolio narrativo dove l’AI suggerisce connessioni tra artefatti, evidenze e obiettivi di crescita.',
          },
          {
            type: 'video',
            title: 'Esempio di portfolio aumentato',
            videoId: 'kzV3-dmJk5k',
            description: 'Walkthrough di un portfolio generativo che intreccia artefatti, riflessioni e analytics.',
          },
          {
            type: 'text',
            heading: 'Analisi etica dei dati valutativi',
            body:
              'Stabiliamo regole di gestione dati che rispettano privacy, diversità e diritto all’errore, con checklist integrate nella progettazione.',
          },
          {
            type: 'html',
            title: 'Principi per una valutazione responsabile',
            html: `<blockquote class="flow-quote">Mettiamo al centro la dignità della persona valutata, garantendo contesto, dialogo e diritto alla revisione.</blockquote>`,
          },
        ],
        keyConcepts: ['Assessment for learning', 'Feedback generativo', 'Privacy by design'],
        resources: [
          {
            label: 'European Framework for the Digital Competence of Educators',
            url: 'https://joint-research-centre.ec.europa.eu/digcompedu_en',
            description: 'Framework di riferimento europeo per la competenza digitale dei docenti.',
          },
          {
            label: 'AI Feedback Guidelines',
            url: 'https://www.advancehe.ac.uk',
            description: 'Raccolta di buone pratiche per feedback supportato da AI.',
          },
          {
            label: 'Privacy & Ethics Toolkit',
            url: 'https://datasociety.net/library/educator-toolkit',
            description: 'Toolkit per una governance dei dati responsabile.',
          },
        ],
        practiceIdeas: [
          'Co-crea con i tuoi studenti un glossario condiviso per interpretare rubriche e feedback.',
          'Progetta una dashboard narrativa che racconti i progressi attraverso storie e dati significativi.',
          'Definisci un patto formativo che tuteli la privacy e valorizzi la crescita personale.',
        ],
        inspirationalQuote: {
          text: 'Valutare significa prendersi cura: ogni dato deve portare una voce umana.',
          author: 'bell hooks',
        },
      },
    ],
  },
  {
    slug: 'immaginari-creativi-ai',
    title: 'Immaginari Creativi con l’AI Generativa',
    description:
      'Un viaggio tra storytelling, arti visive e design speculativo per creare esperienze culturali che amplificano la creatività umana.',
    audience: 'Curatori culturali, storyteller, designer, team di innovazione',
    duration: '4 moduli · 12 ore',
    skills: ['Prompt design narrativo', 'Visual storytelling', 'Design speculativo'],
    sessions: [
      {
        slug: 'atlanti-visuali',
        title: 'Atlanti visuali per narrazioni aumentate',
        subtitle: 'Co-creare immaginari condivisi con AI generativa',
        summary:
          'Trasformiamo archivi, collezioni e memorie locali in atlanti visuali dinamici, costruendo narrazioni plurali grazie a strumenti generativi multimodali.',
        image:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'QNIWgS5Y6Kk',
        flow: [
          {
            type: 'text',
            heading: 'Ricerca iconografica aumentata',
            body:
              'Combiniamo dataset open e archivi di comunità per generare moodboard inclusivi e multivocali, con attenzione alle licenze creative commons.',
          },
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
            alt: 'Collezione di stampe artistiche e fotografie su tavolo luminoso',
            caption: 'Atlante visuale composto da materiali d’archivio e generazioni AI annotate.',
          },
          {
            type: 'text',
            heading: 'Storyworld partecipativi',
            body:
              'Progettiamo mondi narrativi dove l’AI suggerisce varianti e il pubblico contribuisce con micro-narrazioni, mantenendo coerenza etica e culturale.',
          },
          {
            type: 'html',
            title: 'Ritmo di co-creazione',
            html: `<div class="flow-grid-mini"><span class="flow-chip">Ascolto</span><span class="flow-chip">Generazione</span><span class="flow-chip">Discussione</span><span class="flow-chip">Curatela</span></div>`,
          },
          {
            type: 'text',
            heading: 'Etica delle immagini sintetiche',
            body:
              'Analizziamo bias, rappresentazioni e responsabilità nel diffondere immagini generate, co-creando linee guida di attribuzione e contestualizzazione.',
          },
          {
            type: 'link',
            title: 'Linee guida Attribution Lab',
            url: 'https://attributionlab.org/generative-images',
            description: 'Esempi di carte etiche per immagini sintetiche collaborative.',
          },
        ],
        keyConcepts: ['Commons culturali', 'Prompt sensibile', 'Licenze aperte'],
        resources: [
          {
            label: 'Creative Commons AI Toolkit',
            url: 'https://creativecommons.org',
            description: 'Toolkit per gestire diritti e attribuzioni nelle opere generate.',
          },
          {
            label: 'Open Culture Data Sets',
            url: 'https://openculture.com',
            description: 'Banche dati aperte per progetti culturali digitali.',
          },
          {
            label: 'Mozilla Responsible AI Challenge',
            url: 'https://foundation.mozilla.org',
            description: 'Progetti e linee guida per un’AI creativa responsabile.',
          },
        ],
        practiceIdeas: [
          'Costruisci un atlante visuale di una comunità includendo contributi generativi annotati.',
          'Scrivi prompt narrativi che valorizzino voci marginali e reinterpretino i canoni.',
          'Redigi un manifesto visivo che spieghi come usi le immagini generate in modo trasparente.',
        ],
      },
      {
        slug: 'laboratorio-di-futuri',
        title: 'Laboratorio di futuri e scenari speculativi',
        subtitle: 'Dall’immaginazione sistemica all’azione collettiva',
        summary:
          'Una sessione interattiva che intreccia futures thinking, design fiction e generative AI per costruire narrazioni trasformative sul domani digitale.',
        image:
          'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
        youtubeId: 'K4x_Jp9kCNE',
        flow: [
          {
            type: 'text',
            heading: 'Signals hunting',
            body:
              'Raccogliamo segnali deboli da ricerca, arte e società per alimentare scenari plausibili e desiderabili, con canvas condivisi e mappe concettuali.',
          },
          {
            type: 'link',
            title: 'Segnali deboli - repository aperto',
            url: 'https://futurelibrary.xyz/signals',
            description: 'Raccolta collaborativa di segnali emergenti da usare come carburante narrativo.',
          },
          {
            type: 'text',
            heading: 'Design fiction collaborativa',
            body:
              'Scriviamo racconti brevi, podcast o installazioni speculative supportati da AI generativa, mantenendo coerenza valoriale e impatti misurabili.',
          },
          {
            type: 'code',
            title: 'Prompt incipit per scenari speculativi',
            language: 'text',
            code: `Scrivi una vignetta ambientata in {anno}, in cui la comunità di {luogo} utilizza un sistema AI per {funzione}. Descrivi almeno una tensione etica e una pratica di cura reciproca.`,
            description: 'Schema adattabile per generare storie con AI in modo responsabile.',
          },
          {
            type: 'text',
            heading: 'Prototipi conversazionali',
            body:
              'Costruiamo chatbot narrativi e guide interattive che simulano futuri alternativi, raccogliendo feedback dei partecipanti per iterazioni rapide.',
          },
          {
            type: 'video',
            title: 'Demo di chatbot narrativo speculativo',
            videoId: 'F58ip90z7ZA',
            description: 'Un esempio di dialogo che accompagna i visitatori dentro scenari futuri condivisi.',
          },
        ],
        keyConcepts: ['Futures literacy', 'Backcasting', 'Narrative prototyping'],
        resources: [
          {
            label: 'UNESCO Futures Literacy',
            url: 'https://en.unesco.org/futuresliteracy',
            description: 'Programmi e strumenti per la futures literacy.',
          },
          {
            label: 'Future Today Institute Trends',
            url: 'https://futuretodayinstitute.com',
            description: 'Report e strumenti per anticipare trend emergenti.',
          },
          {
            label: 'Cards for Humanity',
            url: 'https://cardsforhumanity.ideo.com',
            description: 'Carte per progettare soluzioni inclusive e responsabili.',
          },
        ],
        practiceIdeas: [
          'Organizza un laboratorio di scenari con ruoli narrativi supportati da AI.',
          'Produci un artefatto speculativo (poster, audio, micro-sito) che racconti un futuro desiderabile.',
          'Definisci indicatori sociali e culturali per monitorare gli impatti del futuro immaginato.',
        ],
        inspirationalQuote: {
          text: 'Immaginare futuri condivisi è un atto politico di cura reciproca.',
          author: 'Adrienne Maree Brown',
        },
      },
    ],
  },
]

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  c.set('title', 'Benvenutə')
  return c.render(<HomePage courses={courses} />)
})

app.get('/corsi/:courseSlug', (c) => {
  const { courseSlug } = c.req.param()
  const course = courses.find((item) => item.slug === courseSlug)

  if (!course) {
    return c.notFound()
  }

  c.set('title', course.title)
  return c.render(<CoursePage course={course} />)
})

app.get('/corsi/:courseSlug/sessioni/:sessionSlug', (c) => {
  const { courseSlug, sessionSlug } = c.req.param()
  const course = courses.find((item) => item.slug === courseSlug)

  if (!course) {
    return c.notFound()
  }

  const session = course.sessions.find((item) => item.slug === sessionSlug)

  if (!session) {
    return c.notFound()
  }

  c.set('title', session.title)
  return c.render(<SessionPage course={course} session={session} />)
})

const HomePage = ({ courses }: { courses: Course[] }) => {
  const featuredSessions = courses
    .flatMap((course) => course.sessions.map((session) => ({ course, session })))
    .slice(0, 3)

  return (
    <div class="page">
      <SiteHeader />
      <section class="hero">
        <div class="hero__content">
          <span class="hero__eyebrow pill pill--accent">Human-centered AI</span>
          <h1 class="hero__title">{SITE_TITLE}</h1>
          <p class="hero__subtitle">{SITE_SUBTITLE}</p>
          <p class="hero__text">{SITE_TAGLINE}</p>
          <div class="hero__actions">
            <a class="button button--primary" href="#catalogo">
              Esplora i corsi
            </a>
            <a class="button button--ghost" href="#sessioni">
              Scopri le sessioni
            </a>
          </div>
        </div>
      </section>

      <section id="catalogo" class="section">
        <div class="section__header">
          <span class="pill">Percorsi attivi</span>
          <h2 class="section__title">Catalogo dei corsi</h2>
          <p class="section__subtitle">
            Ciascun percorso intreccia contenuti narrativi, pratiche laboratoriali e strumenti digitali per accompagnare persone e organizzazioni verso un uso etico dell'AI.
          </p>
        </div>
        <div class="course-grid">
          {courses.map((course) => (
            <article class="course-card" key={course.slug}>
              <header class="course-card__header">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </header>
              <div class="course-card__meta">
                <div>
                  <span class="meta-label">Destinatari</span>
                  <p>{course.audience}</p>
                </div>
                <div>
                  <span class="meta-label">Durata</span>
                  <p>{course.duration}</p>
                </div>
              </div>
              <div class="course-card__skills">
                <span class="meta-label">Competenze coltivate</span>
                <ul class="tag-list">
                  {course.skills.map((skill) => (
                    <li class="tag" key={skill}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <footer class="course-card__footer">
                <a class="button button--inline" href={`/corsi/${course.slug}`}>
                  Vai al corso
                  <span aria-hidden="true">→</span>
                </a>
                <span class="course-card__sessions-count">
                  {course.sessions.length} sessioni
                </span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section id="sessioni" class="section section--muted">
        <div class="section__header">
          <span class="pill">Approfondimenti</span>
          <h2 class="section__title">Sessioni in evidenza</h2>
          <p class="section__subtitle">
            Ogni sessione è una pagina completa, ricca di strumenti, risorse e ispirazioni per integrare l'AI con sensibilità umanistica.
          </p>
        </div>
        <div class="session-grid">
          {featuredSessions.map(({ course, session }) => (
            <article class="session-card" key={`${course.slug}-${session.slug}`}>
              <div class="session-card__image">
                <img src={session.image} alt={session.title} loading="lazy" />
              </div>
              <div class="session-card__body">
                <span class="pill pill--soft">{course.title}</span>
                <h3 class="session-card__title">{session.title}</h3>
                <p class="text-muted">{session.subtitle}</p>
                <p>{session.summary}</p>
                <div class="session-card__footer">
                  <a
                    class="button button--inline"
                    href={`/corsi/${course.slug}/sessioni/${session.slug}`}
                  >
                    Vedi la sessione
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

const CoursePage = ({ course }: { course: Course }) => {
  return (
    <div class="page">
      <SiteHeader />
      <section class="subhero">
        <nav aria-label="Percorso" class="breadcrumbs">
          <a class="breadcrumbs__item" href="/">
            Home
          </a>
          <span class="breadcrumbs__separator">/</span>
          <span aria-current="page" class="breadcrumbs__item breadcrumbs__item--current">
            {course.title}
          </span>
        </nav>
        <h1 class="subhero__title">{course.title}</h1>
        <p class="subhero__subtitle">{course.description}</p>
        <div class="info-grid">
          <div class="info-card">
            <span class="meta-label">Destinatari</span>
            <p>{course.audience}</p>
          </div>
          <div class="info-card">
            <span class="meta-label">Durata</span>
            <p>{course.duration}</p>
          </div>
          <div class="info-card">
            <span class="meta-label">Competenze chiave</span>
            <ul class="tag-list">
              {course.skills.map((skill) => (
                <li class="tag" key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section__header">
          <span class="pill">Struttura del corso</span>
          <h2 class="section__title">Sessioni e laboratori</h2>
          <p class="section__subtitle">
            Ogni sessione è progettata come un ecosistema di contenuti multimediali, esercizi riflessivi e strumenti pronti all'uso.
          </p>
        </div>
        <ol class="session-outline">
          {course.sessions.map((session, index) => (
            <li class="session-outline__item" key={session.slug}>
              <span class="session-outline__index">{index + 1}</span>
              <div class="session-outline__content">
                <h3>{session.title}</h3>
                <p>{session.subtitle}</p>
                <div class="session-outline__actions">
                  <a
                    class="button button--inline"
                    href={`/corsi/${course.slug}/sessioni/${session.slug}`}
                  >
                    Apri sessione completa
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <SiteFooter />
    </div>
  )
}

const SessionPage = ({ course, session }: { course: Course; session: Session }) => {
  return (
    <div class="page">
      <SiteHeader />
      <section class="subhero subhero--session">
        <nav aria-label="Percorso" class="breadcrumbs">
          <a class="breadcrumbs__item" href="/">
            Home
          </a>
          <span class="breadcrumbs__separator">/</span>
          <a class="breadcrumbs__item" href={`/corsi/${course.slug}`}>
            {course.title}
          </a>
          <span class="breadcrumbs__separator">/</span>
          <span aria-current="page" class="breadcrumbs__item breadcrumbs__item--current">
            {session.title}
          </span>
        </nav>
        <h1 class="subhero__title">{session.title}</h1>
        <p class="subhero__subtitle">{session.subtitle}</p>
      </section>

      <section class="session-hero">
        <div class="session-hero__image">
          <img src={session.image} alt={session.title} loading="lazy" />
        </div>
        <div class="session-hero__summary">
          <p class="text-lead">{session.summary}</p>
          <div class="callout">
            <span class="meta-label">Concetti chiave</span>
            <ul class="tag-list">
              {session.keyConcepts.map((concept) => (
                <li class="tag" key={concept}>
                  {concept}
                </li>
              ))}
            </ul>
          </div>
          {session.inspirationalQuote && (
            <blockquote class="quote">
              <p>“{session.inspirationalQuote.text}”</p>
              <cite>— {session.inspirationalQuote.author}</cite>
            </blockquote>
          )}
        </div>
      </section>

      <section class="section">
        <div class="section__header">
          <span class="pill">Percorso narrativo</span>
          <h2 class="section__title">Mappa della sessione</h2>
          <p class="section__subtitle">
            Una costellazione modulare di testi, media, link e codici pronti da remixare nel tuo contesto.
          </p>
        </div>
        <div class="flow-grid">
          {session.flow.map((element, index) => (
            <SessionFlowBlock
              element={element}
              index={index + 1}
              key={`${session.slug}-flow-${index}`}
            />
          ))}
        </div>
      </section>

      <section class="section section--video">
        <div class="section__header">
          <span class="pill">Video guida</span>
          <h2 class="section__title">Apprendimento immersivo</h2>
          <p class="section__subtitle">
            Una selezione curatoriale di contenuti multimediali per approfondire e attivare discussioni consapevoli.
          </p>
        </div>
        <div class="video-frame">
          <iframe
            src={`https://www.youtube.com/embed/${session.youtubeId}?rel=0`}
            title={session.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section class="section">
        <div class="section__header">
          <span class="pill">Toolkit operativo</span>
          <h2 class="section__title">Risorse essenziali</h2>
          <p class="section__subtitle">
            Link, toolkit e riferimenti accuratamente selezionati per portare l'esperienza dentro la tua organizzazione.
          </p>
        </div>
        <ul class="resource-list">
          {session.resources.map((resource) => (
            <li class="resource-card" key={resource.url}>
              <a class="resource-card__link" href={resource.url} target="_blank" rel="noopener">
                <span class="resource-card__label">{resource.label}</span>
                {resource.description && <p>{resource.description}</p>}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section class="section section--muted">
        <div class="section__header">
          <span class="pill">Applicazione concreta</span>
          <h2 class="section__title">Attiva la trasformazione</h2>
          <p class="section__subtitle">
            Idee pratiche per portare nel quotidiano quanto esplorato nella sessione.
          </p>
        </div>
        <ul class="practice-list">
          {session.practiceIdeas.map((idea) => (
            <li class="practice-card" key={idea}>
              <p>{idea}</p>
            </li>
          ))}
        </ul>
      </section>
      <SiteFooter />
    </div>
  )
}

const SessionFlowBlock = ({ element, index }: { element: SessionElement; index: number }) => {
  const indexLabel = index.toString().padStart(2, '0')

  if (element.type === 'text') {
    return (
      <article class="flow-block flow-block--text">
        <span class="flow-block__index">{indexLabel}</span>
        {element.heading && <h3>{element.heading}</h3>}
        <p>{element.body}</p>
      </article>
    )
  }

  if (element.type === 'image') {
    return (
      <figure class="flow-block flow-block--image">
        <span class="flow-block__index">{indexLabel}</span>
        <img src={element.src} alt={element.alt} loading="lazy" />
        {element.caption && <figcaption>{element.caption}</figcaption>}
      </figure>
    )
  }

  if (element.type === 'video') {
    const videoSrc = `https://www.youtube.com/embed/${element.videoId}?rel=0`
    return (
      <article class="flow-block flow-block--video">
        <span class="flow-block__index">{indexLabel}</span>
        <div class="flow-block__media">
          <iframe
            src={videoSrc}
            title={element.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div class="flow-block__body">
          <h3>{element.title}</h3>
          {element.description && <p>{element.description}</p>}
        </div>
      </article>
    )
  }

  if (element.type === 'link') {
    return (
      <article class="flow-block flow-block--link">
        <span class="flow-block__index">{indexLabel}</span>
        <div class="flow-block__body">
          <h3>{element.title}</h3>
          {element.description && <p>{element.description}</p>}
          <a class="flow-block__cta" href={element.url} target="_blank" rel="noopener">
            Apri risorsa ↗︎
          </a>
        </div>
      </article>
    )
  }

  if (element.type === 'html') {
    return (
      <article class="flow-block flow-block--html">
        <span class="flow-block__index">{indexLabel}</span>
        {element.title && <h3>{element.title}</h3>}
        <div class="flow-block__custom" dangerouslySetInnerHTML={{ __html: element.html }} />
      </article>
    )
  }

  if (element.type === 'code') {
    return (
      <article class="flow-block flow-block--code">
        <span class="flow-block__index">{indexLabel}</span>
        {element.title && <h3>{element.title}</h3>}
        {element.description && <p class="flow-block__description">{element.description}</p>}
        <pre class="flow-block__code">
          <code class={`language-${element.language}`}>{element.code}</code>
        </pre>
      </article>
    )
  }

  return null
}

const SiteHeader = () => (
  <header class="topbar">
    <a class="topbar__brand" href="/">
      {SITE_TITLE}
    </a>
    <nav class="topbar__nav" aria-label="Navigazione principale">
      <a class="topbar__link" href="/#catalogo">
        Corsi
      </a>
      <a class="topbar__link" href="/#sessioni">
        Sessioni
      </a>
      <a class="topbar__link" href="/corsi/alfabetizzazione-ai">
        Percorso etico
      </a>
    </nav>
  </header>
)

const SiteFooter = () => (
  <footer class="footer">
    <p>
      {SITE_TITLE} · {SITE_SUBTITLE}
    </p>
    <p class="text-muted">
      Coltiviamo alfabetizzazione digitale come atto culturale e democratico. Ogni innovazione nasce da responsabilità condivisa.
    </p>
  </footer>
)

export default app
