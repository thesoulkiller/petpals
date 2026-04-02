// Expo-compatible theme toggle (no Next.js dependency)
import { useState } from 'react'
import { Button } from 'tamagui'

export const SwitchThemeButton = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  return (
    <Button onPress={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}>
      Change theme: {theme}
    </Button>
  )
}
