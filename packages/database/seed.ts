import {
  PrismaClient,
  SkillCategory,
  ExperienceType,
  LanguageProficiency,
  ActivityType,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean slate
  await prisma.siteSettings.deleteMany()
  await prisma.portfolio.deleteMany()

  await prisma.portfolio.create({
    data: {
      slug: 'abarna',
      firstName: 'Abarna',
      lastName: 'Sivakumar',
      fullName: 'Abarna Sivakumar',
      initials: 'AS.',
      title: 'AI & Full-Stack Developer',
      tagline: 'Building intelligent products that are clean, scalable, and genuinely useful.',
      summary:
        'B.Tech Artificial Intelligence & Data Science student (2026) with hands-on experience across Java, Python, TypeScript, React, FastAPI and AWS — building AI-integrated, scalable applications across cybersecurity, fintech and e-commerce.',
      email: 'abarnasivakumar15@gmail.com',
      phone: '+91 7810009685',
      location: 'Salem, Tamil Nadu',
      linkedinUrl: 'https://www.linkedin.com/in/abarna-sivakumar0115',
      githubUrl: 'https://github.com/Abarna-SA',
      avatarUrl: '/portrait.jpg',
      resumeUrl: '/resume.pdf',
      seoTitle: 'Abarna Sivakumar — AI & Full-Stack Developer',
      seoDescription:
        'Portfolio of Abarna Sivakumar, AI & Data Science engineer building AI-integrated full-stack applications across cybersecurity, fintech and e-commerce.',

      skills: {
        create: [
          { name: 'Java', category: SkillCategory.LANGUAGE, proficiency: 85, iconSlug: 'openjdk', isHighlighted: true, displayOrder: 1 },
          { name: 'Python', category: SkillCategory.LANGUAGE, proficiency: 80, iconSlug: 'python', isHighlighted: true, displayOrder: 2 },
          { name: 'JavaScript', category: SkillCategory.LANGUAGE, proficiency: 78, iconSlug: 'javascript', displayOrder: 3 },
          { name: 'TypeScript', category: SkillCategory.LANGUAGE, proficiency: 72, iconSlug: 'typescript', displayOrder: 4 },
          { name: 'React.js', category: SkillCategory.FRAMEWORK, proficiency: 82, iconSlug: 'react', isHighlighted: true, displayOrder: 5 },
          { name: 'Next.js', category: SkillCategory.FRAMEWORK, proficiency: 80, iconSlug: 'nextdotjs', displayOrder: 6 },
          { name: 'FastAPI', category: SkillCategory.FRAMEWORK, proficiency: 75, iconSlug: 'fastapi', displayOrder: 7 },
          { name: 'HTML5', category: SkillCategory.FRAMEWORK, proficiency: 90, iconSlug: 'html5', displayOrder: 8 },
          { name: 'CSS3', category: SkillCategory.FRAMEWORK, proficiency: 85, iconSlug: 'css3', displayOrder: 9 },
          { name: 'Flutter', category: SkillCategory.FRAMEWORK, proficiency: 70, iconSlug: 'flutter', displayOrder: 10 },
          { name: 'PostgreSQL', category: SkillCategory.DATABASE, proficiency: 75, iconSlug: 'postgresql', isHighlighted: true, displayOrder: 11 },
          { name: 'MySQL', category: SkillCategory.DATABASE, proficiency: 78, iconSlug: 'mysql', displayOrder: 12 },
          { name: 'Firebase', category: SkillCategory.DATABASE, proficiency: 80, iconSlug: 'firebase', displayOrder: 13 },
          { name: 'AWS', category: SkillCategory.CLOUD, proficiency: 70, iconSlug: 'amazonwebservices', isHighlighted: true, displayOrder: 14 },
          { name: 'GitHub', category: SkillCategory.TOOL, proficiency: 85, iconSlug: 'github', displayOrder: 15 },
          { name: 'VS Code', category: SkillCategory.TOOL, proficiency: 92, iconSlug: 'vscode', displayOrder: 16 },
        ],
      },

      projects: {
        create: [
          {
            title: 'ElevIQ — GenAI Personal Finance Assistant',
            slug: 'eleviq',
            role: 'Co-developer (2-person team) — worked across the Next.js/React web dashboard, the Flutter mobile app, and the Firebase serverless backend, including the Gemini AI receipt-scanning and chat pipeline, custom multi-provider auth, and the Firestore data layer.',
            problem:
              'Manual expense tracking is tedious and most finance apps require risky bank-account linking, so people abandon budgeting and lose visibility into where their money goes.',
            solution:
              'A cross-platform (web + Android/iOS) AI finance assistant on a shared Firebase backend: photograph a receipt and Google Gemini extracts vendor, amount, date and line-items into categorised expenses, chat with an AI over your spending, and manage goals, budgets, bills, net worth and 15 financial calculators.',
            outcome:
              'Shipped a large real-time ecosystem — a ~23-screen web dashboard, a 27-page Flutter app, and a Firebase backend (Auth, Firestore, Storage, 7 Cloud Functions) — with core expense data syncing live across web and mobile.',
            description: `## Overview\nElevIQ is a GenAI personal-finance assistant delivered as both a Next.js web dashboard and a Flutter mobile app (Android/iOS) on one shared Firebase backend. It removes manual data entry by using Google Gemini to read receipts and analyse financial documents — with no bank-account linking.\n\n## Key Features\n- **AI receipt scanning** — photo to categorised expense with 7 category-specific extraction prompts and confidence scoring\n- **Streaming AI finance chat** over your data and uploaded statements (images, PDF, CSV)\n- **Full money toolkit** — dashboard, analytics, goals, net worth, bills, reminders, spending limits, bill-splitting\n- **15 working financial calculators** — EMI, SIP, FIRE, tax regime comparison, and more\n- **Custom auth** — sequential human-readable IDs, email + Google account linking, and session cookies\n\n## Architecture\nTwo native clients (React/TypeScript web, Dart/Flutter mobile) over a single Firebase project. Firestore stores expenses in a shared top-level collection keyed by userId for real-time sync; Cloud Functions handle budget-alert triggers and scheduled summaries; Gemini runs server-side on web and on-device in the Flutter scanner.`,
            thumbnailUrl: '/eleviq-cover.png',
            imageUrls: [],
            techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'Google Gemini', 'Vercel'],
            tags: ['AI', 'Finance', 'Full-Stack', 'Cross-Platform'],
            metricHighlights: [
              'Two native clients on one Firebase backend — a 23-screen Next.js web dashboard + a 27-page Flutter app with real-time expense sync',
              'Gemini-powered receipt OCR with 7 category-specific extraction prompts (no traditional OCR library)',
              'Streaming AI finance chat that ingests images, PDF & CSV and produces a structured 20-section statement analysis',
              '15 fully working financial calculators (EMI, SIP, FIRE, tax regime comparison) with verified formulas',
            ],
            platforms: ['Web', 'Flutter (Android/iOS)'],
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
            status: 'COMPLETED',
            isFeatured: true,
            displayOrder: 1,
            startDate: new Date('2026-01-01'),
            githubUrl: 'https://github.com/SiddhuSaai/ElevIQ',
            liveUrl: 'https://elev-iq.web.app',
          },
          {
            title: 'LetBuyy — Reels-Commerce Marketplace',
            slug: 'letbuyy',
            role: 'Co-developer (2-person team) — worked across a reels-first marketplace: Flutter buyer/seller/admin apps, Next.js web apps, and a 24-module TypeScript Firebase Functions backend (payments, tiered commissions, wallet/payouts, KYC, ads, subscriptions), plus the Firestore data model and role-based security rules.',
            problem:
              "Traditional marketplaces show static product grids that don't convert the way short-form video does, and small Indian sellers lack an easy way to run a branded store, get verified, take payments, and receive reliable bank payouts in one place.",
            solution:
              'A reels-first, multi-sided marketplace: buyers shop from tagged short videos, and sellers onboard via automated KYC, list products, upload reels, run pay-per-click/view ad campaigns, and get paid out to their bank accounts automatically — plus a built-in Shopify-style store builder.',
            outcome:
              'Shipped and published on the Google Play Store (com.letbuyy.letbuyy, v1.0.10), iterated across 10+ releases, with a full money layer live: Razorpay checkout with HMAC signature verification, a tiered commission engine, idempotent wallet crediting, scheduled auto-payouts, and itemized settlement invoices.',
            description: `## Overview\nLetBuyy is a live, published-on-Google-Play reels-commerce marketplace: buyers shop from short vertical videos, sellers run stores and upload reels, and an admin team governs the platform. A built-in Shopify-style store builder lets sellers launch their own branded storefront on a subdomain.\n\n## What makes it hard\n- **Reels / video commerce** — a vertical player with an LRU controller cache and eager preloading for instant playback, in-video product tagging, and cost-per-view ad billing.\n- **Payments & seller payouts** — Razorpay checkout with server-side order creation and HMAC-SHA256 verification; a tiered commission engine; idempotent, delivery-triggered wallet crediting; itemized settlement invoices and scheduled bank payouts.\n- **KYC** — automated PAN + Aadhaar OCR via Google Cloud Vision, fuzzy name matching, and a selfie face-match.\n\n## Architecture\nFour Flutter clients and three Next.js web apps share one Firebase project. Firestore (60+ collections) holds the denormalized data model; Cloud Functions (Node 20 / TypeScript) own all money movement, KYC, ads, and subscriptions.\n\n## Shipped\nLive on the Google Play Store — com.letbuyy.letbuyy.`,
            thumbnailUrl: '/letbuyy-cover.png',
            imageUrls: [],
            techStack: ['Flutter', 'Dart', 'Firebase', 'TypeScript', 'Next.js', 'React', 'Cloud Firestore', 'Cloud Functions', 'Razorpay', 'Google Cloud Vision', 'Redis', 'Cloudflare Workers'],
            tags: ['E-Commerce', 'Marketplace', 'Reels/Video', 'Payments'],
            metricHighlights: [
              'Published on the Google Play Store — com.letbuyy.letbuyy (v1.0.10), signed release builds with R8 + Crashlytics, across 10+ releases',
              'Multi-app platform on one Firebase backend: 4 Flutter apps + 3 Next.js web apps + a Cloudflare Worker, in a Melos monorepo',
              '~15,000-line, 24-module TypeScript Cloud Functions backend powering payments, tiered commissions, wallet/payouts, KYC, ads and subscriptions',
              'End-to-end money layer: Razorpay checkout with HMAC-SHA256 verification, a tiered commission engine, idempotent wallet crediting, and scheduled bank payouts',
              'Automated Indian seller KYC — PAN + Aadhaar OCR via Google Cloud Vision, fuzzy name matching, and a selfie face-match',
            ],
            platforms: ['Flutter (Android/iOS)', 'Next.js web'],
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
            status: 'COMPLETED',
            isFeatured: true,
            displayOrder: 2,
            startDate: new Date('2026-01-01'),
            githubUrl: 'https://github.com/letbuyy/letbuyy',
            liveUrl: 'https://letbuyy.store',
            playStoreUrl: 'https://play.google.com/store/apps/details?id=com.letbuyy.letbuyy',
          },
          {
            title: 'Quick+ PhishGuard — AI Phishing Detection & Safe Browser',
            slug: 'quickplus',
            role: 'Co-developer (2-person team) — worked across the Flutter Android safe-browser client, the FastAPI / PostgreSQL / Redis backend, the layered URL-detection pipeline, and the Docker / CI deployment.',
            problem:
              'Phishing and scam links (fake KYC, UPI, bank-verification, OTP-theft and reward messages) reach people through SMS, WhatsApp, email and the browser and cost victims money and credentials — a severe problem in India.',
            solution:
              'An Android app with a built-in safe browser that evaluates every URL before the page loads and picks a browsing mode proportional to the risk (Normal / Protected / Warn / Block), combining an on-device Dart heuristic engine with a cloud check (community patterns, lexical heuristics, and a fine-tuned BERT model).',
            outcome:
              'Built a working guest-first safe-browser core with pre-navigation phishing interception and block/warn interstitials, on a hardened FastAPI backend (JWT RS256 with refresh-token rotation & reuse detection, rate limiting, Redis caching, Celery jobs, CI/CD), covered by ~30 backend and 40+ mobile tests.',
            description: `## Overview\nQuick+ PhishGuard is an Android app whose centerpiece is a built-in **safe browser**: it evaluates every URL *before the page loads* and selects a browsing mode (Normal / Protected / Warn / Block) proportional to the risk, tuned for India's scam landscape. It's backed by a clean-architecture FastAPI service and a community threat network.\n\n## How the safe browser protects you\n- **URL interception + real-time scan** — navigations are intercepted pre-commit in a flutter_inappwebview WebView; a full-screen interstitial blocks or warns with a plain-English reason.\n- **On-device (instant, private) → cloud (deep)** — a pure-Dart heuristic risk engine runs first with no network; a policy controller merges the two scores with fail-safe defaults (block ≥ 0.85, warn ≥ 0.55).\n\n## Detection pipeline\n- **Signals** — lexical/host heuristics (IP-host, punycode, mixed-script, Levenshtein typosquat vs 18 brands, suspicious TLDs, shorteners) plus a Hive allow/blocklist on-device; community patterns + heuristics on the backend.\n- **Model** — the cloud verdict uses a fine-tuned BERT phishing model via the Hugging Face Inference API, with a heuristic + community-pattern fallback.\n\n## Backend\nFastAPI (clean / DDD) · PostgreSQL via Prisma · Redis · Celery jobs · JWT RS256 with refresh-token rotation & reuse detection · per-endpoint rate limiting.`,
            thumbnailUrl: '/quickplus-cover.png',
            imageUrls: [],
            techStack: ['Flutter', 'Dart', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Riverpod', 'Hugging Face', 'Next.js'],
            tags: ['Cybersecurity', 'AI', 'Safe Browser', 'Full-Stack'],
            metricHighlights: [
              'Pre-navigation URL interception in an in-app safe browser (flutter_inappwebview) with block/warn interstitials and a fail-safe default',
              'Two-tier detection: on-device Dart risk engine (13+ signals) + cloud analysis merged by a policy controller',
              'Cloud phishing verdict via a fine-tuned BERT model (Hugging Face Inference API) with fallback to heuristics + community patterns',
              'Hardened FastAPI backend: JWT RS256 with refresh-token rotation & reuse detection, rate limiting, Redis caching, Celery jobs, Docker + CI/CD',
              'Guest-first, privacy-preserving design covered by ~30 backend and 40+ Flutter unit/integration tests',
            ],
            platforms: ['Flutter Android', 'FastAPI backend', 'Next.js landing'],
            timeline: [
              { phase: 'Architecture & design', period: '2025', detail: 'DDD system design, ~28 ADRs, the Prisma schema, and API/UI specs.' },
              { phase: 'Backend & app build', period: '2025–2026', detail: 'FastAPI backend (auth, scanner, community, admin), Redis caching, Celery jobs, and the mobile app shell with CI/CD.' },
              { phase: 'Safe-browser core', period: '2026', detail: 'Guest-first safe browser: pre-navigation interception, on-device risk engine, block/warn interstitials, and a threat cache.' },
            ],
            team: [
              { name: 'Abarna Sivakumar', role: 'Full-stack & security developer' },
              { name: 'Saai Siddharth', role: 'Full-stack & security developer' },
            ],
            status: 'COMPLETED',
            isFeatured: true,
            displayOrder: 3,
            startDate: new Date('2026-01-01'),
            githubUrl: 'https://github.com/QuickPlus26/QuickPlus',
            liveUrl: 'https://quickplus.vercel.app',
          },
        ],
      },

      experiences: {
        create: [
          {
            company: 'iStudio',
            role: 'AWS Cloud Intern',
            type: ExperienceType.INTERNSHIP,
            description: 'Hands-on AWS cloud internship covering core cloud services and deployment automation.',
            highlights: [
              'Provisioned and configured EC2, S3, IAM and Lambda for cloud deployment and automation workflows',
              'Gained practical exposure to cloud deployment fundamentals',
              'Completed the AWS Cloud Training Program certification',
            ],
            techStack: ['AWS', 'EC2', 'S3', 'IAM', 'Lambda'],
            period: 'Nov 2025 – Dec 2025',
            startDate: new Date('2025-11-01'),
            endDate: new Date('2025-12-31'),
            displayOrder: 1,
          },
          {
            company: 'Emglitz Technologies',
            role: 'Java Developer Intern',
            location: 'Coimbatore',
            type: ExperienceType.INTERNSHIP,
            description: 'Backend Java development in an Agile team.',
            highlights: [
              'Developed backend service modules in Java using OOP principles and structured design approaches',
              'Collaborated in Agile sprints with daily standups',
              'Wrote unit tests and took part in code reviews',
            ],
            techStack: ['Java', 'OOP', 'Agile', 'Git'],
            period: 'Feb 2024 – Mar 2024',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-31'),
            displayOrder: 2,
          },
        ],
      },

      educations: {
        create: [
          {
            institution: 'Dhanalakshmi Srinivasan College of Engineering',
            degree: 'B.Tech — Artificial Intelligence & Data Science',
            field: 'Artificial Intelligence and Data Science',
            grade: 'CGPA: 8.5 / 10',
            location: 'Tamil Nadu',
            startDate: new Date('2022-08-01'),
            endDate: new Date('2026-05-31'),
            isCurrent: true,
            displayOrder: 1,
          },
        ],
      },

      certifications: {
        create: [
          { name: 'AWS Cloud Training', issuer: 'iStudio', displayDate: 'Dec 2025', displayOrder: 1 },
          { name: 'Cloud Computing', issuer: 'NPTEL', displayDate: '2024', displayOrder: 2 },
          { name: 'MongoDB Basics', issuer: 'MongoDB Skills', displayDate: '2024', displayOrder: 3 },
          { name: 'Introduction to Generative AI', issuer: 'IBM SkillsBuild', displayDate: '2024', displayOrder: 4 },
          { name: 'Cyber Security Fundamentals', issuer: 'IBM SkillsBuild', displayDate: '2024', displayOrder: 5 },
        ],
      },

      activities: {
        create: [
          { title: 'College Coding Club Member', description: 'Organized hackathons and mentored juniors on programming fundamentals.', type: ActivityType.ACTIVITY, displayOrder: 1 },
          { title: 'Hackathon Winner', description: 'Won top prizes at multiple hackathons and earned free internship offers.', type: ActivityType.HACKATHON, displayOrder: 2 },
          { title: 'Open Source Contributor', description: 'Published backend and cloud projects on GitHub.', type: ActivityType.ACTIVITY, displayOrder: 3 },
        ],
      },

      languages: {
        create: [
          { name: 'Tamil', proficiency: LanguageProficiency.NATIVE, displayOrder: 1 },
          { name: 'English', proficiency: LanguageProficiency.PROFICIENT, displayOrder: 2 },
          { name: 'Hindi', proficiency: LanguageProficiency.BASIC, displayOrder: 3 },
        ],
      },

      techStack: {
        create: [
          { name: 'React', iconSlug: 'react', displayOrder: 1 },
          { name: 'TypeScript', iconSlug: 'typescript', displayOrder: 2 },
          { name: 'Python', iconSlug: 'python', displayOrder: 3 },
          { name: 'Java', iconSlug: 'openjdk', displayOrder: 4 },
          { name: 'Next.js', iconSlug: 'nextdotjs', displayOrder: 5 },
          { name: 'FastAPI', iconSlug: 'fastapi', displayOrder: 6 },
          { name: 'Flutter', iconSlug: 'flutter', displayOrder: 7 },
          { name: 'Firebase', iconSlug: 'firebase', displayOrder: 8 },
          { name: 'PostgreSQL', iconSlug: 'postgresql', displayOrder: 9 },
          { name: 'AWS', iconSlug: 'amazonwebservices', displayOrder: 10 },
          { name: 'Docker', iconSlug: 'docker', displayOrder: 11 },
          { name: 'Redis', iconSlug: 'redis', displayOrder: 12 },
        ],
      },
    },
  })

  await prisma.siteSettings.create({
    data: {
      chatbotEnabled: true,
      contactFormEnabled: true,
      openToWork: true,
      availabilityText: 'Open to Full-Time Roles',
      chatbotName: 'Ask about Abarna',
      chatbotGreeting: "Hi! Ask me anything about Abarna's skills, projects, or experience.",
    },
  })

  console.log('✅ Database seeded successfully')
  console.log('   Projects: 3 | Skills: 16 | Experience: 2 | Education: 1 | Certs: 5')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
