# FILE REGISTRY
> Read this before creating ANY new file.
> If a file's responsibility already exists below → EDIT that canonical file. Do NOT create a new one.

---

## packages/database
| File | Responsibility |
|------|---------------|
| `schema.prisma` | CANONICAL DB schema. Only file allowed to define Prisma models/enums. |
| `client.ts` | Prisma singleton export. Only Prisma client instance in the project. |
| `seed.ts` | All seed data for Abarna's portfolio. Run with `pnpm db:seed`. |
| `index.ts` | Barrel export — re-exports client + all Prisma types. |

## packages/validators
| File | Responsibility |
|------|---------------|
| `contact.schema.ts` | Zod schema for contact form (shared client + server). |
| `chatbot.schema.ts` | Zod schema for chatbot API body validation. |
| `index.ts` | Barrel export for all schemas. |

## packages/cache
| File | Responsibility |
|------|---------------|
| `client.ts` | Upstash Redis singleton. Never import Redis directly in app code. |
| `cache-keys.ts` | ALL cache key factories. Add new keys HERE ONLY. |
| `cache-strategy.ts` | ALL TTL constants. No TTL magic numbers anywhere else. |
| `cache-helpers.ts` | `withCache` and `cacheInvalidate` — the only two cache patterns allowed. |
| `index.ts` | Barrel export. |

## apps/web/src/server/services
| File | Responsibility |
|------|---------------|
| `portfolio.service.ts` | All public portfolio reads — cache-first pattern. |
| `contact.service.ts` | Contact form save + IP rate limiting. |
| `chatbot.service.ts` | Claude API call + ChatMessage save. |
| `admin.service.ts` | All admin CRUD operations + resume PDF parsing. |

## apps/web/src/server/handlers
| File | Responsibility |
|------|---------------|
| `portfolio.handlers.ts` | Thin handlers — calls portfolioService, wrapped with apiHandler(). |
| `contact.handlers.ts` | Thin handlers — calls contactService, wrapped with apiHandler(). |
| `chatbot.handlers.ts` | Thin handlers — calls chatbotService, wrapped with apiHandler(). |
| `admin.handlers.ts` | Thin handlers — calls adminService, wrapped with apiHandler(). |

## apps/web/src/server/middleware
| File | Responsibility |
|------|---------------|
| `auth.middleware.ts` | Checks admin httpOnly cookie. Used by admin routes only. |
| `rate-limit.middleware.ts` | IP-based rate limiting via Upstash cache. |

## apps/web/src/features/portfolio/components
| File | Responsibility |
|------|---------------|
| `Navbar.tsx` | Sticky navigation bar with smooth scroll + mobile hamburger. |
| `Footer.tsx` | Site footer with social links + availability text. |
| `Hero.tsx` | Full-viewport hero section with staggered Framer Motion animation. |
| `TechMarquee.tsx` | Infinite scrolling tech stack marquee. |
| `About.tsx` | About section with animated counters + stats. |
| `Skills.tsx` | Skill grid with category filter tabs + proficiency bars. |
| `Projects.tsx` | Project grid with tag filter. |
| `ProjectCard.tsx` | Individual project card with hover + modal trigger. |
| `ProjectModal.tsx` | Full-screen project detail overlay with markdown render. |
| `Experience.tsx` | Vertical timeline experience section. |
| `Education.tsx` | Education cards section. |
| `Certifications.tsx` | Certification grid section. |

## apps/web/src/features/chatbot
| File | Responsibility |
|------|---------------|
| `screens/ChatbotWidget.tsx` | Floating chatbot button + chat window container. |
| `components/ChatWindow.tsx` | Chat messages list + input + typing indicator. |

## apps/web/src/features/contact
| File | Responsibility |
|------|---------------|
| `components/ContactForm.tsx` | Contact form with react-hook-form + Zod validation. |

## apps/web/src/features/admin
| File | Responsibility |
|------|---------------|
| `screens/AdminLayout.tsx` | Sidebar + content area layout for all admin pages. |
| `screens/DashboardScreen.tsx` | Admin dashboard with stats overview. |
| `screens/ResumeImportScreen.tsx` | Upload + parse + preview + import resume flow. |
