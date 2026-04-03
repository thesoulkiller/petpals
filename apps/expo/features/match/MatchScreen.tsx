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
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'

const AnimatedView = Animated.View as React.ComponentType<React.ComponentProps<typeof View>>

const { width: W, height: H } = Dimensions.get('window')
const PAWS = ['🐾', '🐾', '💕', '🐾', '⭐', '🐾', '💕', '🐾', '🐾', '💕']

function FloatingPaw({
  emoji,
  delay,
  startX }: {
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
          Animated.timing(translateY, {
            toValue: -100,
            duration: 3000,
            useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 600, delay: 2000, useNativeDriver: true }),
          ]),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true }),
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

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'] })

  return (
    <AnimatedView
      style={[
        styles.floatingPaw,
        {
          left: startX,
          transform: [{ translateY }, { rotate: spin }],
          opacity },
      ]}
    >
      <Text style={styles.pawEmoji}>{emoji}</Text>
    </AnimatedView>
  )
}

export function MatchScreen() {
  const router = useRouter()
  const { pendingMatch, clearMatch, user } = useAppContext()

  // Scale-in animation
  const scale = useRef(new Animated.Value(0.5)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true }),
    ]).start()
  }, [])

  function handleKeepSwiping() {
    clearMatch()
    router.back()
  }

  function handleSendWoof() {
    clearMatch()
    router.back()
    // Stub — real implementation would open a chat screen
  }

  const targetProfile = pendingMatch?.targetProfile
  const userPetPhoto = user.pet?.photos[0]
  const targetPetPhoto = targetProfile?.pet.photos[0]

  return (
    <SafeAreaView style={styles.safe}>
      {/* Floating paws background */}
      {PAWS.map((emoji, i) => (
        <FloatingPaw
          key={i}
          emoji={emoji}
          delay={i * 300}
          startX={(W / PAWS.length) * i + 10}
        />
      ))}

      <AnimatedView style={[styles.content, { transform: [{ scale }], opacity }]}>
        {/* Match heading */}
        <YStack alignItems="center" gap="$2">
          <Text style={styles.matchEmoji}>💕</Text>
          <Text style={styles.matchTitle}>It's a Match!</Text>
          <Text style={styles.matchSubtitle}>
            {user.pet?.name ?? 'Your pet'} and {targetProfile?.pet.name ?? 'them'} both liked each other!
          </Text>
        </YStack>

        {/* Photos */}
        <XStack alignItems="center" justifyContent="center" gap="$4" marginVertical={24}>
          {/* User pet */}
          <YStack style={styles.photoFrame}>
            {userPetPhoto ? (
              <Image
                source={{ uri: userPetPhoto }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <YStack style={[styles.photo, styles.photoPlaceholder]}>
                <Text fontSize={36}>🐾</Text>
              </YStack>
            )}
          </YStack>

          <Text style={styles.heartBetween}>❤️</Text>

          {/* Match pet */}
          <YStack style={styles.photoFrame}>
            {targetPetPhoto ? (
              <Image
                source={{ uri: targetPetPhoto }}
                style={styles.photo}
                resizeMode="cover"
              />
            ) : (
              <YStack style={[styles.photo, styles.photoPlaceholder]}>
                <Text fontSize={36}>🐾</Text>
              </YStack>
            )}
          </YStack>
        </XStack>

        {/* Names */}
        <XStack justifyContent="center" gap="$6" marginBottom={32}>
          <Text style={styles.petNameLabel}>{user.pet?.name ?? 'Your pet'}</Text>
          <Text style={styles.petNameLabel}>{targetProfile?.pet.name ?? '...'}</Text>
        </XStack>

        {/* CTA buttons */}
        <YStack gap="$3" paddingHorizontal={24} width="100%">
          <Button
            onPress={handleSendWoof}
            backgroundColor={bubblegumColors.primary}
            borderRadius={30}
            height={56}
            pressStyle={{ opacity: 0.88, scale: 0.97 }}
          >
            <Text color="white" fontWeight="800" fontSize={17}>
              Send a Woof 🐾
            </Text>
          </Button>
          <TouchableOpacity onPress={handleKeepSwiping} style={styles.skipButton}>
            <Text style={styles.skipText}>Keep Swiping</Text>
          </TouchableOpacity>
        </YStack>
      </AnimatedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'rgba(255, 107, 157, 0.92)',
    alignItems: 'center',
    justifyContent: 'center' },
  floatingPaw: {
    position: 'absolute' },
  pawEmoji: {
    fontSize: 24 },
  content: {
    width: W - 48,
    backgroundColor: 'white',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: bubblegumColors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16 },
  matchEmoji: {
    fontSize: 48 },
  matchTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: bubblegumColors.primary,
    letterSpacing: -0.5 },
  matchSubtitle: {
    fontSize: 15,
    color: bubblegumColors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8 },
  photoFrame: {
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: bubblegumColors.primaryLight,
    shadowColor: bubblegumColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6 },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55 },
  photoPlaceholder: {
    backgroundColor: bubblegumColors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center' },
  heartBetween: {
    fontSize: 28 },
  petNameLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: bubblegumColors.text },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12 },
  skipText: {
    fontSize: 15,
    color: bubblegumColors.textMuted,
    fontWeight: '600' } })
