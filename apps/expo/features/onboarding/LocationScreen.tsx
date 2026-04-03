'use client'

import React, { useState } from 'react'
import { StyleSheet, Alert, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { MapPin } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import { OnboardingProgress } from './OnboardingProgress'
import type { UserState } from '../../types/petpals'

const LOCATION_FEATURES = [
  '🏃 Distance-based matching',
  '🔒 Location stays private',
  '📱 Only used while app is active',
]

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
          'PetPals uses your location to find nearby matches. You can enable it later in settings.',
          [{ text: 'Skip for now', onPress: handleSkip }],
        )
        setLoading(false)
        return
      }
      const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      finishOnboarding({ lat: coords.coords.latitude, lng: coords.coords.longitude })
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
    const completedUser: UserState = { ...user, location, onboardingComplete: true }
    completeOnboarding(completedUser)
    router.replace('/(tabs)/discover')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <OnboardingProgress step={4} total={4} />

        <View style={styles.body}>
          {/* Location icon */}
          <View style={styles.iconRing}>
            <MapPin color={DS.primary} size={48} />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Find pets near you 📍</Text>
            <Text style={styles.subtitle}>
              Allow location access so we can show you matches nearby.{'\n'}We never share your exact location.
            </Text>
          </View>

          {/* Feature bullets */}
          <View style={styles.features}>
            {LOCATION_FEATURES.map((text) => (
              <View key={text} style={styles.featureRow}>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.ctaBtn, loading && styles.ctaBtnDisabled]}
            onPress={handleRequestLocation}
            disabled={loading}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>
              {loading ? 'Getting location…' : 'Enable Location 📍'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.surface },
  container: { flex: 1, backgroundColor: DS.surface },
  body: {
    flex: 1,
    paddingHorizontal: DS.space.xl,
    paddingTop: DS.space.xxxl,
    gap: DS.space.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    width: 120,
    height: 120,
    borderRadius: DS.radius.avatar,
    backgroundColor: 'rgba(255,107,157,0.10)',
    borderWidth: 1.5,
    borderColor: DS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: { gap: DS.space.sm, alignItems: 'center' },
  title: {
    ...DS.textHero,
    fontFamily: DS.font.display,
    color: DS.text,
    textAlign: 'center',
  },
  subtitle: {
    ...DS.textBody,
    color: DS.muted,
    lineHeight: 24,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    gap: DS.space.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.sm,
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.md,
  },
  featureText: {
    ...DS.textBody,
    color: DS.text,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: DS.space.xl,
    paddingBottom: DS.space.xxl,
    gap: DS.space.sm,
  },
  ctaBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: DS.cardBorder,
  },
  ctaText: {
    ...DS.textSection,
    fontFamily: DS.font.display,
    color: DS.white,
    fontSize: 17,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: DS.space.md,
  },
  skipText: {
    ...DS.textBody,
    color: DS.muted,
    fontWeight: '600',
  },
})
