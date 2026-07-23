import {
  PrismaClient,
  SkillCategory,
  ExperienceType,
  LanguageProficiency,
  ActivityType,
} from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'

const prisma = new PrismaClient()

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clean slate
  await prisma.siteSettings.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.portfolio.deleteMany()

  // ─── Portfolio + nested relations ───────────────────────────
  await prisma.portfolio.create({
    data: {
      slug:          'abarna',
      firstName:     'Abarna',
      lastName:      'Sivakumar',
      fullName:      'Abarna Sivakumar',
      initials:      'AS.',
      title:         'AI & Full-Stack Developer',
      tagline:       'I build intelligent, scalable digital products.',
      summary:       'B.Tech AI & Data Science student (2026) with hands-on experience in Java, Python, React.js, and AWS. Passionate about building scalable, secure applications that solve real problems.',
      email:         'abarnasivakumar15@gmail.com',
      phone:         '+91 7810009685',
      location:      'Salem, Tamil Nadu',
      linkedinUrl:   'https://linkedin.com/in/abarnasivakumar',
      githubUrl:     'https://github.com/abarnasivakumar',
      seoTitle:      'Abarna Sivakumar — AI & Full-Stack Developer',
      seoDescription:'Portfolio of Abarna Sivakumar, AI & Data Science engineer building full-stack applications with React, Python, and AWS.',

      skills: {
        create: [
          { name: 'Java',        category: SkillCategory.LANGUAGE,  proficiency: 85, iconSlug: 'java',              isHighlighted: true,  displayOrder: 1 },
          { name: 'Python',      category: SkillCategory.LANGUAGE,  proficiency: 80, iconSlug: 'python',            isHighlighted: true,  displayOrder: 2 },
          { name: 'JavaScript',  category: SkillCategory.LANGUAGE,  proficiency: 78, iconSlug: 'javascript',                               displayOrder: 3 },
          { name: 'TypeScript',  category: SkillCategory.LANGUAGE,  proficiency: 72, iconSlug: 'typescript',                               displayOrder: 4 },
          { name: 'React.js',    category: SkillCategory.FRAMEWORK, proficiency: 82, iconSlug: 'react',             isHighlighted: true,  displayOrder: 5 },
          { name: 'HTML5',       category: SkillCategory.FRAMEWORK, proficiency: 90, iconSlug: 'html5',                                    displayOrder: 6 },
          { name: 'CSS3',        category: SkillCategory.FRAMEWORK, proficiency: 85, iconSlug: 'css3',                                     displayOrder: 7 },
          { name: 'Flutter',     category: SkillCategory.FRAMEWORK, proficiency: 70, iconSlug: 'flutter',                                  displayOrder: 8 },
          { name: 'PostgreSQL',  category: SkillCategory.DATABASE,  proficiency: 75, iconSlug: 'postgresql',        isHighlighted: true,  displayOrder: 9 },
          { name: 'MySQL',       category: SkillCategory.DATABASE,  proficiency: 78, iconSlug: 'mysql',                                    displayOrder: 10 },
          { name: 'Firebase',    category: SkillCategory.DATABASE,  proficiency: 80, iconSlug: 'firebase',                                 displayOrder: 11 },
          { name: 'AWS',         category: SkillCategory.CLOUD,     proficiency: 70, iconSlug: 'amazonwebservices', isHighlighted: true,  displayOrder: 12 },
          { name: 'GitHub',      category: SkillCategory.TOOL,      proficiency: 85, iconSlug: 'github',                                   displayOrder: 13 },
          { name: 'VS Code',     category: SkillCategory.TOOL,      proficiency: 92, iconSlug: 'vscode',                                   displayOrder: 14 },
        ],
      },

      projects: {
        create: [
          {
            title:       'ElevIQ — GenAI Personal Financial Assistant',
            slug:        'eleviq',
            role:        'Full-stack developer - AI features, Firebase data model, and dashboard UI',
            problem:     'Managing personal finances is complex — most tools lack intelligent, personalized insights.',
            solution:    'Built an AI-powered finance assistant with OCR receipt analysis and Gemini-driven financial guidance.',
            outcome:     'Converted manual receipt tracking into structured transactions and insight cards for faster financial decisions.',
            description: '## Overview\n\nElevIQ is a full-stack GenAI application that transforms how individuals track and understand their finances.\n\n## Key Features\n\n- **OCR Receipt Analysis** — Upload receipts; AI extracts structured data automatically\n- **AI Financial Insights** — Google Gemini for personalized, context-aware guidance\n- **Real-time Analytics** — Live dashboards with spending patterns and category breakdowns\n\n## Tech Stack\n\nTypeScript + Firebase for real-time sync, Google Gemini API for AI, React.js frontend.',
            techStack:   ['TypeScript', 'Firebase', 'Google Gemini', 'React.js', 'OCR API'],
            tags:        ['AI', 'Finance', 'Full-Stack', 'GenAI'],
            metricHighlights: ['AI receipt parsing', 'Real-time dashboards', 'Personalized insights'],
            isFeatured:  true,
            displayOrder: 1,
            startDate:   new Date('2025-01-01'),
            githubUrl:   'https://github.com/abarnasivakumar/eleviq',
          },
          {
            title:       'LetBuyy — E-Commerce Platform',
            slug:        'letbuyy',
            role:        'Frontend and integration developer - shopping flow, auth, and payments',
            problem:     'Building a secure, feature-rich e-commerce experience with real payment integration is complex.',
            solution:    'Developed a complete React e-commerce app with cart, wishlist, Razorpay integration, and Firebase auth.',
            outcome:     'Delivered a working shopping journey with persistent user state and payment-ready checkout flow.',
            description: '## Overview\n\nLetBuyy is a full-featured e-commerce web application providing a seamless shopping experience.\n\n## Key Features\n\n- **Product Catalog** — Browsable catalog with search and filter\n- **Cart & Wishlist** — Persistent cart management\n- **Razorpay Payments** — Secure payment integration with webhook handling\n- **Firebase Auth** — Secure user authentication\n\n## Tech Stack\n\nReact.js frontend with Firebase backend and Razorpay payment gateway.',
            techStack:   ['React.js', 'Firebase', 'Razorpay', 'JavaScript', 'CSS3'],
            tags:        ['E-Commerce', 'React', 'Payments'],
            metricHighlights: ['Cart and wishlist flow', 'Firebase authentication', 'Razorpay checkout'],
            isFeatured:  true,
            displayOrder: 2,
            startDate:   new Date('2024-01-01'),
            githubUrl:   'https://github.com/abarnasivakumar/letbuyy',
          },
        ],
      },

      experiences: {
        create: [
          {
            company:     'iStudio',
            role:        'AWS Cloud Intern',
            type:        ExperienceType.INTERNSHIP,
            description: 'Completed hands-on internship on AWS cloud services covering core cloud concepts and infrastructure.',
            highlights:  ['Worked with EC2, S3, IAM, VPC, Lambda', 'Gained practical exposure to cloud deployment fundamentals', 'Completed AWS Cloud Training Program certification'],
            techStack:   ['AWS', 'EC2', 'S3', 'IAM', 'Lambda'],
            period:      'Nov 2025 – Dec 2025',
            startDate:   new Date('2025-11-01'),
            endDate:     new Date('2025-12-31'),
            displayOrder: 1,
          },
          {
            company:     'Emglitz Technologies',
            role:        'Java Developer Intern',
            location:    'Coimbatore',
            type:        ExperienceType.INTERNSHIP,
            description: 'Developed Java backend modules and collaborated in an Agile development environment.',
            highlights:  ['Developed Java backend modules using OOP principles', 'Collaborated in Agile sprints with daily standups', 'Wrote unit tests and participated in code reviews'],
            techStack:   ['Java', 'OOP', 'Agile', 'Git'],
            period:      'Feb 2024 – Mar 2024',
            startDate:   new Date('2024-02-01'),
            endDate:     new Date('2024-03-31'),
            displayOrder: 2,
          },
        ],
      },

      educations: {
        create: [
          {
            institution: 'Dhanalakshmi Srinivasan College of Engineering',
            degree:      'B.Tech',
            field:       'Artificial Intelligence and Data Science',
            grade:       'CGPA: 8.5',
            location:    'Coimbatore, Tamil Nadu',
            startDate:   new Date('2022-08-01'),
            endDate:     new Date('2026-05-31'),
            isCurrent:   true,
            displayOrder: 1,
          },
        ],
      },

      certifications: {
        create: [
          { name: 'AWS Cloud Training Program',    issuer: 'iStudio / Amazon Web Services', displayDate: 'Dec 2025', displayOrder: 1 },
          { name: 'Cloud Computing',               issuer: 'NPTEL',                         displayDate: '2024',     displayOrder: 2 },
          { name: 'Introduction to Generative AI', issuer: 'IBM SkillsBuild',               displayDate: '2024',     displayOrder: 3 },
          { name: 'Cyber Security Fundamentals',   issuer: 'IBM SkillsBuild',               displayDate: '2024',     displayOrder: 4 },
        ],
      },

      activities: {
        create: [
          { title: 'College Coding Club Member', description: 'Organized hackathons and mentored juniors on programming fundamentals.', type: ActivityType.ACTIVITY,  displayOrder: 1 },
          { title: 'Hackathon Winner',           description: 'Won top prizes at multiple hackathons and earned free internship offers.',  type: ActivityType.HACKATHON, displayOrder: 2 },
          { title: 'Open Source Contributor',    description: 'Published backend and cloud projects on GitHub.',                           type: ActivityType.ACTIVITY,  displayOrder: 3 },
        ],
      },

      languages: {
        create: [
          { name: 'Tamil',   proficiency: LanguageProficiency.NATIVE,     displayOrder: 1 },
          { name: 'English', proficiency: LanguageProficiency.PROFICIENT,  displayOrder: 2 },
          { name: 'Hindi',   proficiency: LanguageProficiency.BASIC,       displayOrder: 3 },
        ],
      },

      techStack: {
        create: [
          { name: 'React',         iconSlug: 'react',              displayOrder: 1 },
          { name: 'Python',        iconSlug: 'python',             displayOrder: 2 },
          { name: 'TypeScript',    iconSlug: 'typescript',         displayOrder: 3 },
          { name: 'Java',          iconSlug: 'java',               displayOrder: 4 },
          { name: 'AWS',           iconSlug: 'amazonwebservices',  displayOrder: 5 },
          { name: 'Firebase',      iconSlug: 'firebase',           displayOrder: 6 },
          { name: 'PostgreSQL',    iconSlug: 'postgresql',         displayOrder: 7 },
          { name: 'Flutter',       iconSlug: 'flutter',            displayOrder: 8 },
          { name: 'GitHub',        iconSlug: 'github',             displayOrder: 9 },
          { name: 'Next.js',       iconSlug: 'nextdotjs',          displayOrder: 10 },
          { name: 'Google Gemini', iconSlug: 'google',             displayOrder: 11 },
        ],
      },
    },
  })

  // ─── Site Settings ──────────────────────────────────────────
  await prisma.siteSettings.create({
    data: {
      chatbotEnabled:     true,
      contactFormEnabled: true,
      openToWork:         true,
      availabilityText:   'Open to full-time opportunities from 2026',
      chatbotName:        'Ask about Abarna',
      chatbotGreeting:    "Hi! I'm an AI assistant. Ask me anything about Abarna's skills, projects, or experience.",
    },
  })

  await prisma.adminUser.create({
    data: {
      email: 'admin@portfolio.local',
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || 'admin123'),
    },
  })

  console.log('✅ Database seeded successfully')
  console.log('📊 Portfolio: Abarna Sivakumar (slug: abarna)')
  console.log('   Skills: 14 | Projects: 2 | Experience: 2 | Education: 1 | Certs: 4')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
