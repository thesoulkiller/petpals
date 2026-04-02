import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'
import { bodyFont, headingFont } from './fonts'
import { animationsApp } from './animationsApp'

// Bubblegum palette — PetPals brand colors
export const bubblegumColors = {
  primary: '#FF6B9D',       // hot pink
  primaryLight: '#FFB3C6',  // light pink
  primaryDark: '#E0457A',   // deep pink
  secondary: '#FF8C61',     // coral accent
  background: '#FFF0F5',    // lavender blush
  backgroundCard: '#FFFFFF',
  backgroundMuted: '#FDE8F0',
  success: '#5DDBA6',       // mint match
  error: '#FF5252',         // dislike red
  warning: '#FFD166',       // gold superlike
  text: '#2D1B33',          // dark plum
  textMuted: '#9B7FA6',     // muted plum
  textLight: '#C5A8D0',     // light plum
  border: '#F0D6E8',        // soft pink border
  overlay: 'rgba(255,107,157,0.15)',
} as const

export const config = createTamagui({
  ...defaultConfig,
  animations: animationsApp,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      background: bubblegumColors.background,
    },
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
