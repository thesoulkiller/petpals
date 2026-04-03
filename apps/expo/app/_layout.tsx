import { useEffect } from 'react'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from 'app/provider'
import { AppProvider } from 'app/context/AppContext'
import petsData from '../data/pets.json'
import type { PetProfile } from 'app/types/petpals'

SplashScreen.preventAutoHideAsync()

const initialProfiles = petsData as PetProfile[]

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    'ClashGrotesk-Bold': require('../assets/fonts/ClashGrotesk-Bold.ttf'),
    'DMSans-Regular': require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../assets/fonts/DMSans-Medium.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsError])

  if (!fontsLoaded && !fontsError) {
    return null
  }

  return (
    <Provider>
      <AppProvider initialProfiles={initialProfiles}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="match"
            options={{ presentation: 'transparentModal', animation: 'fade' }}
          />
          <Stack.Screen name="paywall" />
          <Stack.Screen name="chat" />
          <Stack.Screen
            name="discover"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </AppProvider>
    </Provider>
  )
}
