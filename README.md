# Accademia dell'Umanesimo Digitale

Prototipo di modulo formativo che integra front-end statico, API serverless Hono e contenuti dinamici ottenuti da Google Classroom. L'obiettivo è offrire un'esperienza coerente con i valori dell'umanesimo digitale: trasparenza, cura dei dati e longlife learning.

## Palette cromatica
| Nome | Codice | Uso principale |
| --- | --- | --- |
| Nero profondo | `#0C0D0D` | Sfondo, testo primario |
| Verde linfa | `#379557` | Call to action, highlight |
| Bianco tenue | `#D9E1DA` | Tipografia chiara, card |
| Grigio scuro | `#5B5F5C` | Metadati, testi secondari |
| Grigio chiaro | `#818484` | Outline, elementi UI delicati |

## Architettura sintetica
- **Frontend**: pagine HTML statiche (`public/index.html`, `public/corso.html`) + JS (`main.js`, `course.js`) che consumano le API.
- **Backend**: Hono eseguito come funzione serverless su Vercel (`api/index.ts`). Gli handler sono definiti in `hono-api/src` e condivisi anche per lo sviluppo locale.
- **Fonte dati**: Google Classroom API (scope `classroom.courses.readonly` e `classroom.courseworkmaterials.readonly`). I token vengono rigenerati da un refresh token conservato nelle variabili d'ambiente.
- **Ambiente di test**: sandbox = macchina Linux isolata dove abbiamo eseguito gli step (install, `npm run dev`, `curl`, ecc.) prima del deploy.

## Preparazione Google Cloud Console
1. **Abilita l'API**: Google Cloud Console → progetto *Umanesimo Digitale* → API & Services → Library → "Google Classroom API" → Enable.
2. **OAuth consent screen**: setta "External" e aggiungi il tuo indirizzo tra i *Test users*.
3. **Crea un OAuth Client ID** (tipo *Web application*) e inserisci `https://developers.google.com/oauthplayground` tra i redirect autorizzati.
4. **Ottieni il refresh token** dal [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   - Spunta "Use your own OAuth credentials" con il client appena creato.
   - Autorizza gli scope:
     - `https://www.googleapis.com/auth/classroom.courses.readonly`
     - `https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly`
   - Scambia il codice → salva `refresh_token` insieme a client id/secret.

## Variabili d'ambiente (Vercel)
Imposta nella sezione *Project Settings → Environment Variables*:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Le stesse variabili possono essere esportate temporaneamente nel sandbox per i test manuali (`export GOOGLE_CLIENT_ID="..."`).

## Test locale (sandbox)
```bash
# 1. Installazione dipendenze
cd /home/user/webapp
npm install

# 2. Avvio API Hono (porta 8787)
export GOOGLE_CLIENT_ID="..."
export GOOGLE_CLIENT_SECRET="..."
export GOOGLE_REFRESH_TOKEN="..."
npm run dev:api

# 3. Nuova shell nel sandbox per il test degli endpoint
curl http://localhost:8787/api/classroom/courses
curl http://localhost:8787/api/classroom/courses/<COURSE_ID>
```
I file statici sono serviti da `public/` (es. `public/index.html`).

## Deploy su Vercel
1. **Collega il repository** a Vercel (`vercel link` o dashboard web) indicando come root la cartella del progetto (`/home/user/webapp`).
2. **Cartelle rilevanti**:
   - `public/` \- file statici serviti direttamente.
   - `api/index.ts` \- funzione serverless che importa l'app Hono.
3. **Build settings**: non è necessario un comando di build (statico). Lascialo vuoto oppure `npm install` (default). Il framework può rimanere "Other".
4. **Env vars**: incolla i valori `GOOGLE_*` sia su Preview sia su Production.
5. **Deploy**: esegui `vercel --prod` oppure usa il pulsante "Deploy". Vercel compilerà `api/index.ts`, posizionerà gli asset di `public/` e restituirà un URL, es. `https://accademia.vercel.app`.
6. **Dominio personalizzato** (opzionale): aggiungi `accademia.francobagaglia.it` come CNAME → Vercel.

## Endpoint esposti
- `GET /api/classroom/courses` → elenco corsi attivi (id, titolo, sezione, materia, link, updateTime).
- `GET /api/classroom/courses/:id` → dettaglio corso (descrizione, sessioni, risorse, CTA a Classroom).

## Struttura principale
```
webapp/
├── api/
│   └── index.ts                  # handler Vercel → Hono
├── hono-api/
│   └── src/
│       ├── classroom.ts          # logica Google Classroom
│       └── index.ts              # definizione app Hono (riusata in dev e prod)
├── public/
│   ├── index.html                # catalogo corsi
│   ├── corso.html                # scheda corso
│   ├── main.js / course.js       # chiamate fetch → API
│   ├── styles.css                # palette & layout
│   └── static/                   # (asset legacy, opzionale)
├── package.json                  # dipendenze condivise (Hono + Google APIs)
└── README.md
```

## Prossimi sviluppi suggeriti
1. **Cache e fallback**: integrare caching edge (Vercel KV) per evitare rate limit di Google.
2. **Analytics**: tracciare visualizzazioni dei corsi con strumenti rispettosi (es. Plausible).
3. **Filtro tematico**: aggiungere UI per filtrare i corsi per materia/aggiornamento.
4. **Sessioni estese**: combinare dati Classroom con contenuti editoriali (es. WordPress headless o Supabase).

Con questo documento puoi ripetere facilmente l’intero processo: prepari Google Cloud, esporti i token nella sandbox, testi gli endpoint con Hono e infine pubblichi su Vercel con frontend statico e API integrate. Buon viaggio umanista! 🚀
