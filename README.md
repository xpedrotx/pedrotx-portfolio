# PEDROTX — portfolio

Portfolio of **Pedro Teixeira** (`pedrotx`) — full-stack developer.
Bilingual (pt-BR / en-US), light/dark.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl — `/` (pt-BR) · `/en` (en-US) |
| Motion | Motion, GSAP, Lenis, Paper Design shaders |
| Email | Nodemailer (Gmail SMTP) + React Email |
| Analytics | Vercel Analytics + Speed Insights; GA4 / Google Ads behind consent |
| Anti-bot | honeypot + optional Cloudflare Turnstile |

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you need (all optional for a dry run)
npm run dev
```

`npm run build` for a production build.

## Configuration

Content lives in `constant/` (profile, skills, projects, journey, socials, SEO)
and `messages/{pt-br,en}.json` (all UI copy). No backend edits needed.

Environment variables are documented in [`.env.example`](./.env.example). Nothing
is required — each integration (email, analytics, WhatsApp, Turnstile) stays
disabled until its keys are present.

## Deploy

See [`DEPLOY.md`](./DEPLOY.md).

## License

See [`LICENSE`](./LICENSE). All personal content, copy, imagery and branding are
Pedro Teixeira's own.
