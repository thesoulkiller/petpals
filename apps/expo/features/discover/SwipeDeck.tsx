'use client'

import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Button, Text, YStack } from 'tamagui'
import { RefreshCw } from '@tamagui/lucide-icons'
import { bubblegumColors } from '@my/config'
import { SwipeCard } from './SwipeCard'
import type { PetProfile, SwipeDirection } from '../../types/petpals'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface SwipeDeckProps {
  profiles: PetProfile[]
  onSwipe: (profileId: string, direction: SwipeDirection) => void
  onRefresh?: () => void
}

export function SwipeDeck({ profiles, onSwipe, onRefresh }: SwipeDeckProps) {
  if (profiles.length === 0) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        gap="$4"
        paddingHorizontal="$6"
      >
        <Text fontSize={48}>🐾</Text>
        <Text
          fontSize={22}
          fontWeight="800"
          color={bubblegumColors.text}
          textAlign="center"
        >
          No more pets nearby!
        </Text>
        <Text
          fontSize={15}
          color={bubblegumColors.textMuted}
          textAlign="center"
          lineHeight={22}
        >
          You've seen all available pals. Check back soon — new pets join every day!
        </Text>
        {onRefresh && (
          <Button
            onPress={onRefresh}
            backgroundColor={bubblegumColors.primary}
            borderRadius={30}
            paddingHorizontal="$6"
            paddingVertical="$3"
            pressStyle={{ opacity: 0.85, scale: 0.97 }}
            icon={<RefreshCw color="white" size={16} />}
          >
            <Text color="white" fontWeight="700" fontSize={15}>
              Refresh
            </Text>
          </Button>
        )}
      </YStack>
    )
  }

  // Render up to 3 cards; top card is last in array (rendered on top in absolute layout)
  const visibleProfiles = profiles.slice(0, 3)

  return (
    <View style={styles.deckContainer}>
      {visibleProfiles
        .slice()
        .reverse()
        .map((profile, reversedIndex) => {
          const stackIndex = visibleProfiles.length - 1 - reversedIndex
          const isTop = stackIndex === 0

          return (
            <SwipeCard
              key={profile.id}
              profile={profile}
              isTop={isTop}
              stackIndex={stackIndex}
              onSwipe={(direction) => onSwipe(profile.id, direction)}
            />
          )
        })}
    </View>
  )
}

const styles = StyleSheet.create({
  deckContainer: {
    flex: 1,
    width: SCREEN_WIDTH - 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
