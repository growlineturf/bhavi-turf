# 🚀 ABARNA SIVAKUMAR — PORTFOLIO MONOREPO MISSION
## Antigravity Agent Mission Prompt — Monorepo Edition

> **Agent:** Multi-Phase Agentic Build Mission
> **Architecture:** pnpm Workspaces + Turborepo + Next.js 15
> **Owner:** Abarna Sivakumar | abarnasivakumar15@gmail.com
> **Version:** 2.0.0 — Production Monorepo

---

## 🧠 HOW TO USE THIS FILE

1. Place at `.agents/rules/PORTFOLIO_MISSION.md` in repo root
2. Before ANY task → read `.agents/FILE_REGISTRY.md` first
3. One phase per conversation turn — stop after completing it
4. Request Review before running migrations or deploys
5. Update `docs/PROGRESS.md` + `tasks/todo.md` after each phase

**Antigravity Settings:**
```
Terminal Execution Policy: Request Review
Review Policy: Agent Decides
JavaScript Execution Policy: Always Proceed
```

---

## 📁 MONOREPO STRUCTURE (CANONICAL — DO NOT DEVIATE)

```
abarna-portfolio/                    ← monorepo root
├── .agents/
│   ├── rules/
│   │   ├── PORTFOLIO_MISSION.md    ← THIS FILE
│   │   └── design-system.md
│   ├── FILE_REGISTRY.md            ← READ BEFORE CREATING ANY FILE
│   └── skills/
│       ├── prisma-migration/
│       └── portfolio-api/
│
├── apps/
│   └── web/                        ← Next.js 15 portfolio app
│       └── src/
│           ├── app/                ← ROUTING ONLY — no business logic
│           │   ├── (portfolio)/
│           │   │   └── page.tsx    ← imports PortfolioScreen only
│           │   ├── (admin)/
│           │   │   ├── layout.tsx
│           │   │   └── [section]/page.tsx
│           │   ├── api/v1/
│           │   │   ├── portfolio/route.ts
│           │   │   ├── contact/route.ts
│           │   │   ├── chatbot/route.ts
│           │   │   └── admin/[resource]/route.ts
│           │   ├── layout.tsx
│           │   └── not-found.tsx
│           │
│           ├── features/           ← ALL FEATURE CODE
│           │   ├── portfolio/
│           │   │   ├── screens/PortfolioScreen.tsx
│           │   │   ├── components/ (Hero, Marquee, About, Skills, Projects…)
│           │   │   ├── hooks/use-portfolio.ts
│           │   │   └── portfolio.types.ts
│           │   ├── chatbot/
│           │   │   ├── screens/ChatbotWidget.tsx
│           │   │   ├── components/
│           │   │   └── chatbot.types.ts
│           │   ├── contact/
│           │   │   ├── components/ContactForm.tsx
│           │   │   └── contact.types.ts
│           │   └── admin/
│           │       ├── screens/
│           │       ├── components/
│           │       └── admin.types.ts
│           │
│           └── server/             ← BACKEND — no UI imports ever
│               ├── handlers/
│               │   ├── portfolio.handlers.ts
│               │   ├── contact.handlers.ts
│               │   ├── chatbot.handlers.ts
│               │   └── admin.handlers.ts
│               ├── services/
│               │   ├── portfolio.service.ts
│               │   ├── contact.service.ts
│               │   ├── chatbot.service.ts
│               │   └── admin.service.ts
│               ├── middleware/
│               │   ├── auth.middleware.ts
│               │   └── rate-limit.middleware.ts
│               └── validators/
│                   ├── contact.validators.ts
│                   └── admin.validators.ts
│
├── packages/
│   ├── database/
│   │   ├── client.ts               ← Prisma singleton
│   │   ├── schema.prisma           ← CANONICAL schema — single source of truth
│   │   ├── seed.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── contact.schema.ts
│   │   ├── chatbot.schema.ts
│   │   └── index.ts
│   ├── cache/
│   │   ├── client.ts
│   │   ├── cache-keys.ts
│   │   ├── cache-strategy.ts
│   │   ├── cache-helpers.ts
│   │   └── index.ts
│   └── ui/
│       ├── components/
│       └── design-tokens.ts
│
├── supabase/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   └── PROGRESS.md
├── tasks/
│   └── todo.md
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 📋 GLOBAL RULES (agents read this on every session)

```
TECH STACK (strict — no deviations):
- Framework:    Next.js 15 App Router + TypeScript strict mode
- Monorepo:     pnpm workspaces + Turborepo
- Styling:      Tailwind CSS v4 + shadcn/ui
- ORM:          Prisma 6 (PostgreSQL via Supabase)
- Animations:   Framer Motion 11 + Lenis smooth scroll
- AI:           Anthropic Claude (claude-sonnet-4-20250514)
- Cache:        Upstash Redis (packages/cache)
- Deploy:       Vercel (edge functions)
- Images:       Vercel Blob or Cloudinary

ARCHITECTURE RULES (hard — never violate):
- app/ = routing only. page.tsx imports one Screen. Zero business logic.
- route.ts = thin router. Max 15 lines. Delegates to handler immediately.
- features/ = all UI (screens, components, hooks, types).
- server/ = all backend (handlers, services, middleware, validators).
- server/ never imports from features/ or app/.
- packages/ = shared code across apps. apps/* → packages/* direction only.
- DB queries only inside server/services/*.service.ts.
- Zod validation on every POST/PATCH API route — no exceptions.

CODE STYLE:
- Named exports everywhere — no default exports in components.
- interface for props, type for unions.
- No console.log in production — use structured logger.
- No any — TypeScript strict mode enforced.

DESIGN TOKENS (non-negotiable):
- Background:       #0A0A0A
- Card:             #111111
- Border:           #1F1F1F
- Text Primary:     #EAEAEA
- Text Secondary:   #9CA3AF
- Accent Gold:      #C2A878 (use sparingly)
- Font Display:     'Clash Display' or 'DM Serif Display'
- Font Body:        'Geist' or 'Inter'
- No gradients. No neon. No glow effects.
- Framer Motion: fade+slide 0.4–0.6s only.

DB RULES:
- NEVER drop tables — additive migrations only.
- Every table must have id, createdAt, updatedAt.
- Always use Prisma transactions for multi-table writes.
- All cache reads before DB. All writes: DB first, then invalidate cache.

SECURITY:
- Admin routes protected by httpOnly cookie middleware.
- Zod on every API route input.
- Rate limit: contact = 3/hr/IP, chatbot = 20/hr/session.
- No secrets in client components — server-only env vars.
```

---

## 🗄️ DATABASE SCHEMA (packages/database/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Portfolio {
  id             String   @id @default(cuid())
  slug           String   @unique @default("abarna")
  firstName      String
  lastName       String
  fullName       String
  initials       String
  title          String
  tagline        String
  summary        String   @db.Text
  avatarUrl      String?
  resumeUrl      String?
  email          String
  phone          String?
  location       String
  linkedinUrl    String?
  githubUrl      String?
  twitterUrl     String?
  seoTitle       String?
  seoDescription String?
  ogImageUrl     String?
  isPublished    Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  skills         Skill[]
  projects       Project[]
  experiences    Experience[]
  educations     Education[]
  certifications Certification[]
  activities     Activity[]
  languages      Language[]
  techStack      TechStackItem[]
  chatMessages   ChatMessage[]
  @@map("portfolios")
}

model Skill {
  id            String        @id @default(cuid())
  portfolioId   String
  portfolio     Portfolio     @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  name          String
  category      SkillCategory
  proficiency   Int           @default(80)
  iconSlug      String?
  isHighlighted Boolean       @default(false)
  displayOrder  Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  @@map("skills")
}

enum SkillCategory { LANGUAGE FRAMEWORK DATABASE CLOUD TOOL OTHER }

model Project {
  id           String        @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio     @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  title        String
  slug         String        @unique
  problem      String
  solution     String
  description  String        @db.Text
  thumbnailUrl String?
  imageUrls    String[]
  liveUrl      String?
  githubUrl    String?
  techStack    String[]
  tags         String[]
  status       ProjectStatus @default(COMPLETED)
  isFeatured   Boolean       @default(false)
  displayOrder Int           @default(0)
  startDate    DateTime?
  endDate      DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  @@map("projects")
}

enum ProjectStatus { COMPLETED IN_PROGRESS ARCHIVED }

model Experience {
  id           String         @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio      @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  company      String
  role         String
  location     String?
  type         ExperienceType @default(INTERNSHIP)
  description  String         @db.Text
  highlights   String[]
  techStack    String[]
  logoUrl      String?
  companyUrl   String?
  startDate    DateTime
  endDate      DateTime?
  isCurrent    Boolean        @default(false)
  displayOrder Int            @default(0)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  @@map("experiences")
}

enum ExperienceType { FULLTIME PARTTIME INTERNSHIP FREELANCE CONTRACT }

model Education {
  id           String   @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  institution  String
  degree       String
  field        String
  grade        String?
  location     String?
  logoUrl      String?
  startDate    DateTime
  endDate      DateTime?
  isCurrent    Boolean  @default(false)
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  @@map("educations")
}

model Certification {
  id            String   @id @default(cuid())
  portfolioId   String
  portfolio     Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  name          String
  issuer        String
  issuerLogoUrl String?
  credentialUrl String?
  credentialId  String?
  issuedDate    DateTime?
  expiryDate    DateTime?
  displayOrder  Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@map("certifications")
}

model Activity {
  id           String       @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio    @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  title        String
  description  String?
  type         ActivityType @default(ACTIVITY)
  year         Int?
  displayOrder Int          @default(0)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  @@map("activities")
}

enum ActivityType { HACKATHON AWARD PUBLICATION VOLUNTEER ACTIVITY OTHER }

model Language {
  id           String              @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio           @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  name         String
  proficiency  LanguageProficiency
  displayOrder Int                 @default(0)
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt
  @@map("languages")
}

enum LanguageProficiency { NATIVE FLUENT PROFICIENT BASIC }

model TechStackItem {
  id           String   @id @default(cuid())
  portfolioId  String
  portfolio    Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  name         String
  iconSlug     String
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  @@map("tech_stack_items")
}

model ChatMessage {
  id          String      @id @default(cuid())
  portfolioId String
  portfolio   Portfolio   @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  sessionId   String
  role        MessageRole
  content     String      @db.Text
  ipHash      String?
  createdAt   DateTime    @default(now())
  @@index([portfolioId, sessionId])
  @@map("chat_messages")
}

enum MessageRole { USER ASSISTANT }

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  isRead    Boolean  @default(false)
  isReplied Boolean  @default(false)
  ipHash    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("contact_submissions")
}

model SiteSettings {
  id                 String   @id @default(cuid())
  maintenanceMode    Boolean  @default(false)
  chatbotEnabled     Boolean  @default(true)
  contactFormEnabled Boolean  @default(true)
  chatbotName        String   @default("Ask about Abarna")
  chatbotGreeting    String   @default("Hi! Ask me anything about Abarna's skills, projects, or experience.")
  openToWork         Boolean  @default(true)
  availabilityText   String   @default("Open to full-time opportunities from 2026")
  updatedAt          DateTime @updatedAt
  @@map("site_settings")
}

model ResumeUpload {
  id           String      @id @default(cuid())
  fileName     String
  fileUrl      String
  parsedJson   Json?
  status       ParseStatus @default(PENDING)
  errorMessage String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  @@map("resume_uploads")
}

enum ParseStatus { PENDING PROCESSING COMPLETED FAILED }
```

---

## ⚙️ TURBO + PNPM CONFIG

**pnpm-workspace.yaml**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**turbo.json**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env.local"],
  "pipeline": {
    "build":   { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev":     { "cache": false, "persistent": true },
    "lint":    { "outputs": [] },
    "type-check": { "outputs": [] },
    "db:migrate": { "cache": false },
    "db:seed":    { "cache": false }
  }
}
```

**Root package.json scripts:**
```json
{
  "scripts": {
    "dev":        "turbo run dev",
    "build":      "turbo run build",
    "lint":       "turbo run lint",
    "type-check": "turbo run type-check",
    "db:migrate": "turbo run db:migrate --filter=@portfolio/database",
    "db:seed":    "turbo run db:seed --filter=@portfolio/database",
    "db:studio":  "cd packages/database && npx prisma studio"
  }
}
```

---

## 🔌 API HANDLER WRAPPER (packages/api/api-handler.ts)

Every route handler MUST wrap with this — no raw try/catch per handler:

```typescript
// SECTION 1 — Imports
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

// SECTION 2 — Wrapper
export function apiHandler(
  fn: (req: NextRequest, ctx?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx?: any) => {
    try {
      return await fn(req, ctx)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

// SECTION 3 — Error mapping
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError)
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', details: error.flatten().fieldErrors } },
      { status: 400 }
    )
  const map: Record<string, [string, number]> = {
    NOT_FOUND:    ['Resource not found', 404],
    UNAUTHORIZED: ['Authentication required', 401],
    FORBIDDEN:    ['You do not have permission', 403],
    CONFLICT:     ['Resource already exists', 409],
  }
  if (error instanceof Error && map[error.message]) {
    const [message, status] = map[error.message]
    return NextResponse.json({ success: false, error: { code: error.message, message } }, { status })
  }
  console.error('[API Error]', error)
  return NextResponse.json(
    { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
    { status: 500 }
  )
}
```

**Route template (max 15 lines):**
```typescript
// app/api/v1/portfolio/route.ts
import { portfolioHandlers } from '@/server/handlers/portfolio.handlers'
export const GET = portfolioHandlers.getPortfolio
```

---

## 🔴 CACHE SYSTEM (packages/cache/)

```typescript
// cache-keys.ts
export const CacheKeys = {
  portfolio:   (slug: string) => `portfolio:${slug}`,
  skills:      (slug: string) => `portfolio:${slug}:skills`,
  projects:    (slug: string) => `portfolio:${slug}:projects`,
  settings:    ()             => `portfolio:settings`,
  groups: {
    allPortfolio: (slug: string) => [
      `portfolio:${slug}`,
      `portfolio:${slug}:skills`,
      `portfolio:${slug}:projects`,
    ]
  }
}

// cache-strategy.ts
export const TTL = {
  PORTFOLIO_FULL:  300,   // 5min — changes occasionally
  SKILLS_LIST:     600,   // 10min
  PROJECTS_LIST:   300,   // 5min
  SITE_SETTINGS:   86400, // 24hr
  CHAT_SESSION:    null,  // never cache — always live
  CONTACT_FORM:    null,  // never cache — financial-grade freshness
} as const
```

---

## 🌱 PHASE 0 — MONOREPO BOOTSTRAP

```
MISSION: Initialize the pnpm monorepo workspace from scratch.

TASKS (in order — request review before each terminal command):
1. From repo root, run:
   pnpm init
   pnpm add -D turbo typescript
   mkdir -p apps/web packages/database packages/validators packages/cache packages/ui

2. Scaffold Next.js 15 app:
   cd apps/web && npx -y create-next-app@latest ./ \
     --typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-git

3. Move src files to apps/web/src/ structure per monorepo spec above.

4. In packages/database:
   pnpm init && pnpm add prisma @prisma/client
   Copy schema.prisma from this file (canonical schema above).
   Run: npx prisma migrate dev --name init
   Run: npx prisma generate

5. Add workspace aliases in apps/web/package.json:
   "@portfolio/database": "workspace:*"
   "@portfolio/validators": "workspace:*"
   "@portfolio/cache": "workspace:*"
   "@portfolio/ui": "workspace:*"

6. Create turbo.json and pnpm-workspace.yaml from specs above.

7. Run from root: pnpm install && pnpm dev

STOP CONDITION: localhost:3000 loads Next.js default page.
Report: list all created files, show package.json workspace links.
```

---

## 🎨 PHASE 1 — DESIGN SYSTEM + LAYOUT

```
MISSION: Set up Tailwind v4 tokens, global CSS, base layout, Navbar, Footer.
Read FILE_REGISTRY.md first. Edit existing files only — no new files.

TASKS:
1. Configure Tailwind v4 in apps/web/src/app/globals.css:
   :root {
     --bg: #0A0A0A; --card: #111111; --border: #1F1F1F;
     --text-primary: #EAEAEA; --text-secondary: #9CA3AF;
     --gold: #C2A878;
     --font-display: 'Clash Display', serif;
     --font-body: 'Geist', sans-serif;
   }

2. apps/web/src/app/layout.tsx:
   - Import Geist font from next/font/google
   - Wrap with <LenisProvider> + <ThemeProvider defaultTheme="dark">
   - Add <Navbar /> and <Footer /> around {children}

3. features/portfolio/components/Navbar.tsx:
   - Sticky top, backdrop-blur, bg-[var(--bg)]/80
   - Left: "AS." in gold, font-display, text-xl
   - Right: About | Projects | Skills | Contact (smooth scroll)
   - Mobile: hamburger + slide-down drawer (Framer Motion)

4. features/portfolio/components/Footer.tsx:
   - "Open to opportunities" in gold
   - GitHub, LinkedIn, Email icons (lucide-react)
   - Copyright line, centered, minimal

5. Add to FILE_REGISTRY.md immediately after creating each file.

BROWSER VALIDATION: Screenshot navbar + footer at 1440px and 375px.
STOP after footer is confirmed working. Do not proceed to Phase 2.
```

---

## 🦸 PHASE 2 — HERO + MARQUEE

```
MISSION: Build Hero section + Tech Stack Marquee. Must be stunning.
Read: portfolio.service.ts pattern → mirror exactly.

HERO SPEC (features/portfolio/components/Hero.tsx):
- Full viewport: 100svh, center-aligned
- Name: "Abarna Sivakumar" — clamp(3rem,8vw,7rem), font-display
- "Abarna" in var(--gold)
- Subtitle: "AI & Full-Stack Developer" — text-secondary
- Tagline: "I build intelligent, scalable digital products."
- CTA row: "View Projects" (gold border) + "Download Resume" (ghost)
- Framer Motion staggered fade-up, 0.1s delay per element
- Background: faint CSS noise texture (performance-safe)

MARQUEE SPEC (features/portfolio/components/TechMarquee.tsx):
- Fetch from: GET /api/v1/portfolio/tech-stack
- Icons: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{slug}/{slug}-original.svg
- Double array for seamless infinite loop
- CSS animation: translateX marquee 30s linear infinite
- Pause on hover; fade edges with mask-image gradient

API to build:
- apps/web/src/app/api/v1/portfolio/tech-stack/route.ts → portfolioHandlers.getTechStack
- server/handlers/portfolio.handlers.ts → calls portfolioService.getTechStack()
- server/services/portfolio.service.ts:
    async getTechStack() {
      const key = CacheKeys.skills('abarna')
      const cached = await cache.get(key)
      if (cached) return cached
      const data = await db.techStackItem.findMany({ orderBy: { displayOrder: 'asc' } })
      await cache.set(key, data, TTL.SKILLS_LIST)
      return data
    }

BROWSER VALIDATION: Screenshot hero + marquee. Confirm marquee animates.
STOP after browser confirms animation works.
```

---

## 🧩 PHASE 3 — ABOUT + SKILLS

```
MISSION: Build About and Skills sections — DB-driven, animated.

ABOUT (features/portfolio/components/About.tsx):
- Fetch: portfolio.summary, location, title
- Left: bio paragraph (from DB, max 4 lines)
- Right: Stats grid — "8.5" CGPA | "2" Projects | "2" Internships | "4" Certs
- Stats: large gold number + small label
- Animated counter on scroll: 0 → value over 1s (Framer Motion useInView)
- Section title "About Me" with thin gold underline

SKILLS (features/portfolio/components/Skills.tsx):
- Fetch: GET /api/v1/portfolio/skills?category=
- Tab filter: All | Languages | Frameworks | Databases | Cloud | Tools
- Grid: 3 cols desktop → 2 cols tablet → 2 cols mobile
- Each skill card: devicons icon (40px) + name + proficiency bar (gold) + badge
- Hover: translateY(-4px) + gold border

API:
- /api/v1/portfolio/skills/route.ts → portfolioHandlers.getSkills
- service: cache-first, invalidate on admin update

BROWSER VALIDATION: Screenshot skills grid. Click filter tab, screenshot updated grid.
STOP after filter confirmed working.
```

---

## 🏗️ PHASE 4 — PROJECTS SECTION

```
MISSION: Build Projects section — premium product-showcase feel.

SECTION (features/portfolio/components/Projects.tsx):
- Section title: "Selected Work"
- Filter: All | AI | Full-Stack | Web (by Project.tags[])
- Layout: 2-col grid desktop, 1-col mobile

PROJECT CARD (features/portfolio/components/ProjectCard.tsx):
- Thumbnail (gradient placeholder if null)
- Title: font-display, text-xl
- "Problem —" prefix in gold + text
- "Solution —" prefix in gold + text
- Tech stack pills: #1F1F1F bg, gold text, text-xs
- Buttons: "Live Demo" + "GitHub" (ghost, icon+text)
- Hover: translateY(-6px) + thin gold border
- Click: open ProjectModal

PROJECT MODAL (features/portfolio/components/ProjectModal.tsx):
- Full-screen overlay #0A0A0A/95%
- Framer Motion scale-in
- Close button top-right (ESC also closes)
- Full markdown rendered (use react-markdown)
- Image gallery if imageUrls[] exists

API:
- GET /api/v1/portfolio/projects → Project[]
- GET /api/v1/portfolio/projects/[slug] → single Project
- service: cache-first, TTL.PROJECTS_LIST

BROWSER VALIDATION:
1. Screenshot cards grid with filter active
2. Click card → screenshot modal open
3. Press ESC → confirm modal closes
STOP after all three confirmed.
```

---

## 💼 PHASE 5 — EXPERIENCE + EDUCATION + CERTIFICATIONS

```
MISSION: Build timeline Experience, card Education, grid Certifications.

EXPERIENCE (features/portfolio/components/Experience.tsx):
- Fetch: GET /api/v1/portfolio/experience
- Vertical timeline: gold dot + vertical line connector
- Each entry:
    - Role (font-display, text-lg, text-primary)
    - Company (text-secondary)
    - Duration + badge: "INTERNSHIP" pill in gold
    - Bullet highlights list
    - Tech stack pills
- Animate: slide in from left on scroll (Framer Motion whileInView)

EDUCATION (features/portfolio/components/Education.tsx):
- Card layout (not timeline)
- Institution initials in gold circle if no logoUrl
- Degree + Field + Grade (grade in gold)
- Duration formatted: "Aug 2022 – May 2026 · Current"

CERTIFICATIONS (features/portfolio/components/Certifications.tsx):
- 2-col desktop, 1-col mobile grid
- Cert name bold + issuer in gold
- "View Certificate →" link if credentialUrl exists

API (all cache-first, invalidate on admin write):
- GET /api/v1/portfolio/experience
- GET /api/v1/portfolio/education
- GET /api/v1/portfolio/certifications

BROWSER VALIDATION: Scroll each section, screenshot. Confirm timeline renders.
STOP after all three sections confirmed.
```

---

## 📬 PHASE 6 — CONTACT FORM

```
MISSION: Build Contact section with Zod-validated form that saves to DB.

CONTACT SECTION (features/contact/components/ContactForm.tsx):
- Section title: "Let's Connect"
- Left col: email + LinkedIn + GitHub with lucide icons
- Right col: form with react-hook-form + zod

FORM FIELDS:
- name (required), email (required), subject (optional),
  message (required, min 20 chars)
- Submit: "Send Message" — gold bg, dark text

FORM BEHAVIOR:
- Validate onBlur with Zod
- Optimistic: disable button + spinner on submit
- Success: replace form with "✓ Message sent!" card
- Error: inline toast (shadcn/ui toast)
- Prevent double-submit via disabled state

VALIDATOR (packages/validators/contact.schema.ts):
  export const contactSchema = z.object({
    name:    z.string().min(2).max(100),
    email:   z.string().email(),
    subject: z.string().max(200).optional(),
    message: z.string().min(20).max(2000),
  })

API (apps/web/src/app/api/v1/contact/route.ts → contactHandlers.submit):
SERVICE (server/services/contact.service.ts):
  - Parse with contactSchema
  - Hash IP: crypto.createHash('sha256').update(ip).digest('hex')
  - Rate limit: 3 per IP per hour via packages/cache
  - Save ContactSubmission to DB
  - Return { success: true }

BROWSER VALIDATION:
1. Submit valid form → screenshot success state
2. Submit invalid email → screenshot field error
3. Submit twice fast → confirm double-submit prevented
STOP after all three confirmed.
```

---

## 🤖 PHASE 7 — AI CHATBOT

```
MISSION: Build floating AI chatbot widget. Flagship feature — must feel premium.

CHATBOT WIDGET (features/chatbot/screens/ChatbotWidget.tsx):
- Floating button: bottom-right fixed, gold circle 56px, chat icon
- Pulse animation ring (CSS keyframes, not framer — performance safe)
- Click: animate slide-up chat window (Framer Motion AnimatePresence)

CHAT WINDOW (features/chatbot/components/ChatWindow.tsx):
- Width: 380px desktop, 100vw mobile
- Header: chatbotName from SiteSettings + close button
- Messages: scrollable, 400px max-height
- User messages: right, gold bubble
- AI messages: left, #111111 card
- Typing indicator: 3 animated dots while streaming
- Input: text + gold send button
- Session ID: stored in sessionStorage (not localStorage)

API (POST /api/v1/chatbot → chatbotHandlers.chat):
SERVICE (server/services/chatbot.service.ts):
  1. Fetch Portfolio + all relations (cache TTL.PORTFOLIO_FULL)
  2. Validate body with chatbotSchema (packages/validators/chatbot.schema.ts)
  3. Rate limit: 20 msg/hr/session via cache
  4. Build portfolioContext JSON (compact, no nulls)
  5. Call Anthropic Claude stream:
       model: claude-sonnet-4-20250514
       system: CHATBOT_SYSTEM_PROMPT (see below)
       max_tokens: 300
  6. Save ChatMessage records (user + assistant)
  7. Return ReadableStream to client

CHATBOT SYSTEM PROMPT:
  You are an AI assistant for Abarna Sivakumar's portfolio.
  Answer ONLY using the provided portfolio data.
  Be professional, friendly, concise (max 3 sentences).
  For unknowns: "I don't have that info — contact abarnasivakumar15@gmail.com"
  Never fabricate information. Use "Abarna" not "she".
  PORTFOLIO DATA: {portfolioJson}

BROWSER VALIDATION:
1. Open chatbot → screenshot initial greeting
2. Ask "What are Abarna's skills?" → screenshot response
3. Ask "Tell me about ElevIQ" → screenshot response
STOP after all three confirmed.
```

---

## 🛠️ PHASE 8 — ADMIN PANEL

```
MISSION: Build admin panel with middleware protection + full CRUD.

MIDDLEWARE (apps/web/src/middleware.ts):
- Match: /admin/** and /api/v1/admin/**
- Check httpOnly cookie "admin_token"
- If missing → redirect to /admin/login
- Admin login: POST /api/v1/admin/auth → compare ADMIN_PASSWORD env var
- On match: set httpOnly cookie, redirect to /admin

ADMIN ROUTES (all protected):
  /admin                     → Dashboard: stats overview
  /admin/portfolio           → Edit Portfolio fields
  /admin/projects            → CRUD projects
  /admin/skills              → CRUD skills
  /admin/experience          → CRUD experience
  /admin/education           → CRUD education
  /admin/certifications      → CRUD certifications
  /admin/messages            → View ContactSubmission[] (mark read)
  /admin/settings            → Edit SiteSettings
  /admin/resume-import       → Upload + parse resume PDF

ADMIN LAYOUT (features/admin/screens/AdminLayout.tsx):
- Left sidebar navigation (same dark theme)
- shadcn/ui Table for list views
- shadcn/ui Dialog for create/edit forms
- Each mutation: invalidate related CacheKeys groups after DB write

API ROUTES — mirror this pattern:
  route.ts (max 15 lines) → adminHandlers.ts → adminService.ts
  Every handler: wrapped with apiHandler(), Zod input, auth check

BROWSER VALIDATION:
1. Navigate to /admin without cookie → confirm redirect to /admin/login
2. Login → screenshot dashboard
3. Edit a project title → verify update on public /
STOP after edit confirmed on public page.
```

---

## 📤 PHASE 9 — RESUME UPLOAD + AI PARSING

```
MISSION: Build resume PDF upload + Claude AI structured extraction.

UPLOAD UI (/admin/resume-import):
- Drag-and-drop zone + file picker
- Accept: .pdf, .txt only | Max: 5MB
- Progress bar during upload

PIPELINE (server/services/admin.service.ts → parseResume):
  1. Upload to Vercel Blob → get fileUrl
  2. Create ResumeUpload (status: PENDING)
  3. Extract text: pdf-parse for PDF, fs.readFile for TXT
  4. Send to Claude (non-streaming, max_tokens: 2000):
       "Extract structured JSON from this resume. Return ONLY valid JSON.
        Schema: { name, title, summary, email, phone, location,
          linkedinUrl, githubUrl,
          skills: [{ name, category }],
          projects: [{ title, problem, solution, techStack, githubUrl }],
          experience: [{ company, role, type, startDate, endDate, highlights }],
          education: [{ institution, degree, field, grade, startDate, endDate }],
          certifications: [{ name, issuer }] }"
  5. Parse JSON → validate with Zod
  6. Update ResumeUpload (parsedJson, status: COMPLETED)

PREVIEW UI (features/admin/components/ResumePreview.tsx):
- Show parsed JSON in review card
- "Import to Portfolio" → upsert parsed data into DB, invalidate all cache
- "Discard" → delete ResumeUpload record

API:
  POST /api/v1/admin/resume/upload → uploadId
  GET  /api/v1/admin/resume/[id]  → ResumeUpload with parsedJson
  POST /api/v1/admin/resume/[id]/import → apply to Portfolio

BROWSER VALIDATION:
1. Upload a PDF → screenshot parsed JSON preview
2. Click Import → verify /admin/portfolio shows updated data
STOP after import confirmed.
```

---

## 🚀 PHASE 10 — PERFORMANCE + SEO + DEPLOY

```
MISSION: Lighthouse 90+, SEO 100, deploy to Vercel.

PERFORMANCE:
1. next/image everywhere — no raw <img> tags
2. dynamic() imports for below-fold sections (chatbot, admin)
3. loading.tsx skeletons for every page segment
4. error.tsx boundaries for every segment
5. ISR on portfolio page: revalidate = 3600 (1hr)
6. Run: pnpm build → fix all TypeScript errors

SEO:
1. generateMetadata() on all public pages
2. Dynamic OG image via next/og:
   - Dark bg #0A0A0A, "AS." in gold, name + title
3. JSON-LD Person schema on homepage
4. sitemap.ts and robots.ts in app/

DEPLOY:
1. Push to GitHub
2. Connect Vercel → set environment variables:
   DATABASE_URL, DIRECT_URL, ANTHROPIC_API_KEY,
   ADMIN_PASSWORD, BLOB_READ_WRITE_TOKEN,
   NEXT_PUBLIC_APP_URL, UPSTASH_REDIS_REST_URL,
   UPSTASH_REDIS_REST_TOKEN
3. vercel deploy --prod

BROWSER VALIDATION (on deployed URL):
1. Lighthouse audit → target: Performance ≥90, SEO =100, A11y ≥90
2. Mobile 375px viewport — screenshot full page
3. Test chatbot end-to-end on prod URL
4. Test contact form end-to-end on prod URL
STOP after Lighthouse scores confirmed.
```

---

## 🌱 SEED DATA (packages/database/seed.ts)

```typescript
// SECTION 1 — Imports
import { PrismaClient, SkillCategory, ExperienceType,
         LanguageProficiency, ActivityType } from '@prisma/client'
const prisma = new PrismaClient()

// SECTION 2 — Main
async function main() {
  await prisma.portfolio.deleteMany()

  await prisma.portfolio.create({
    data: {
      slug: 'abarna', firstName: 'Abarna', lastName: 'Sivakumar',
      fullName: 'Abarna Sivakumar', initials: 'AS.',
      title: 'AI & Full-Stack Developer',
      tagline: 'I build intelligent, scalable digital products.',
      summary: 'B.Tech AI & Data Science student (2026) with hands-on experience in Java, Python, React.js, and AWS. Passionate about scalable, secure applications.',
      email: 'abarnasivakumar15@gmail.com', phone: '+91 7810009685',
      location: 'Salem, Tamil Nadu',
      linkedinUrl: 'https://linkedin.com/in/abarnasivakumar',
      githubUrl: 'https://github.com/abarnasivakumar',
      seoTitle: 'Abarna Sivakumar — AI & Full-Stack Developer',
      seoDescription: 'Portfolio of Abarna Sivakumar, AI & Data Science engineer building full-stack applications with React, Python, and AWS.',
      skills: { create: [
        { name:'Java',       category:SkillCategory.LANGUAGE,   proficiency:85, iconSlug:'java',               isHighlighted:true,  displayOrder:1 },
        { name:'Python',     category:SkillCategory.LANGUAGE,   proficiency:80, iconSlug:'python',             isHighlighted:true,  displayOrder:2 },
        { name:'JavaScript', category:SkillCategory.LANGUAGE,   proficiency:78, iconSlug:'javascript',                              displayOrder:3 },
        { name:'TypeScript', category:SkillCategory.LANGUAGE,   proficiency:72, iconSlug:'typescript',                              displayOrder:4 },
        { name:'React.js',   category:SkillCategory.FRAMEWORK,  proficiency:82, iconSlug:'react',              isHighlighted:true,  displayOrder:5 },
        { name:'HTML5',      category:SkillCategory.FRAMEWORK,  proficiency:90, iconSlug:'html5',                                   displayOrder:6 },
        { name:'CSS3',       category:SkillCategory.FRAMEWORK,  proficiency:85, iconSlug:'css3',                                    displayOrder:7 },
        { name:'Flutter',    category:SkillCategory.FRAMEWORK,  proficiency:70, iconSlug:'flutter',                                 displayOrder:8 },
        { name:'PostgreSQL', category:SkillCategory.DATABASE,   proficiency:75, iconSlug:'postgresql',         isHighlighted:true,  displayOrder:9 },
        { name:'MySQL',      category:SkillCategory.DATABASE,   proficiency:78, iconSlug:'mysql',                                   displayOrder:10 },
        { name:'Firebase',   category:SkillCategory.DATABASE,   proficiency:80, iconSlug:'firebase',                                displayOrder:11 },
        { name:'AWS',        category:SkillCategory.CLOUD,      proficiency:70, iconSlug:'amazonwebservices',  isHighlighted:true,  displayOrder:12 },
        { name:'GitHub',     category:SkillCategory.TOOL,       proficiency:85, iconSlug:'github',                                  displayOrder:13 },
        { name:'VS Code',    category:SkillCategory.TOOL,       proficiency:92, iconSlug:'vscode',                                  displayOrder:14 },
      ]},
      projects: { create: [
        {
          title:'ElevIQ — GenAI Personal Financial Assistant', slug:'eleviq',
          problem:'Managing personal finances is complex with no intelligent, personalized tools.',
          solution:'AI-powered finance assistant with OCR receipt analysis and Gemini-driven guidance.',
          description:'Full-stack GenAI app with OCR receipt analysis, real-time analytics, and Google Gemini insights.',
          techStack:['TypeScript','Firebase','Google Gemini','React.js','OCR API'],
          tags:['AI','Finance','Full-Stack','GenAI'],
          isFeatured:true, displayOrder:1,
          githubUrl:'https://github.com/abarnasivakumar/eleviq',
        },
        {
          title:'LetBuyy — E-Commerce Platform', slug:'letbuyy',
          problem:'Building a secure e-commerce experience with real payment integration is complex.',
          solution:'React e-commerce app with cart, wishlist, Razorpay integration, and Firebase auth.',
          description:'Full-featured e-commerce app with product catalog, cart, wishlist, and payment processing.',
          techStack:['React.js','Firebase','Razorpay','JavaScript','CSS3'],
          tags:['E-Commerce','React','Payments'],
          isFeatured:true, displayOrder:2,
          githubUrl:'https://github.com/abarnasivakumar/letbuyy',
        },
      ]},
      experiences: { create: [
        {
          company:'iStudio', role:'AWS Cloud Intern',
          type:ExperienceType.INTERNSHIP,
          description:'Hands-on AWS internship covering cloud infrastructure fundamentals.',
          highlights:['Worked with EC2, S3, IAM, VPC, Lambda','Completed AWS Cloud Training Program'],
          techStack:['AWS','EC2','S3','IAM','Lambda'],
          startDate:new Date('2025-11-01'), endDate:new Date('2025-12-31'), displayOrder:1,
        },
        {
          company:'Emglitz Technologies', role:'Java Developer Intern', location:'Coimbatore',
          type:ExperienceType.INTERNSHIP,
          description:'Developed Java backend modules in an Agile environment.',
          highlights:['Developed OOP-based Java modules','Collaborated in Agile sprints','Wrote unit tests'],
          techStack:['Java','OOP','Agile','Git'],
          startDate:new Date('2024-02-01'), endDate:new Date('2024-03-31'), displayOrder:2,
        },
      ]},
      educations: { create: [{
        institution:'Dhanalakshmi Srinivasan College of Engineering',
        degree:'B.Tech', field:'Artificial Intelligence and Data Science',
        grade:'CGPA: 8.5', location:'Coimbatore, Tamil Nadu',
        startDate:new Date('2022-08-01'), endDate:new Date('2026-05-31'),
        isCurrent:true, displayOrder:1,
      }]},
      certifications: { create: [
        { name:'AWS Cloud Training Program',      issuer:'iStudio / Amazon Web Services', displayOrder:1 },
        { name:'Cloud Computing',                 issuer:'NPTEL',                          displayOrder:2 },
        { name:'Introduction to Generative AI',   issuer:'IBM SkillsBuild',                displayOrder:3 },
        { name:'Cyber Security Fundamentals',     issuer:'IBM SkillsBuild',                displayOrder:4 },
      ]},
      activities: { create: [
        { title:'College Coding Club Member', description:'Organized hackathons and mentored juniors.', type:ActivityType.ACTIVITY,  displayOrder:1 },
        { title:'Hackathon Winner',           description:'Won top prizes and earned internship offers.', type:ActivityType.HACKATHON, displayOrder:2 },
        { title:'Open Source Contributor',    description:'Published backend/cloud projects on GitHub.', type:ActivityType.ACTIVITY,  displayOrder:3 },
      ]},
      languages: { create: [
        { name:'Tamil',   proficiency:LanguageProficiency.NATIVE,     displayOrder:1 },
        { name:'English', proficiency:LanguageProficiency.PROFICIENT,  displayOrder:2 },
        { name:'Hindi',   proficiency:LanguageProficiency.BASIC,       displayOrder:3 },
      ]},
      techStack: { create: [
        { name:'React',        iconSlug:'react',              displayOrder:1 },
        { name:'Python',       iconSlug:'python',             displayOrder:2 },
        { name:'TypeScript',   iconSlug:'typescript',         displayOrder:3 },
        { name:'Java',         iconSlug:'java',               displayOrder:4 },
        { name:'AWS',          iconSlug:'amazonwebservices',  displayOrder:5 },
        { name:'Firebase',     iconSlug:'firebase',           displayOrder:6 },
        { name:'PostgreSQL',   iconSlug:'postgresql',         displayOrder:7 },
        { name:'Flutter',      iconSlug:'flutter',            displayOrder:8 },
        { name:'GitHub',       iconSlug:'github',             displayOrder:9 },
        { name:'Next.js',      iconSlug:'nextdotjs',          displayOrder:10 },
        { name:'Google Gemini',iconSlug:'google',             displayOrder:11 },
      ]},
    }
  })

  await prisma.siteSettings.create({ data: {
    chatbotEnabled: true, contactFormEnabled: true, openToWork: true,
    availabilityText: 'Open to full-time opportunities from 2026',
    chatbotName: 'Ask about Abarna',
    chatbotGreeting: "Hi! Ask me anything about Abarna's skills, projects, or experience.",
  }})

  console.log('✅ Seeded successfully')
}

// SECTION 3 — Run
main().catch(console.error).finally(() => prisma.$disconnect())
```

---

## ⚙️ ENVIRONMENT VARIABLES (.env.local)

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Admin
ADMIN_PASSWORD="your-secure-password-here"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# App
NEXT_PUBLIC_APP_URL="https://abarna.dev"
```

---

## 📂 FILE_REGISTRY.md TEMPLATE (.agents/FILE_REGISTRY.md)

```markdown
# FILE REGISTRY
> Read this before creating any new file. If responsibility exists → edit canonical file.

## packages/database
- schema.prisma        — CANONICAL DB schema. Only file allowed to define models.
- client.ts            — Prisma singleton export.
- seed.ts              — All seed data for Abarna's portfolio.

## packages/validators
- contact.schema.ts    — Zod schema for contact form (shared client + server).
- chatbot.schema.ts    — Zod schema for chatbot API body.

## packages/cache
- cache-keys.ts        — All CacheKeys factories. Add new keys here only.
- cache-strategy.ts    — All TTL constants. No TTL values anywhere else.
- cache-helpers.ts     — withCache, cacheInvalidate helpers.

## apps/web/src/server/services
- portfolio.service.ts — All public portfolio reads (cache-first).
- contact.service.ts   — Contact form save + rate limit.
- chatbot.service.ts   — Claude API call + message save.
- admin.service.ts     — All admin CRUD + resume parse.

## apps/web/src/server/handlers
- portfolio.handlers.ts — Thin handler → portfolioService delegates.
- contact.handlers.ts   — Thin handler → contactService delegates.
- chatbot.handlers.ts   — Thin handler → chatbotService delegates.
- admin.handlers.ts     — Thin handler → adminService delegates.

## apps/web/src/features/portfolio/components
- Hero.tsx             — Full-viewport hero section.
- TechMarquee.tsx      — Infinite scroll tech stack marquee.
- About.tsx            — About section with animated stats.
- Skills.tsx           — Skill grid with filter tabs.
- Projects.tsx         — Project grid with filter.
- ProjectCard.tsx      — Individual project card.
- ProjectModal.tsx     — Full-screen project detail overlay.
- Experience.tsx       — Timeline experience section.
- Education.tsx        — Education cards.
- Certifications.tsx   — Certification grid.
- Navbar.tsx           — Sticky navigation bar.
- Footer.tsx           — Site footer.

## apps/web/src/features/chatbot
- ChatbotWidget.tsx    — Floating chatbot button + window.
- ChatWindow.tsx       — Chat messages + input.

## apps/web/src/features/contact
- ContactForm.tsx      — Contact form with react-hook-form + Zod.

## apps/web/src/features/admin/screens
- AdminLayout.tsx      — Sidebar + content layout for all admin pages.
- DashboardScreen.tsx  — Stats overview.
- ResumeImportScreen.tsx — Upload + parse + import flow.
```

---

## 📊 PARALLEL AGENT STRATEGY (Manager View)

Dispatch these in parallel for maximum speed:

```
┌─────────────────────────────────────────────────┐
│           MANAGER VIEW — 4 AGENTS               │
├──────────────┬──────────────┬───────────────────┤
│   AGENT 1    │   AGENT 2    │     AGENT 3        │
│  DB + Cache  │  UI Layout   │  API Routes        │
│  Schema seed │  Navbar/Foot │  Handlers+Services │
│  Prisma      │  Design sys  │  Zod validators    │
├──────────────┴──────────────┤                    │
│          AGENT 4            │     AGENT 5        │
│  Hero+Marquee+About+Skills  │  Admin Panel       │
│  Projects+Experience+Certs  │  Auth middleware   │
│  Contact+Chatbot features   │  CRUD + Resume     │
└─────────────────────────────┴───────────────────┘
```

**Sync Point** — after all agents complete, dispatch integration agent:
```
Read FILE_REGISTRY.md. Verify all imports are correct, no duplicate routes,
no type mismatches. Run: pnpm build. Fix all TypeScript errors.
Run: pnpm type-check. Report exit code.
```

---

## ✅ DEFINITION OF DONE

A phase is **complete** only when ALL of these pass:

- [ ] All UI sections render without browser console errors
- [ ] All DB queries return correct data from PostgreSQL
- [ ] Browser agent screenshot confirms UI matches spec
- [ ] `pnpm build` exits with code 0
- [ ] `pnpm type-check` exits with code 0
- [ ] Mobile viewport 375px tested and functional
- [ ] Cache keys invalidated correctly after any write
- [ ] FILE_REGISTRY.md updated with all new files

---

## 🎯 FINAL QUALITY CHECKLIST

```
Public Portfolio (/)
├── [ ] Hero name animates in correctly (staggered fade-up)
├── [ ] "Download Resume" downloads actual PDF from Vercel Blob
├── [ ] Marquee loops infinitely without jank
├── [ ] About stats counter animates on scroll
├── [ ] Skill filter tabs work — grid updates instantly
├── [ ] Project cards hover effect (translateY + gold border)
├── [ ] Project modal opens/closes (ESC + button)
├── [ ] Experience timeline renders with gold dots
├── [ ] Contact form: success state + DB record confirmed
├── [ ] Chatbot: opens → greets → responds → saves to DB
├── [ ] All external links (GitHub, LinkedIn) open correctly
└── [ ] Perfect at 375px | 768px | 1440px

Admin Panel (/admin)
├── [ ] Redirect to /admin/login if no cookie
├── [ ] Login with ADMIN_PASSWORD sets httpOnly cookie
├── [ ] All sidebar sections load without errors
├── [ ] Edit portfolio tagline → save → verify on public /
├── [ ] Contact messages visible + markable as read
├── [ ] Resume import: upload PDF → parse → import → verify
└── [ ] SiteSettings: toggle chatbot → verify widget disappears

Performance (Lighthouse on deployed URL)
├── [ ] Performance ≥ 90
├── [ ] SEO = 100
├── [ ] Accessibility ≥ 90
├── [ ] No images > 200KB (next/image handles compression)
└── [ ] First Contentful Paint < 1.5s
```

---

*Stack: Next.js 15 · pnpm Workspaces · Turborepo · Prisma · Supabase · Tailwind v4 · shadcn/ui · Framer Motion · Anthropic Claude · Upstash Redis · Vercel*
*Portfolio Owner: Abarna Sivakumar | Salem, Tamil Nadu*
*Version: 2.0.0 — Production Monorepo — Antigravity Agent Mission*