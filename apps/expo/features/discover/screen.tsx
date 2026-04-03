'use client'

import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { Heart, Star, X } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import { SwipeDeck } from './SwipeDeck'
import type { SwipeDirection } from '../../types/petpals'

export function DiscoverScreen() {
  const router = useRouter()
  const { remainingProfiles, swipe, user, pendingMatch } = useAppContext()

  useEffect(() => {
    if (pendingMatch) {
      router.push('/match')
    }
  }, [pendingMatch, router])

  function handleSwipe(profileId: string, direction: SwipeDirection) {
    swipe(profileId, direction)
  }

  function handleDislike() {
    if (remainingProfiles[0]) swipe(remainingProfiles[0].id, 'left')
  }

  function handleLike() {
    if (remainingProfiles[0]) swipe(remainingProfiles[0].id, 'right')
  }

  function handleSuperlike() {
    if (!remainingProfiles[0]) return
    if (user.superlikes <= 0) {
      router.push('/paywall/superlikes')
      return
    }
    swipe(remainingProfiles[0].id, 'up')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🐾 PetPals</Text>

          {/* Superlike badge */}
          <View style={[styles.superlikeBadge, user.superlikes <= 0 && styles.superlikeBadgeEmpty]}>
            <Text style={styles.superlikeEmoji}>⭐</Text>
            <Text style={[styles.superlikeCount, user.superlikes <= 0 && styles.superlikeCountEmpty]}>
              {user.superlikes}
            </Text>
          </View>
        </View>

        {/* Premium nudge */}
        {!user.isPremium && remainingProfiles.length < 5 && remainingProfiles.length > 0 && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => router.push('/paywall/subscription')}
            activeOpacity={0.88}
          >
            <Text style={styles.premiumBannerText}>
              💎 Go Premium — unlimited swipes & more
            </Text>
          </TouchableOpacity>
        )}

        {/* Swipe deck */}
        <View style={styles.deckArea}>
          <SwipeDeck
            profiles={remainingProfiles}
            onSwipe={handleSwipe}
            onRefresh={() => {}}
          />
        </View>

        {/* Action buttons */}
        {remainingProfiles.length > 0 && (
          <View style={styles.actions}>
            {/* Dislike */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnLg, styles.actionBtnDislike]}
              onPress={handleDislike}
              activeOpacity={0.85}
            >
              <X color={DS.error} size={28} />
            </TouchableOpacity>

            {/* Superlike */}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.actionBtnSm,
                user.superlikes > 0 ? styles.actionBtnSuper : styles.actionBtnSuperEmpty,
              ]}
              onPress={handleSuperlike}
              activeOpacity={0.85}
            >
              <Star color="white" size={22} />
            </TouchableOpacity>

            {/* Like */}
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnLg, styles.actionBtnLike]}
              onPress={handleLike}
              activeOpacity={0.85}
            >
              <Heart color="white" size={28} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.md,
    paddingBottom: DS.space.sm,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: DS.primary,
    fontFamily: DS.font.display,
    letterSpacing: -0.3,
  },
  superlikeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DS.superlike,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
  },
  superlikeBadgeEmpty: {
    backgroundColor: DS.cardBorder,
  },
  superlikeEmoji: {
    fontSize: 13,
  },
  superlikeCount: {
    ...DS.text_caption,
    color: DS.white,
    fontWeight: '700',
  },
  superlikeCountEmpty: {
    color: DS.muted,
  },
  premiumBanner: {
    backgroundColor: 'rgba(255,107,157,0.10)',
    borderBottomWidth: 1,
    borderBottomColor: DS.cardBorder,
    paddingVertical: DS.space.sm,
    paddingHorizontal: DS.space.base,
    alignItems: 'center',
  },
  premiumBannerText: {
    ...DS.text_caption,
    color: DS.primary,
    fontWeight: '700',
  },
  deckArea: {
    flex: 1,
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DS.space.xl,
    paddingHorizontal: DS.space.xxxl,
    paddingBottom: DS.space.xl,
    paddingTop: DS.space.sm,
  },
  actionBtn: {
    borderRadius: DS.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.white,
    ...DS.shadow.card,
  },
  actionBtnLg: {
    width: 64,
    height: 64,
  },
  actionBtnSm: {
    width: 52,
    height: 52,
  },
  actionBtnDislike: {
    borderWidth: 2,
    borderColor: DS.error,
  },
  actionBtnLike: {
    backgroundColor: DS.primary,
    borderWidth: 0,
  },
  actionBtnSuper: {
    backgroundColor: DS.superlike,
    borderWidth: 0,
  },
  actionBtnSuperEmpty: {
    backgroundColor: DS.cardBorder,
    borderWidth: 0,
  },
})
