

import React from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native'
import { RefreshCw } from '@tamagui/lucide-icons'
import { DS } from '../../theme'
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyPaw}>🐾</Text>
        <Text style={styles.emptyTitle}>No more pets nearby!</Text>
        <Text style={styles.emptySubtitle}>
          You've seen all available pals. Check back soon — new pets join every day!
        </Text>
        {onRefresh && (
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.85}>
            <RefreshCw color={DS.white} size={16} />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        )}
      </View>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DS.space.xl,
    gap: DS.space.base,
  },
  emptyPaw: {
    fontSize: 56,
    marginBottom: DS.space.sm,
  },
  emptyTitle: {
    ...DS.textTitle,
    fontFamily: DS.font.display,
    color: DS.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...DS.textBody,
    color: DS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.sm,
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.xl,
    paddingVertical: DS.space.md,
    marginTop: DS.space.sm,
  },
  refreshText: {
    ...DS.textBody,
    color: DS.white,
    fontWeight: '700',
  },
})
