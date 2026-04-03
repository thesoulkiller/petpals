'use client'

import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from 'tamagui'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'

const AnimatedView = Animated.View as React.ComponentType<React.ComponentProps<typeof View>>

const { width: W, height: H } = Dimensions.get('window')
const PAWS = ['🐾', '🐾', '💕', '🐾', '⭐', '🐾', '💕', '🐾', '🐾', '💕']

function FloatingPaw({
  emoji,
  delay,
  startX,
}: {
  emoji: string
  delay: number
  startX: number
  key?: React.Key
}) {
  const translateY = useRef(new Animated.Value(H + 50)).current
  const opacity = useRef(new Animated.Value(0)).current
  const rotate = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, { toValue: -100, duration: 3000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 600, delay: 2000, useNativeDriver: true }),
          ]),
          Animated.timing(rotate, { toValue: 1, duration: 3000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: H + 50, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(rotate, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    )
    anim.start()
    return () => anim.stop()
  }, [])

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })

  return (
    <AnimatedView
      style={[styles.floatingPaw, { left: startX, transform: [{ translateY }, { rotate: spin }], opacity }]}
    >
      <Text style={styles.pawEmoji}>{emoji}</Text>
    </AnimatedView>
  )
}

export function MatchScreen() {
  const router = useRouter()
  const { pendingMatch, clearMatch, user } = useAppContext()

  const scale = useRef(new Animated.Value(0.7)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start()
  }, [])

  function handleKeepSwiping() {
    clearMatch()
    router.back()
  }

  function handleSendWoof() {
    clearMatch()
    router.back()
    // Stub — real: open chat screen
  }

  const targetProfile = pendingMatch?.targetProfile
  const userPetPhoto = user.pet?.photos[0]
  const targetPetPhoto = targetProfile?.pet.photos[0]

  return (
    <LinearGradient
      colors={DS.gradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {/* Paw confetti */}
      {PAWS.map((emoji, i) => (
        <FloatingPaw
          key={i}
          emoji={emoji}
          delay={i * 300}
          startX={(W / PAWS.length) * i + 10}
        />
      ))}

      {/* Watermark paw */}
      <Text style={styles.watermark}>🐾</Text>

      {/* Match card — white on gradient */}
      <AnimatedView style={[styles.card, { transform: [{ scale }], opacity }]}>
        {/* Match label */}
        <View style={styles.matchHeader}>
          <Text style={styles.matchEmoji}>💕</Text>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSub}>
            {user.pet?.name ?? 'Your pet'} and {targetProfile?.pet.name ?? 'them'} both liked each other!
          </Text>
        </View>

        {/* Photos */}
        <View style={styles.photosRow}>
          <View style={styles.photoRing}>
            {userPetPhoto ? (
              <Image source={{ uri: userPetPhoto }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.photoEmpty}>
                <Text style={{ fontSize: 36 }}>🐾</Text>
              </View>
            )}
          </View>

          <Text style={styles.heartBetween}>❤️</Text>

          <View style={styles.photoRing}>
            {targetPetPhoto ? (
              <Image source={{ uri: targetPetPhoto }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.photoEmpty}>
                <Text style={{ fontSize: 36 }}>🐾</Text>
              </View>
            )}
          </View>
        </View>

        {/* Names */}
        <View style={styles.namesRow}>
          <Text style={styles.petLabel}>{user.pet?.name ?? 'Your pet'}</Text>
          <Text style={styles.petLabel}>{targetProfile?.pet.name ?? '...'}</Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaSection}>
          {/* White pill CTA — primary action */}
          <TouchableOpacity
            style={styles.woofButton}
            onPress={handleSendWoof}
            activeOpacity={0.88}
          >
            <Text style={styles.woofText}>Send a Woof 🐾</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleKeepSwiping} activeOpacity={0.7}>
            <Text style={styles.skipText}>Keep Swiping</Text>
          </TouchableOpacity>
        </View>
      </AnimatedView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    position: 'absolute',
    fontSize: 280,
    bottom: -40,
    left: -60,
    opacity: 0.06,
    transform: [{ rotate: '-15deg' }],
    zIndex: 0,
  },
  floatingPaw: {
    position: 'absolute',
    zIndex: 1,
  },
  pawEmoji: {
    fontSize: 24,
  },
  card: {
    width: W - 48,
    backgroundColor: DS.cardBg,
    borderRadius: 28,
    paddingVertical: DS.space.xxxl,
    paddingHorizontal: DS.space.xl,
    alignItems: 'center',
    ...DS.shadow.elevated,
    zIndex: 2,
  },
  matchHeader: {
    alignItems: 'center',
    gap: DS.space.sm,
    marginBottom: DS.space.xl,
  },
  matchEmoji: {
    fontSize: 48,
  },
  matchTitle: {
    ...DS.text_hero,
    fontFamily: DS.font.display,
    color: DS.primary,
    letterSpacing: -0.5,
  },
  matchSub: {
    ...DS.text_body,
    color: DS.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: DS.space.sm,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DS.space.lg,
    marginBottom: DS.space.base,
  },
  photoRing: {
    borderRadius: DS.radius.avatar,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: DS.cardBorder,
    ...DS.shadow.card,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: DS.radius.avatar,
  },
  photoEmpty: {
    width: 110,
    height: 110,
    borderRadius: DS.radius.avatar,
    backgroundColor: DS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBetween: {
    fontSize: 28,
  },
  namesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: DS.space.xxl,
    paddingHorizontal: DS.space.base,
  },
  petLabel: {
    ...DS.text_caption,
    fontWeight: '700',
    color: DS.text,
  },
  ctaSection: {
    width: '100%',
    gap: DS.space.sm,
  },
  woofButton: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  woofText: {
    ...DS.text_section,
    fontFamily: DS.font.display,
    color: DS.white,
    fontSize: 17,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: DS.space.md,
  },
  skipText: {
    ...DS.text_body,
    color: DS.muted,
    fontWeight: '600',
  },
})
