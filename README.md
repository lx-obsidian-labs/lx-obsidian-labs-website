# LX Obsidian Labs Website

Modern, conversion-focused website built with Next.js App Router, Tailwind CSS, shadcn/ui components, Framer Motion, and Lucide icons.

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

## Core Features

- AI Business Assistant (floating chat)
- Smart Cost Estimator
- Multi-step Lead Capture Wizard
- Technology Lab page + Live Demos
- Dynamic Case Studies (`/portfolio/[slug]`)
- Insights page
- Floating WhatsApp CTA

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and set values as needed:

```bash
RESEND_API_KEY=
LEAD_TO_EMAIL=
LEAD_WEBHOOK_URL=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=stepfun/step-3.5-flash:free
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_GA_ID=
```

- `RESEND_API_KEY` + `LEAD_TO_EMAIL`: email notifications for new leads
- `LEAD_WEBHOOK_URL`: optional webhook sink for lead rows (recommended: Baserow webhook/n8n workflow)
- `OPENROUTER_API_KEY`: server-side key for AI assistant endpoint (`/api/assistant`)
- `OPENROUTER_MODEL`: optional model override for OpenRouter chat completions
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`: persistent API rate limiting for assistant/leads
- `NEXT_PUBLIC_GA_ID`: GA4 measurement id for analytics event tracking bootstrap

## Build For Production

```bash
npm run build
npm run start
```

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Keep default framework settings for Next.js.
4. Deploy.

Optional: set a custom production domain and update `metadataBase` in `app/layout.tsx`.

## Notes

- SEO metadata is configured per page with the Next.js Metadata API.
- `app/sitemap.ts` and `app/robots.ts` are included.
- Images are optimized with Next.js `Image` component and responsive `sizes` attributes.
- Content inventory is centralized in `content/site.ts` and structured data in `lib/data.ts`.
