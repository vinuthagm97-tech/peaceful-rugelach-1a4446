# VeritixGroup website

Static site (HTML, CSS, JS in `public/`) plus a small Node backend (`server.js`) for the contact form and chatbot.

## Run
    npm install
    cp .env.example .env     # fill in SMTP details (optional)
    npm start                # http://localhost:3000

## What the backend does
- `POST /api/contact`: validates, saves to `data/enquiries.jsonl`, emails MAIL_TO if SMTP is set. Rate limited, honeypot spam trap.
- `POST /api/chat`: only active if ANTHROPIC_API_KEY is set (Claude answers open questions). Without it, the chatbot still answers from its built-in FAQ and can capture leads.

## Deploy
- **Full site (recommended):** any Node host (Render, Railway, a VPS). Build command `npm install`, start command `npm start`, add the .env values as environment variables.
- **Static only:** upload `public/` to Netlify, Vercel or any web host. Pages and chatbot FAQ work; the form and chat show an email/WhatsApp fallback instead of sending.

## Edit
Page content lives in `build.py`; run `python3 build.py` to regenerate the HTML. Styles: `public/css/style.css`. Replace `public/img/hero-building.jpg` with a high-resolution photo. Add the Instagram link in `build.py` when available.
