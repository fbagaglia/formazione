import { jsxRenderer } from 'hono/jsx-renderer'

const SITE_TITLE = "Accademia dell'Umanesimo Digitale"
const SITE_DESCRIPTION =
  'Percorsi di longlife learning per competenze digitali e intelligenza artificiale, con uno sguardo umanista sulla trasformazione tecnologica.'

export const renderer = jsxRenderer(({ children, title }) => {
  const pageTitle = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE

  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={SITE_DESCRIPTION} />
        <title>{pageTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="/static/style.css" rel="stylesheet" />
      </head>
      <body class="app-body">
        <div class="app-shell">{children}</div>
      </body>
    </html>
  )
})
