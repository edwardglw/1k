# 1RUN.UK SEO Strategy

Status: proposed  
Last updated: 2026-05-01  
Audience: internal handoff / LLM review  
Implementation status: strategy only; no SEO changes in this document are assumed to be live

## 1. Executive Summary

1RUN.UK should not try to win broad "running app" search immediately. The better play is to own a narrower category: gentle beginner running for people starting from zero, especially users who feel that Couch to 5K is too aggressive. The public site should be treated as a proper marketing surface, while the logged-in product should live on a clearly separate app surface. SEO should start with technical basics and a small set of strong landing pages, then expand based on real Search Console data.

## 2. Confirmed Facts

These are the working facts this strategy is based on.

### Product and audience

- 1RUN.UK is a mobile-first React PWA for beginner runners.
- The core programme is a 6-week walk-to-run plan.
- The current product goal is helping users run a first 1K.
- The brand position is warm, gentle, beginner-first, and injury-aware.
- The product also includes weekly eating habits, so the public content surface touches fitness, nutrition, and weight-adjacent topics.

### Current public surface

- The current repo has a public landing page with strong beginner-oriented copy.
- The main app is a React SPA.
- Public, auth, onboarding, and app routes currently live in the same crawl surface.
- Metadata is currently thin.
- There is no clear SEO plumbing yet for canonicals, robots, sitemap, or structured data.
- The landing experience includes a large hero video that may hurt performance.

### Existing repo direction

- There is already a note in the repo suggesting a clean split:
  - `landing.html` at `/`
  - the React app moved to a sub-path such as `/app`
- This existing direction aligns with the SEO recommendation in this document.

## 3. Strategic Recommendation

### Core strategy

1RUN.UK should win organic traffic by owning the "gentle first steps into running" niche, not by competing head-on for generic running app terms.

### Positioning statement for SEO

Recommended SEO position:

- a gentle beginner running app
- designed for complete beginners
- a walk-to-run programme
- a safer, friendlier alternative to standard Couch to 5K plans
- focused on helping users run a first 1K

### What not to lead with

Do not make `couch to 1k` the primary keyword theme.

Reason:

- the term is ambiguous
- current search results are noisy
- non-running and swim-related interpretations are common
- it is weaker as a top-level category than broader beginner-intent terms

## 4. Recommended Site Architecture

### Preferred production setup

- `https://1run.uk/` = indexable marketing site
- `https://1run.uk/app/` = product surface
- `https://1k-beta.vercel.app/` = staging / preview only, ideally `noindex`

This does not require leaving Vercel. It is a URL-role decision, not a hosting-provider change.

### Why this structure is preferred

- it keeps search engines focused on pages that should rank
- it stops sign-in and logged-in product routes from becoming the visible search surface
- it simplifies canonicalization, metadata, and structured data
- it makes content and landing pages easier to manage

### Crawl/index recommendation

Index:

- `/`
- public landing pages
- comparison pages
- FAQ pages
- helpful public content pages that match search intent

Do not index:

- `/signin`
- `/signup`
- `/onboarding`
- `/dashboard`
- `/week/*`
- `/profile`
- staging / preview domains

## 5. Keyword Model

The keyword model should be layered by intent, not treated as one flat list.

### Tier 1: broad beginner intent

These are the top-of-funnel targets that match how people naturally search before they know the brand.

- `start running`
- `how to start running`
- `begin running`
- `running for beginners`
- `beginner running plan`
- `running for complete beginners`

### Tier 2: problem-aware beginner intent

These are stronger intent terms for users who know they need a gentler on-ramp.

- `start running when unfit`
- `start running after years of inactivity`
- `beginner running plan for overweight beginners`
- `beginner running plan over 50`
- `how to start running slowly`

### Tier 3: category differentiation

These are the terms that separate 1RUN.UK from standard beginner running products.

- `gentle running app`
- `walk to run programme`
- `couch to 5k alternative`
- `beginner running app for true beginners`
- `injury-aware beginner running plan`

### Tier 4: product-specific angle

These terms are narrower but useful for conversion and brand memory.

- `run your first 1K`
- `first kilometre running plan`
- `first 1K training plan`

### Tier 5: branded terms

- `1RUN.UK`
- `1RUN UK`
- `1run app`

### Keyword strategy summary

Broad beginner terms should bring users in. The "gentle / first 1K / alternative to Couch to 5K" angle should differentiate the product once they arrive.

## 6. Technical SEO Priorities

These are the first implementation priorities.

### Priority 1: separate marketing from app

Use the public landing page or a pre-rendered public site at `/`, then place the logged-in product under `/app`.

### Priority 2: ship metadata basics

Every indexable page should have:

- a unique `<title>`
- a meta description
- a canonical URL
- Open Graph title, description, image, and URL
- Twitter card metadata
- a consistent favicon and site name

Suggested homepage title:

- `1RUN.UK | Gentle Beginner Running App to Run Your First 1K`

Suggested homepage description:

- `A gentle 6-week walk-to-run programme for complete beginners. Build confidence, improve eating habits, and run your first 1K without the pressure of a typical Couch to 5K plan.`

### Priority 3: add crawl/index files

- `public/robots.txt`
- `public/sitemap.xml`

Launch note:

- keep the initial sitemap small
- only include URLs that are intended to rank

### Priority 4: add structured data

Immediate:

- `Organization` on the homepage

Later, only if the page qualifies:

- `SoftwareApplication` or `WebApplication`
- `BreadcrumbList` on hierarchical content pages

### Priority 5: improve landing-page performance

The biggest likely performance problem is the hero video.

Recommended actions:

- compress the video aggressively
- consider a static poster image for mobile
- add a proper fallback
- lazy-load non-critical media where possible
- ensure the H1 and primary CTA render immediately

## 7. Content Strategy

SEO should not rely on the homepage alone. The public site needs a small, high-quality cluster of pages around beginner running intent.

### Core content themes

- starting from zero
- walk-to-run progression
- confidence-building
- injury-aware progression
- habit-building
- beginner nutrition without diet-culture framing

### First public landing pages

Recommended first wave:

1. `/start-running`
2. `/running-for-beginners`
3. `/couch-to-5k-alternative`
4. `/how-it-works`
5. `/run-your-first-1k`
6. `/beginner-running-faq`

### Supporting article ideas

1. `How to start running when you are completely out of shape`
2. `A gentle walk-to-run plan for complete beginners`
3. `Why Couch to 5K feels too hard for some beginners`
4. `How to run your first 1K without worrying about pace`
5. `What to eat before and after a beginner run`
6. `How to start running if you are over 50`
7. `How to start running if you are carrying extra weight`
8. `Beginner running mistakes that make people quit too early`

## 8. Content Quality Rules

Because the site touches fitness, nutrition, and weight-adjacent topics, trust matters.

Every public SEO page should:

- be written for humans first
- clearly match real search intent
- show who wrote or reviewed it, where appropriate
- avoid exaggerated medical or weight-loss claims
- cite reputable sources where health-related advice is given
- clearly separate general education from medical advice
- use the product voice: warm, calm, safe, non-judgmental

Avoid:

- thin SEO pages
- AI filler
- mass-produced content
- topic sprawl outside the beginner-running niche

## 9. Conversion Strategy

Every indexable page should lead clearly to one next step.

Primary CTA directions:

- `Start for free`
- `Create your plan`
- `See the 6-week programme`

Suggested page structure for high-intent landing pages:

- answer the search intent near the top
- explain why 1RUN.UK is different
- show proof or reassurance
- present the CTA
- cover FAQs
- close with a final CTA

## 10. Measurement

### Setup

- Google Search Console
- Google Analytics 4
- sitemap submission
- URL inspection after major launches

### Primary metrics

- impressions
- clicks
- CTR
- average position
- non-branded landing-page traffic
- sign-up conversion rate from organic sessions

### What matters most

Do not optimize for traffic alone. Optimize for:

- queries that lead to sign-ups
- landing pages that convert
- clear evidence that the positioning is resonating

## 11. 30-Day Execution Plan

### Week 1

- confirm canonical production domain
- separate marketing surface and app surface
- add titles, descriptions, canonicals, OG, and Twitter tags
- add `robots.txt` and `sitemap.xml`
- noindex staging and non-public app routes

### Week 2

- improve the homepage metadata and public positioning
- publish `/start-running`
- publish `/running-for-beginners`
- publish `/couch-to-5k-alternative`
- add `Organization` structured data

### Week 3

- publish 2 to 3 supporting beginner articles
- improve landing-page performance, especially media weight
- submit the sitemap and request indexing for priority URLs

### Week 4

- review Search Console query data
- improve titles and descriptions where CTR is weak
- expand pages that show impressions but underperform
- choose the next 3 content pages from real data

## 12. 90-Day Target State

By 90 days, the site should ideally have:

- a clean indexable public surface
- a protected noindex app surface
- 6 to 10 useful public SEO pages
- a clear SERP position around gentle beginner running
- early branded demand for 1RUN.UK
- enough query data to refine titles, pages, and content direction

## 13. Assumptions

This strategy assumes:

- the product will continue to center on a first-1K journey in the near term
- the public marketing site and product can be separated cleanly
- the team wants SEO to support sign-ups, not just awareness
- content production capacity is limited, so quality matters more than volume

## 14. Open Questions

These should be resolved before major implementation.

- Is `/app` the preferred product URL, or is a subdomain such as `app.1run.uk` better?
- Will `1k-beta.vercel.app` remain the staging URL long-term?
- Is the homepage meant to rank primarily for "start running" intent, or should a dedicated `/start-running` page carry that weight?
- Who will author or review health-adjacent public content?
- How much editorial capacity is available per month?

## 15. Questions For The Reviewing LLM

Please review this strategy against the following:

1. Is the keyword layering sound, especially the balance between broad beginner intent and the narrower first-1K positioning?
2. Is the proposed site architecture the simplest strong SEO setup for the current product shape?
3. Are there any missing technical SEO priorities for a Vite/React public surface?
4. Are the first landing pages the right ones, or should the first wave be smaller?
5. Is the positioning against Couch to 5K strong enough without overcommitting to comparison-page SEO?
6. Are there any risks in mixing beginner running, nutrition habits, and weight-adjacent messaging on the same public SEO surface?

## 16. Short Version

The core move is:

1. separate the marketing site from the app
2. target broad beginner intent such as `start running` and `running for beginners`
3. differentiate with a gentler, first-1K, Couch-to-5K-alternative position
4. ship technical basics first
5. publish a small set of trustworthy public pages
6. optimize for organic sign-ups, not traffic alone
