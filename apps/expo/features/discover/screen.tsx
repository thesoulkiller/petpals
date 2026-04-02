'use client'

import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'
import { Heart, Star, X } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'
import { SwipeDeck } from './SwipeDeck'
import type { SwipeDirection } from '../../types/petpals'

export function DiscoverScreen() {
  const router = useRouter()
  const { remainingProfiles, swipe, user, pendingMatch, clearMatch } = useAppContext()

  // Navigate to match modal when a match occurs
  useEffect(() => {
    if (pendingMatch) {
      router.push('/match')
    }
  }, [pendingMatch])

  function handleSwipe(profileId: string, direction: SwipeDirection) {
    swipe(profileId, direction)
  }

  function handleDislike() {
    if (remainingProfiles[0]) {
      swipe(remainingProfiles[0].id, 'left')
    }
  }

  function handleLike() {
    if (remainingProfiles[0]) {
      swipe(remainingProfiles[0].id, 'right')
    }
  }

  function handleSuperlike() {
    if (remainingProfiles[0]) {
      if (user.superlikes <= 0) {
        router.push('/paywall/superlikes')
        return
      }
      swipe(remainingProfiles[0].id, 'up')
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background}>
        {/* Header */}
        <XStack
          paddingHorizontal="$4"
          paddingTop="$3"
          paddingBottom="$2"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={26} fontWeight="900" color={bubblegumColors.primary}>
            🐾 PetPals
          </Text>

          <XStack alignItems="center" gap="$2">
            <YStack
              backgroundColor={user.superlikes > 0 ? bubblegumColors.warning : bubblegumColors.border}
              borderRadius={20}
              paddingHorizontal="$3"
              paddingVertical="$1"
              flexDirection="row"
              alignItems="center"
              gap="$1"
            >
              <Text fontSize={14}>⭐</Text>
              <Text
                fontSize={13}
                fontWeight="700"
                color={user.superlikes > 0 ? bubblegumColors.text : bubblegumColors.textMuted}
              >
                {user.superlikes}
              </Text>
            </YStack>
          </XStack>
        </XStack>

        {/* Premium nudge banner */}
        {!user.isPremium && remainingProfiles.length < 5 && remainingProfiles.length > 0 && (
          <Button
            onPress={() => router.push('/paywall/subscription')}
            backgroundColor={bubblegumColors.primaryLight}
            borderRadius={0}
            height={40}
            pressStyle={{ opacity: 0.9 }}
          >
            <Text fontSize={13} color={bubblegumColors.primaryDark} fontWeight="700">
              💎 Go Premium — unlimited swipes & more
            </Text>
          </Button>
        )}

        {/* Swipe deck */}
        <YStack flex={1} paddingHorizontal={16} paddingTop={8}>
          <SwipeDeck
            profiles={remainingProfiles}
            onSwipe={handleSwipe}
            onRefresh={() => {/* stub: profiles are static */}}
          />
        </YStack>

        {/* Action buttons */}
        {remainingProfiles.length > 0 && (
          <XStack
            paddingHorizontal="$8"
            paddingBottom="$4"
            paddingTop="$2"
            justifyContent="center"
            alignItems="center"
            gap="$5"
          >
            {/* Dislike */}
            <Button
              onPress={handleDislike}
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor={bubblegumColors.backgroundCard}
              borderWidth={2}
              borderColor={bubblegumColors.error}
              pressStyle={{ scale: 0.93, backgroundColor: '#FFE8E8' }}
              padding={0}
              icon={<X color={bubblegumColors.error} size={26} />}
            />

            {/* Superlike */}
            <Button
              onPress={handleSuperlike}
              width={52}
              height={52}
              borderRadius={26}
              backgroundColor={user.superlikes > 0 ? bubblegumColors.warning : bubblegumColors.border}
              pressStyle={{ scale: 0.93 }}
              padding={0}
              icon={<Star color="white" size={22} />}
            />

            {/* Like */}
            <Button
              onPress={handleLike}
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor={bubblegumColors.primary}
              pressStyle={{ scale: 0.93, opacity: 0.85 }}
              padding={0}
              icon={<Heart color="white" size={26} />}
            />
          </XStack>
        )}
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
})
