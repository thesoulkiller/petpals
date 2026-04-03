# Design System — PetPals

## Product Context
- **What this is:** A human-first social + dating app where pets are the icebreaker and trust signal
- **Who it's for:** People who want to meet, date, find walking buddies, and build friendships — their pet is their wingman
- **Space/industry:** Social dating, pet social, human connection
- **Project type:** Native mobile app (Expo / React Native)

## Aesthetic Direction
- **Direction:** Bold Gradient / Maximalist Confidence
- **Decoration level:** Expressive — gradient backgrounds, glass morphism cards, large paw watermark
- **Mood:** Loud, warm, confident. High energy without being cold. Like a Saturday afternoon at the dog park — everyone's a little excited, a little playful, clearly here to connect.
- **Anti-patterns to avoid:** Generic white cards on flat pink, Inter font, small decorative circles, confetti-on-match dopamine bait

## Typography
- **Display/Hero:** Clash Grotesk Bold — strong, modern, tight letter-spacing. Confident, not corporate.
- **Body/UI:** DM Sans — clean, friendly, pairs well with Clash Grotesk without competing
- **Labels/Tags:** DM Sans Medium
- **Data/Counts:** DM Sans with tabular-nums
- **Loading:** Google Fonts CDN (Clash Grotesk via CDN or local .otf; DM Sans via Google Fonts)
- **Scale:**
  - hero: 32px / 700 / -0.5px tracking
  - title: 24px / 700
  - section: 18px / 700
  - body: 15px / 400
  - caption: 13px / 500
  - micro: 11px / 600

## Color
- **Approach:** Expressive — gradient as the dominant design element
- **Primary gradient:** `#FF6B9D → #FF8C61` (linear 160deg) — used for main backgrounds, hero screens
- **On-gradient text:** `#FFFFFF`
- **CTA button (on gradient):** White `#FFFFFF` with pink text `#FF6B9D`
- **Glass cards:** `rgba(255,255,255,0.20)` background, `rgba(255,255,255,0.35)` border, backdrop-filter blur 12px
- **Off-gradient surfaces:** `#FFF0F5` (lavender blush) — used for tab screens, settings, non-hero UI
- **Card on light bg:** `#FFFFFF` with `#F0D6E8` border
- **Primary action (on light bg):** `#FF6B9D`
- **Superlike/Premium:** `#FFD166` (gold)
- **Match/Success:** `#5DDBA6` (mint)
- **Dislike/Error:** `#FF5252`
- **Text (on light):** `#2D1B33` (dark plum)
- **Text muted:** `#9B7FA6`
- **Watermark paw:** Large 🐾 emoji at 6-8% opacity, rotated, as background texture on gradient screens
- **Dark mode:** TBD (not in MVP scope)

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable
- **Scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64

## Layout
- **Approach:** Hybrid — gradient/hero screens use creative-editorial, tab screens use grid-disciplined
- **Border radius:** small: 10px, medium: 16px, large: 20px, card: 20px, button: 20px (pill), avatar: 999px
- **Max content width:** full-bleed on mobile
- **Photo cards:** Full-bleed to screen edge, aspect-ratio 4:5, rounded top corners only on stack

## Motion
- **Approach:** Intentional — entrance animations, spring physics on cards, satisfying match reveal
- **Easing:** Spring (damping: 0.7, stiffness: 200) for card interactions; ease-out for entrances
- **Duration:** micro: 80ms, short: 200ms, medium: 350ms, match-celebrate: 600ms
- **Swipe cards:** PanResponder with spring snap-back, opacity fades on LIKE/NOPE overlays
- **Match reveal:** Scale-in (0.8→1.0) + fade, with animated paw confetti
- **Tab bar:** No animation — instant tab switch

## Key Screen Treatments

### Hero / Onboarding screens
- Full gradient background `#FF6B9D → #FF8C61`
- Large Clash Grotesk hero text in white
- Large 🐾 watermark (opacity 6-8%, rotated 15°) behind content
- Glass morphism feature cards
- White pill CTA button with pink text

### Discover (swipe) screen
- Light background `#FFF0F5`
- Full-bleed photo cards (no gradient on the card itself)
- LIKE overlay: `#5DDBA6` green with "LIKE" text
- NOPE overlay: `#FF5252` red with "NOPE" text
- SUPER overlay: `#FFD166` gold with ⭐ text
- Action buttons: circular, white with colored icons

### Match screen
- Gradient background (same as hero)
- Scale-in animation on match card
- Paw confetti particles floating up

### Likes / Profile tabs
- Light `#FFF0F5` background
- White cards with `#F0D6E8` borders
- Pink accents for CTAs

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Chose Bold Gradient direction | User selection from 3 design options (A/B/C) via /design-consultation |
| 2026-04-03 | Clash Grotesk + DM Sans typography | Replace default Inter; Clash Grotesk adds bold confidence, DM Sans stays readable |
| 2026-04-03 | Glass morphism on gradient screens | Modern, high-impact, appropriate for the Gen Z / social dating audience |
| 2026-04-03 | Watermark paw pattern | Brand-coded texture, replaces generic circle decorations |
| 2026-04-03 | White CTA on gradient | High contrast, bold inversion of the usual pattern |
| 2026-04-03 | Human-first framing | Product reframe: pets are the icebreaker, human connection is the product |
