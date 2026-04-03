/**
 * PetPals Design System — Direction C: Bold Gradient
 *
 * Fonts: Add Clash Grotesk (.otf) and DM Sans (.ttf) to assets/fonts/
 * then load with expo-font in _layout.tsx. Until then, falls back to
 * system font. All other tokens are production-ready.
 *
 * See DESIGN.md for rationale and decisions log.
 */

export const DS = {
  // ─── Colors ──────────────────────────────────────────────────────────────
  gradient: ['#FF6B9D', '#FF8C61'] as [string, string],
  gradientAngle: 160, // degrees
  onGradient: '#FFFFFF',

  // CTA on gradient: white button, pink text
  ctaBg: '#FFFFFF',
  ctaText: '#FF6B9D',

  // Glass morphism (for cards on gradient backgrounds)
  glassBg: 'rgba(255,255,255,0.20)',
  glassBorder: 'rgba(255,255,255,0.35)',

  // Surfaces
  surface: '#FFF0F5',      // off-gradient tab screens, settings, etc.
  cardBg: '#FFFFFF',       // white card on light background
  cardBorder: '#F0D6E8',   // pink-tinted card border

  // Actions
  primary: '#FF6B9D',      // pink — main CTA on light bg
  superlike: '#FFD166',    // gold
  match: '#5DDBA6',        // mint green
  error: '#FF5252',        // red

  // Text
  text: '#2D1B33',         // dark plum
  muted: '#9B7FA6',        // muted purple
  white: '#FFFFFF',

  // ─── Typography ──────────────────────────────────────────────────────────
  // Replace 'System' with 'ClashGrotesk-Bold' / 'DMSans-Regular' once fonts
  // are added to assets/fonts/ and loaded in _layout.tsx.
  font: {
    display: 'System',   // → ClashGrotesk-Bold
    body: 'System',      // → DMSans-Regular
    medium: 'System',    // → DMSans-Medium
  },

  // Scale
  textHero:    { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  textTitle:   { fontSize: 24, fontWeight: '700' as const },
  textSection: { fontSize: 18, fontWeight: '700' as const },
  textBody:    { fontSize: 15, fontWeight: '400' as const },
  textCaption: { fontSize: 13, fontWeight: '500' as const },
  textMicro:   { fontSize: 11, fontWeight: '600' as const },

  // ─── Spacing (8px base) ──────────────────────────────────────────────────
  space: {
    xs: 4, sm: 8, md: 12, base: 16, lg: 20, xl: 24,
    xxl: 32, xxxl: 40, huge: 48, max: 64,
  },

  // ─── Radii ───────────────────────────────────────────────────────────────
  radius: {
    sm: 10, md: 16, lg: 20, card: 20, pill: 999, avatar: 999,
  },

  // ─── Shadows ─────────────────────────────────────────────────────────────
  shadow: {
    card: {
      shadowColor: '#2D1B33',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 12,
      elevation: 6,
    },
    elevated: {
      shadowColor: '#FF6B9D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 12,
    },
  },
}
