/* Real portfolio content used as graceful fallbacks when the CMS/DB
   is not reachable, so the site always renders fully populated. */

import type {
  Certification,
  EducationItem,
  ExperienceItem,
  Profile,
  Project,
  Skill,
} from '../portfolio-types'

export const fallbackProfile: Required<
  Pick<
    Profile,
    'name' | 'title' | 'tagline' | 'summary' | 'email' | 'location' | 'linkedin' | 'github' | 'openToWork' | 'availabilityText'
  >
> & { resumeUrl: string; avatarUrl: string } = {
  name: 'Abarna Sivakumar',
  title: 'AI & Full-Stack Developer',
  tagline: 'Building intelligent products that are clean, scalable, and genuinely useful.',
  summary:
    'B.Tech Artificial Intelligence & Data Science student (2026) with hands-on experience across Java, Python, React, and AWS — building scalable, secure applications that solve real problems.',
  email: 'abarnasivakumar15@gmail.com',
  location: 'Salem, Tamil Nadu',
  linkedin: 'https://www.linkedin.com/in/abarna-sivakumar0115',
  github: 'https://github.com/Abarna-SA',
  openToWork: true,
  availabilityText: 'Open to Full-Time Roles',
  resumeUrl: '',
  avatarUrl: '',
}

export const fallbackProjects: Project[] = [
  {
    id: 'eleviq',
    title: 'ElevIQ — GenAI Personal Finance Assistant',
    role: 'Co-developer (2-person team) — worked across the Next.js/React web dashboard, the Flutter mobile app, and the Firebase serverless backend, including the Gemini AI receipt-scanning and chat pipeline, custom multi-provider auth, and the Firestore data layer.',
    problem:
      'Manual expense tracking is tedious and most finance apps require risky bank-account linking, so people abandon budgeting and lose visibility into where their money goes.',
    solution:
      'A cross-platform (web + Android/iOS) AI finance assistant on a shared Firebase backend: photograph a receipt and Google Gemini extracts vendor, amount, date and line-items into categorised expenses, chat with an AI over your spending and uploaded statements, and manage goals, budgets, bills, net worth and 15 financial calculators — with no bank integration.',
    outcome:
      'Shipped a large real-time ecosystem — a ~23-screen web dashboard, a 27-page Flutter app, and a Firebase backend (Auth, Firestore, Storage, 7 Cloud Functions) — with core expense data syncing live across web and mobile.',
    description:
      '## Overview\n\nElevIQ is a GenAI personal-finance assistant delivered as both a Next.js web dashboard and a Flutter mobile app (Android/iOS) on one shared Firebase backend. It removes manual data entry by using Google Gemini to read receipts and analyse financial documents — with no bank-account linking.\n\n## Key Features\n\n- **AI receipt scanning** — photo → Gemini Vision → categorised expense, using 7 category-specific extraction prompts with confidence scoring\n- **Streaming AI finance chat** over your data and uploaded statements/bills (images, PDF, CSV)\n- **Full money toolkit** — dashboard, spending analytics, goals, net worth, bills, reminders, spending limits and bill-splitting\n- **15 working financial calculators** — EMI, SIP, FIRE, old-vs-new tax regime and more, with verified formulas\n- **Guided onboarding** for 8 user types, plus PDF/CSV export\n- **Custom auth** — sequential human-readable IDs, email + Google account linking, and httpOnly session cookies\n\n## Architecture\n\nTwo native clients (React/TypeScript web, Dart/Flutter mobile) over a single Firebase project. Firestore stores expenses in a shared top-level collection keyed by userId for real-time sync across devices; Cloud Functions handle budget-alert triggers and scheduled summaries; Gemini is called server-side from Next.js API routes on web and on-device from the Flutter scanner.\n\n## Tech Stack\n\n**Web:** Next.js 16, React 19, TypeScript, Tailwind 4, Zustand, Zod, Recharts, jsPDF · **Mobile:** Flutter, Dart 3, Riverpod, go_router, fl_chart, Dio · **Backend:** Firebase Auth, Firestore, Storage, Cloud Functions (Node 20) · **AI:** Google Gemini (2.5-flash, 3-flash-preview, 1.5-flash)',
    thumbnailUrl: '/eleviq-cover.png',
    imageUrls: [],
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Flutter',
      'Dart',
      'Firebase',
      'Cloud Firestore',
      'Google Gemini',
      'Vercel',
    ],
    tags: ['AI', 'Finance', 'Full-Stack', 'Cross-Platform'],
    metricHighlights: [
      'Two native clients on one Firebase backend — a 23-screen Next.js web dashboard + a 27-page Flutter app with real-time expense sync',
      'Gemini-powered receipt OCR with 7 category-specific extraction prompts (no traditional OCR library)',
      'Streaming AI finance chat that ingests images, PDF & CSV and produces a structured 20-section statement analysis',
      '15 fully working financial calculators (EMI, SIP, FIRE, tax regime comparison) with verified formulas',
    ],
    status: 'COMPLETED',
    year: '2026',
    githubUrl: 'https://github.com/SiddhuSaai/ElevIQ',
    liveUrl: 'https://elev-iq.web.app',
    featured: true,
  },
  {
    id: 'letbuyy',
    title: 'LetBuyy — Reels-Commerce Marketplace',
    role: 'Co-developer (2-person team) — worked across a reels-first marketplace: Flutter buyer/seller/admin apps, Next.js web apps, and a 24-module TypeScript Firebase Functions backend (payments, tiered commissions, wallet/payouts, KYC, ads, subscriptions), plus the Firestore data model and role-based security rules.',
    problem: `Traditional marketplaces show static product grids that don't convert the way short-form video does, and small Indian sellers lack an easy way to run a branded store, get verified, take payments, and receive reliable bank payouts in one place.`,
    solution:
      'A reels-first, multi-sided marketplace: buyers shop from tagged short videos, and sellers onboard via automated KYC, list products with variants/inventory, upload reels, run pay-per-click/view ad campaigns, and get paid out to their bank accounts automatically — plus a built-in Shopify-style store builder to launch a branded storefront on a subdomain.',
    outcome:
      'Shipped and published on the Google Play Store (com.letbuyy.letbuyy, v1.0.10), iterated across 10+ releases, with a full money layer live: Razorpay checkout with HMAC signature verification, a tiered commission engine, idempotent wallet crediting, scheduled auto-payouts, and itemized settlement invoices.',
    description: `## Overview\nLetBuyy is a live, published-on-Google-Play reels-commerce marketplace: buyers shop from short vertical videos, sellers run stores and upload reels, and an admin team governs the platform. A built-in Shopify-style store builder lets sellers launch their own branded storefront on a subdomain. Built as a Flutter + Firebase monorepo with a TypeScript Cloud Functions backend.\n\n## What makes it hard\n- **Reels / video commerce** — a vertical PageView player with an LRU controller cache and eager preloading for instant playback, in-video product tagging, and cost-per-view ad billing on promoted reels.\n- **Payments & seller payouts** — Razorpay checkout with server-side order creation and HMAC-SHA256 signature verification; a category-tree + tiered commission engine; idempotent, delivery-triggered wallet crediting with a 3-state balance model; itemized settlement invoices and scheduled weekly/auto bank payouts.\n- **KYC** — automated PAN + Aadhaar OCR via Google Cloud Vision, fuzzy name matching, and a selfie face-match, backed by on-device ML Kit and admin review.\n- **Ad campaigns** — 7 ad types, per-keyword bidding, a separate ad-funding wallet, and impression / click / CPV tracking.\n\n## Roles\n- **Buyer** — reels feed → tagged product → product page → cart → checkout (Razorpay / COD) → tracking → reviews; plus an AI shopping assistant, visual search, and voice search.\n- **Seller** — KYC wizard → product & inventory management → reels upload → ad campaigns → order fulfilment (SLA, labels, RTO) → analytics → wallet & payouts.\n- **Admin** — seller/KYC approval, catalog moderation, commission/fee config, disputes & returns, payouts, and analytics — protected by TOTP 2FA.\n\n## Architecture\nFour Flutter clients and three Next.js web apps share one Firebase project. Firestore (60+ collections) holds the denormalized data model; Cloud Functions (Node 20 / TypeScript) own all money movement, KYC, ads, and subscriptions. Customer storefronts resolve by subdomain through a Cloudflare Worker to a Next.js app on Vercel.\n\n## Shipped\nLive on the Google Play Store — com.letbuyy.letbuyy.`,
    thumbnailUrl: '/letbuyy-cover.png',
    imageUrls: [],
    techStack: [
      'Flutter',
      'Dart',
      'Firebase',
      'TypeScript',
      'Next.js',
      'React',
      'Cloud Firestore',
      'Cloud Functions',
      'Razorpay',
      'Google Cloud Vision',
      'Redis',
      'Cloudflare Workers',
    ],
    tags: ['E-Commerce', 'Marketplace', 'Reels/Video', 'Payments'],
    metricHighlights: [
      'Published on the Google Play Store — com.letbuyy.letbuyy (v1.0.10), signed release builds with R8 + Crashlytics, across 10+ releases',
      'Multi-app platform on one Firebase backend: 4 Flutter apps + 3 Next.js web apps + a Cloudflare Worker, in a Melos monorepo',
      '~15,000-line, 24-module TypeScript Cloud Functions backend powering payments, tiered commissions, wallet/payouts, KYC, ads and subscriptions',
      'End-to-end money layer: Razorpay checkout with HMAC-SHA256 verification, a tiered commission engine, idempotent wallet crediting, scheduled bank payouts, and itemized settlement invoices',
      'Automated Indian seller KYC — PAN + Aadhaar OCR via Google Cloud Vision, fuzzy name matching, and a selfie face-match',
    ],
    status: 'COMPLETED',
    year: '2026',
    githubUrl: 'https://github.com/letbuyy/letbuyy',
    liveUrl: 'https://letbuyy.store',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.letbuyy.letbuyy',
    featured: true,
  },
  {
    id: 'quickplus',
    title: 'Quick+ PhishGuard — AI Phishing Detection & Safe Browser',
    role: 'Co-developer (2-person team) — worked across the Flutter Android safe-browser client, the FastAPI / PostgreSQL / Redis backend, the layered URL-detection pipeline, and the Docker / CI deployment.',
    problem: `Phishing and scam links (fake KYC, UPI, bank-verification, OTP-theft and reward messages) reach people through SMS, WhatsApp, email and the browser and cost victims money and credentials — a severe problem in India. Mainstream mobile browsers give no proactive, pre-navigation warning tuned to these local scam patterns.`,
    solution:
      'An Android app with a built-in safe browser that evaluates every URL before the page loads and picks a browsing mode proportional to the risk (Normal / Protected / Warn / Block). Detection is layered: an on-device Dart heuristic risk engine (instant, private) plus a cloud check that combines community-sourced patterns, lexical URL heuristics, and a fine-tuned BERT phishing model — merged by a policy controller with fail-safe defaults. It also scans clipboard text and notifications and runs a community report-and-verify network.',
    outcome:
      'Built a working guest-first safe-browser core with pre-navigation phishing interception and block/warn interstitials, on a hardened FastAPI backend (JWT RS256 with refresh-token rotation & reuse detection, rate limiting, Redis caching, Celery jobs, GitHub Actions CI/CD), covered by ~30 backend and 40+ mobile unit/integration tests.',
    description: `## Overview\nQuick+ PhishGuard is an Android app whose centerpiece is a built-in **safe browser**: it evaluates every URL *before the page loads* and selects a browsing mode (Normal / Protected / Warn / Block) proportional to the risk, tuned for India's scam landscape (KYC, UPI, OTP, banking fraud). It's backed by a clean-architecture FastAPI service and a community threat network.\n\n## How the safe browser protects you\n- **URL interception + real-time scan** — navigations are intercepted pre-commit in a flutter_inappwebview WebView via shouldOverrideUrlLoading; a full-screen interstitial blocks or warns with a plain-English "why".\n- **On-device (instant, private) → cloud (deep)** — a pure-Dart heuristic risk engine runs first with no network; unless the result is decisive, the app also calls the backend, and a policy controller merges the two scores with fail-safe defaults (block ≥ 0.85, warn ≥ 0.55).\n\n## Detection pipeline\n- **Signals** — lexical / host heuristics (IP-host, punycode, mixed-script, Levenshtein typosquat vs 18 brands, suspicious TLDs, shorteners, urgency language) plus a Hive allow/blocklist on-device; community-sourced patterns + heuristics on the backend.\n- **Model** — the cloud verdict uses a fine-tuned BERT phishing model via the Hugging Face Inference API, with a heuristic + community-pattern fallback.\n- **Community shield** — users report scams, peers vote, and confirmed reports are promoted into shared detection patterns.\n\n## Backend\nFastAPI (clean / DDD) · PostgreSQL via Prisma · Redis (cache + rate-limit + idempotency) · Celery jobs · JWT RS256 with refresh-token rotation & reuse detection · bcrypt · per-endpoint rate limiting · audit logging.\n\n## Architecture\nFlutter safe-browser client → on-device heuristic engine → FastAPI /scan → community patterns (Redis) + heuristics + hosted BERT → verdict → policy merge → interstitial. Deployed with Docker Compose and GitHub Actions CI/CD.`,
    thumbnailUrl: '/quickplus-cover.png',
    imageUrls: [],
    techStack: [
      'Flutter',
      'Dart',
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Riverpod',
      'Hugging Face',
      'Next.js',
    ],
    tags: ['Cybersecurity', 'AI', 'Safe Browser', 'Full-Stack'],
    metricHighlights: [
      'Pre-navigation URL interception in an in-app safe browser (flutter_inappwebview) with block/warn interstitials and a fail-safe default',
      'Two-tier detection: on-device Dart risk engine (13+ signals — IP-host, punycode, mixed-script, Levenshtein typosquat vs 18 brands) + cloud analysis merged by a policy controller',
      'Cloud phishing verdict via a fine-tuned BERT model (Hugging Face Inference API) with fallback to heuristics + community-sourced patterns',
      'Hardened FastAPI backend: JWT RS256 with refresh-token rotation & reuse detection, bcrypt, per-endpoint rate limiting, Redis caching, Celery jobs, Docker + GitHub Actions CI/CD',
      'Guest-first, privacy-preserving design covered by ~30 backend and 40+ Flutter unit/integration tests',
    ],
    status: 'COMPLETED',
    year: '2026',
    githubUrl: 'https://github.com/QuickPlus26/QuickPlus',
    liveUrl: 'https://quickplus.vercel.app',
    featured: true,
  },
]

export const fallbackSkills: Skill[] = [
  { name: 'Java', category: 'LANGUAGE', proficiency: 85, iconSlug: 'java' },
  { name: 'Python', category: 'LANGUAGE', proficiency: 80, iconSlug: 'python' },
  { name: 'JavaScript', category: 'LANGUAGE', proficiency: 78, iconSlug: 'javascript' },
  { name: 'TypeScript', category: 'LANGUAGE', proficiency: 72, iconSlug: 'typescript' },
  { name: 'React.js', category: 'FRAMEWORK', proficiency: 82, iconSlug: 'react' },
  { name: 'HTML5', category: 'FRAMEWORK', proficiency: 90, iconSlug: 'html5' },
  { name: 'CSS3', category: 'FRAMEWORK', proficiency: 85, iconSlug: 'css3' },
  { name: 'Flutter', category: 'FRAMEWORK', proficiency: 70, iconSlug: 'flutter' },
  { name: 'PostgreSQL', category: 'DATABASE', proficiency: 75, iconSlug: 'postgresql' },
  { name: 'MySQL', category: 'DATABASE', proficiency: 78, iconSlug: 'mysql' },
  { name: 'Firebase', category: 'DATABASE', proficiency: 80, iconSlug: 'firebase' },
  { name: 'AWS', category: 'CLOUD', proficiency: 70, iconSlug: 'amazonwebservices' },
  { name: 'GitHub', category: 'TOOL', proficiency: 85, iconSlug: 'github' },
  { name: 'VS Code', category: 'TOOL', proficiency: 92, iconSlug: 'vscode' },
]

export const fallbackExperience: ExperienceItem[] = [
  {
    id: 'istudio',
    company: 'iStudio',
    role: 'AWS Cloud Intern',
    type: 'INTERNSHIP',
    period: 'Nov 2025 – Dec 2025',
    highlights: [
      'Worked with EC2, S3, IAM, VPC and Lambda',
      'Gained practical exposure to cloud deployment fundamentals',
      'Completed the AWS Cloud Training Program certification',
    ],
    tech: ['AWS', 'EC2', 'S3', 'IAM', 'Lambda'],
  },
  {
    id: 'emglitz',
    company: 'Emglitz Technologies',
    role: 'Java Developer Intern',
    type: 'INTERNSHIP',
    location: 'Coimbatore',
    period: 'Feb 2024 – Mar 2024',
    highlights: [
      'Developed Java backend modules using OOP principles',
      'Collaborated in Agile sprints with daily standups',
      'Wrote unit tests and took part in code reviews',
    ],
    tech: ['Java', 'OOP', 'Agile', 'Git'],
  },
]

export const fallbackEducation: EducationItem[] = [
  {
    id: 'dsce',
    institution: 'Dhanalakshmi Srinivasan College of Engineering',
    degree: 'B.Tech — Artificial Intelligence & Data Science',
    field: 'Artificial Intelligence & Data Science',
    grade: 'CGPA 8.5',
    location: 'Tamil Nadu',
    period: 'Aug 2022 – May 2026',
  },
]

export const fallbackCertifications: Certification[] = [
  { id: 'aws-cert', name: 'AWS Cloud Training Program', issuer: 'iStudio / AWS', date: 'Dec 2025' },
  { id: 'cloud', name: 'Cloud Computing', issuer: 'NPTEL', date: '2024' },
  { id: 'genai', name: 'Introduction to Generative AI', issuer: 'IBM SkillsBuild', date: '2024' },
  { id: 'cyber', name: 'Cyber Security Fundamentals', issuer: 'IBM SkillsBuild', date: '2024' },
]

/** Map a tech name to a bundled logo slug in /public/logos (undefined if none). */
const TECH_LOGO: Record<string, string> = {
  react: 'react',
  'react.js': 'react',
  typescript: 'typescript',
  javascript: 'javascript',
  python: 'python',
  java: 'openjdk',
  'next.js': 'nextdotjs',
  nextjs: 'nextdotjs',
  'node.js': 'nodedotjs',
  nodejs: 'nodedotjs',
  'tailwind css': 'tailwindcss',
  tailwindcss: 'tailwindcss',
  html5: 'html5',
  css3: 'css3',
  css: 'css3',
  'vs code': 'vscode',
  vscode: 'vscode',
  firebase: 'firebase',
  postgresql: 'postgresql',
  mysql: 'mysql',
  git: 'git',
  github: 'github',
  flutter: 'flutter',
  dart: 'dart',
  docker: 'docker',
  aws: 'amazonwebservices',
  vercel: 'vercel',
  prisma: 'prisma',
  figma: 'figma',
  redis: 'redis',
  'google gemini': 'googlegemini',
  gemini: 'googlegemini',
  express: 'express',
  graphql: 'graphql',
}

export function techLogoSlug(name: string): string | undefined {
  return TECH_LOGO[name.trim().toLowerCase()]
}

/** Short, stable slug from a project title (part before an em dash). */
export function projectSlug(title: string) {
  return (title.split('—')[0] || title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export type TimelinePhase = { phase: string; period: string; detail: string }
export type TeamMember = { name: string; role: string }
export type ProjectDetail = {
  timeline: TimelinePhase[]
  team: TeamMember[]
  gallery: number
  liveUrl?: string
}

/** Rich detail used by the dedicated project pages, keyed by projectSlug(). */
export const projectDetails: Record<string, ProjectDetail> = {
  eleviq: {
    gallery: 6,
    timeline: [
      { phase: 'Planning & Design', period: 'Feb 2026', detail: 'Feature spec, Firestore schema, and product/branding for the finance ecosystem.' },
      { phase: 'Web MVP', period: 'Feb 2026', detail: 'Next.js dashboard with local state, laying out expenses, goals and analytics.' },
      { phase: 'Database-driven Migration', period: 'Feb–Mar 2026', detail: 'Replaced local state with Firestore real-time hooks; added session cookies and the custom user-document layer.' },
      { phase: 'AI Integration', period: 'Mar 2026', detail: 'Gemini receipt scanning, streaming chat, insights, and voice-to-expense API routes.' },
      { phase: 'Flutter App', period: 'Mar 2026', detail: 'Feature-first Flutter client (Riverpod + go_router) reusing the Firebase backend and web API.' },
      { phase: 'Backend & Deploy', period: 'Mar 2026', detail: 'Cloud Functions for budget alerts and cron summaries; deployed web to Vercel, Flutter to Android/iOS/Web.' },
    ],
    team: [
      { name: 'Abarna Sivakumar', role: 'Full-stack & cross-platform developer' },
      { name: 'Saai Siddharth', role: 'Full-stack & cross-platform developer' },
    ],
  },
  letbuyy: {
    gallery: 7,
    timeline: [
      { phase: 'Foundation', period: '2025', detail: 'Melos monorepo, shared packages, and multi-role Firebase auth (email OTP + admin TOTP 2FA).' },
      { phase: 'Seller onboarding & KYC', period: '2025', detail: 'Cloud Vision PAN/Aadhaar OCR, fuzzy name matching, selfie face-match, and bank/IFSC capture.' },
      { phase: 'Catalog, orders & settlements', period: '2025', detail: 'Products with variants/inventory, the order lifecycle, and itemized settlement invoicing.' },
      { phase: 'Wallet & payout system', period: '2025', detail: 'Production-grade seller wallet, tiered commissions, scheduled auto-payouts, and a transaction ledger.' },
      { phase: 'Reels, store builder & ads', period: '2025–2026', detail: 'Reels feed with cost-per-view billing, a subscription store-builder, and admin ad campaigns.' },
      { phase: 'AI & storefront delivery', period: '2026', detail: 'Gemini shopping assistant + visual search, and subdomain storefronts via Cloudflare → Vercel.' },
    ],
    team: [
      { name: 'Abarna Sivakumar', role: 'Full-stack & mobile developer' },
      { name: 'Saai Siddharth', role: 'Full-stack & mobile developer' },
    ],
  },
  quickplus: {
    gallery: 6,
    timeline: [
      { phase: 'Architecture & design', period: '2025', detail: 'DDD system design, ~28 ADRs, the Prisma schema, and API/UI specs.' },
      { phase: 'Backend & app build', period: '2025–2026', detail: 'FastAPI backend (auth, scanner, community, admin), Redis caching, Celery jobs, and the mobile app shell with CI/CD.' },
      { phase: 'Safe-browser core', period: '2026', detail: 'Guest-first safe browser: pre-navigation interception, on-device risk engine, block/warn interstitials, and a threat cache.' },
    ],
    team: [
      { name: 'Abarna Sivakumar', role: 'Full-stack & security developer' },
      { name: 'Saai Siddharth', role: 'Full-stack & security developer' },
    ],
  },
}

export type Expertise = {
  title: string
  description: string
  tags: string[]
}

export const expertise: Expertise[] = [
  {
    title: 'AI & GenAI Development',
    description:
      'Designing AI-assisted product features — OCR pipelines, LLM integrations, and data-driven insight engines that turn raw input into decisions.',
    tags: ['Google Gemini', 'Python', 'OCR', 'Prompt Design'],
  },
  {
    title: 'Full-Stack Web Development',
    description:
      'Building end-to-end web apps with clean React interfaces, typed data flow, secure auth, and payment integrations that ship.',
    tags: ['React.js', 'TypeScript', 'Next.js', 'Firebase', 'REST APIs'],
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Deploying and operating on AWS — EC2, S3, IAM, VPC and Lambda — with a focus on secure, scalable, cost-aware infrastructure.',
    tags: ['AWS', 'EC2', 'S3', 'Lambda', 'IAM'],
  },
  {
    title: 'Mobile App Development',
    description:
      'Cross-platform mobile experiences with Flutter and Firebase, from data modelling to responsive, real-time UI.',
    tags: ['Flutter', 'Firebase', 'Dart'],
  },
]
