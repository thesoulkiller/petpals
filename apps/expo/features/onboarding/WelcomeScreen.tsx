'use client'

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity } from 'react-native'
import { DS } from '../../theme'

const FEATURES = [
  { emoji: '🐾', text: 'Meet people through your pet' },
  { emoji: '💕', text: 'Date, befriend, or just walk together' },
  { emoji: '📍', text: 'Matches near you, right now' },
]

export function WelcomeScreen() {
  const router = useRouter()

  return (
    <LinearGradient
      colors={DS.gradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        {/* Watermark paw — large rotated, low opacity */}
        <Text style={styles.watermark}>🐾</Text>

        <View style={styles.inner}>
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>PetPals</Text>
            <Text style={styles.heroSub}>
              Your pet is the icebreaker.{'\n'}You're here to connect.
            </Text>
          </View>

          {/* Glass feature cards */}
          <View style={styles.features}>
            {FEATURES.map(({ emoji, text }) => (
              <View key={text} style={styles.glassCard}>
                <Text style={styles.featureEmoji}>{emoji}</Text>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA pinned to bottom */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/onboarding/owner')}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>Find My Match 🐾</Text>
          </TouchableOpacity>
          <Text style={styles.ctaSub}>Free to join · No credit card needed</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  watermark: {
    position: 'absolute',
    fontSize: 280,
    top: -20,
    right: -60,
    opacity: 0.07,
    transform: [{ rotate: '15deg' }],
    zIndex: 0,
  },
  inner: {
    flex: 1,
    paddingHorizontal: DS.space.xl,
    justifyContent: 'center',
    gap: DS.space.xxl,
    zIndex: 1,
  },
  heroSection: {
    gap: DS.space.md,
  },
  heroTitle: {
    ...DS.text_hero,
    fontSize: 52,
    fontFamily: DS.font.display,
    color: DS.onGradient,
    letterSpacing: -1,
  },
  heroSub: {
    ...DS.text_body,
    fontSize: 17,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 26,
  },
  features: {
    gap: DS.space.md,
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.base,
    backgroundColor: DS.glassBg,
    borderRadius: DS.radius.card,
    borderWidth: 1,
    borderColor: DS.glassBorder,
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.md,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    ...DS.text_body,
    fontFamily: DS.font.body,
    color: DS.onGradient,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  ctaSection: {
    paddingHorizontal: DS.space.xl,
    paddingBottom: DS.space.xxl,
    gap: DS.space.sm,
    zIndex: 1,
  },
  ctaButton: {
    backgroundColor: DS.ctaBg,
    borderRadius: DS.radius.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    ...DS.text_section,
    fontFamily: DS.font.display,
    color: DS.ctaText,
    fontSize: 18,
  },
  ctaSub: {
    ...DS.text_micro,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
})
