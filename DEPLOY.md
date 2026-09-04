# Deploy — Vercel

## Phase 1 — up on `*.vercel.app` (no custom domain yet)

1. **Push to GitHub**

   ```bash
   git remote add origin git@github.com:xpedrotx/<repo>.git
   git branch -M main
   git push -u origin main
   ```

2. **Import on Vercel** — vercel.com/new → pick the repo. Framework is
   auto-detected (Next.js). No build settings to change.

3. **Environment variables** (Project → Settings → Environment Variables).
   For this phase set **only** what you actually want working. Leave the rest empty.

   | Variable | Phase 1 value |
   | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | *(leave empty — falls back to the Vercel URL)* |
   | `ALLOW_INDEXING` | *(leave empty — site stays `noindex`, robots blocks crawlers)* |
   | `email_from` / `email_password` | Gmail address + [app password](https://myaccount.google.com/apppasswords), if you want the contact form live |
   | `CONTACT_TO_EMAIL` | where leads land (defaults to `contato@pedrotx.com.br`) |
   | `NEXT_PUBLIC_WHATSAPP` | `5544…` digits only, if you want the WhatsApp button |

4. **Deploy.** You get `https://<project>.vercel.app`. It's fully functional but
   invisible to Google (by design).

Redeploy after changing env vars.

## Phase 2 — go live (`pedrotx.com.br`)

Only when the site is 100%:

1. Vercel → Project → **Domains** → add `pedrotx.com.br` and `www.pedrotx.com.br`.
   Point the DNS as Vercel instructs (A / CNAME).
2. Set env vars:
   - `NEXT_PUBLIC_SITE_URL=https://pedrotx.com.br`
   - `ALLOW_INDEXING=true`
3. Redeploy.
4. **Google Search Console** — add `pedrotx.com.br`, verify, submit
   `https://pedrotx.com.br/sitemap.xml`. Same on Bing Webmaster Tools.
5. If running ads: create GA4 + Google Ads, add
   `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADS_ID`, `NEXT_PUBLIC_ADS_CONVERSION_LABEL`,
   link Ads ↔ GA4.

## Optional — Cloudflare Turnstile (contact-form bot shield)

dash.cloudflare.com → Turnstile → add site → set
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. The widget appears
automatically; server-side verification is skipped while unset.

## Notes

- Preview deploys (every PR / non-`main` branch) are always `noindex`.
- The contact form's in-memory rate limit resets on cold starts — Turnstile is
  the real protection under load.
