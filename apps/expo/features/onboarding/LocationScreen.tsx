'use client'

import React, { useState } from 'react'
import { StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, YStack } from 'tamagui'
import { MapPin } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'
import { OnboardingProgress } from './OnboardingProgress'
import type { UserState } from '../../types/petpals'

export function LocationScreen() {
  const router = useRouter()
  const { user, completeOnboarding } = useAppContext()
  const [loading, setLoading] = useState(false)

  async function handleRequestLocation() {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Location needed',
          'PetPals uses your location to show nearby matches. You can enable it later in settings.',
          [{ text: 'Skip for now', onPress: handleSkip }],
        )
        setLoading(false)
        return
      }

      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })

      finishOnboarding({
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
      })
    } catch {
      Alert.alert('Could not get location', 'Please try again or skip.', [
        { text: 'Skip', onPress: handleSkip },
        { text: 'Try again', onPress: handleRequestLocation },
      ])
      setLoading(false)
    }
  }

  function handleSkip() {
    finishOnboarding(null)
  }

  function finishOnboarding(location: { lat: number; lng: number } | null) {
    const completedUser: UserState = {
      ...user,
      location,
      onboardingComplete: true,
    }
    completeOnboarding(completedUser)
    router.replace('/(tabs)/discover')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background}>
        <OnboardingProgress step={4} total={4} />

        <YStack flex={1} paddingHorizontal={24} paddingTop={40} gap="$5" alignItems="center" justifyContent="center">
          <YStack
            width={120}
            height={120}
            borderRadius={60}
            backgroundColor={bubblegumColors.backgroundMuted}
            alignItems="center"
            justifyContent="center"
          >
            <MapPin color={bubblegumColors.primary} size={48} />
          </YStack>

          <YStack gap="$2" alignItems="center">
            <Text fontSize={28} fontWeight="900" color={bubblegumColors.text} textAlign="center">
              Find pets near you 📍
            </Text>
            <Text fontSize={15} color={bubblegumColors.textMuted} lineHeight={24} textAlign="center">
              Allow location access so we can show you pets within a few kilometers. We never share your exact location.
            </Text>
          </YStack>

          {[
            '🏃 Distance-based matching',
            '🔒 Location stays private',
            '📱 Only used while active',
          ].map((text) => (
            <YStack
              key={text}
              flexDirection="row"
              alignItems="center"
              gap="$2"
              width="100%"
              backgroundColor={bubblegumColors.backgroundCard}
              borderRadius={12}
              padding="$3"
            >
              <Text fontSize={15}>{text}</Text>
            </YStack>
          ))}
        </YStack>

        <YStack paddingHorizontal={24} paddingBottom={32} gap="$3">
          <Button
            onPress={handleRequestLocation}
            disabled={loading}
            backgroundColor={loading ? bubblegumColors.border : bubblegumColors.primary}
            borderRadius={30}
            height={56}
            pressStyle={{ opacity: 0.88, scale: 0.98 }}
          >
            <Text color="white" fontWeight="800" fontSize={17}>
              {loading ? 'Getting location…' : 'Enable Location 📍'}
            </Text>
          </Button>
          <Button
            onPress={handleSkip}
            backgroundColor="transparent"
            borderRadius={30}
            height={48}
          >
            <Text color={bubblegumColors.textMuted} fontWeight="600" fontSize={15}>
              Skip for now
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
})
