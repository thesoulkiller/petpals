import React, { useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { Heart, Star, X } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import type { SwipeDirection } from '../../types/petpals'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PHOTO_HEIGHT = SCREEN_WIDTH * 0.88

interface ProfileDetailScreenProps {
  profileId: string
}

export function ProfileDetailScreen({ profileId }: ProfileDetailScreenProps) {
  const router = useRouter()
  const { profiles, swipe, user } = useAppContext()
  const insets = useSafeAreaInsets()
  const [photoIndex, setPhotoIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const profile = profiles.find((p) => p.id === profileId)

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Profile not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const { pet } = profile

  function handleAction(direction: SwipeDirection) {
    if (direction === 'right') {
      if (!user.isPremium && user.dailyLikesRemaining <= 0) {
        router.push('/paywall/subscription')
        return
      }
    }
    if (direction === 'up') {
      if (!user.isPremium && user.superlikes <= 0) {
        router.push('/paywall/superlikes')
        return
      }
    }
    swipe(profileId, direction)
    router.back()
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
    setPhotoIndex(index)
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Dismiss handle */}
      <View style={styles.handle} />

      {/* Close button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()} activeOpacity={0.8}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Photo carousel */}
        <View style={styles.photoWrap}>
          <FlatList
            ref={flatListRef}
            data={pet.photos}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={styles.photo}
                resizeMode="cover"
              />
            )}
          />

          {/* Dot indicator */}
          {pet.photos.length > 1 && (
            <View style={styles.dots}>
              {pet.photos.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === photoIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Info section */}
        <View style={styles.info}>
          {/* Owner row */}
          <View style={styles.ownerRow}>
            <Text style={styles.ownerName}>
              {profile.ownerName}, {profile.ownerAge}
            </Text>
            {profile.distance !== undefined && (
              <View style={styles.distanceChip}>
                <Text style={styles.distanceText}>{profile.distance} km</Text>
              </View>
            )}
          </View>

          {/* Pet info */}
          <Text style={styles.petInfo}>
            🐾 {pet.name} · {pet.breed} · {pet.age}yo
          </Text>

          {/* Tags — wrapping */}
          <View style={styles.tagsWrap}>
            {pet.tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>
                  {tag.emoji} {tag.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Full description */}
          <Text style={styles.description}>{pet.description}</Text>

          {/* City */}
          <Text style={styles.city}>📍 {profile.location.city}</Text>

          {/* Bottom padding for action bar */}
          <View style={{ height: 96 + insets.bottom }} />
        </View>
      </ScrollView>

      {/* Action bar — pinned to bottom */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + DS.space.sm }]}>
        {/* Dislike */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnLg, styles.actionBtnDislike]}
          onPress={() => handleAction('left')}
          activeOpacity={0.85}
        >
          <X color={DS.error} size={28} />
        </TouchableOpacity>

        {/* Superlike */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.actionBtnSm,
            user.superlikes > 0 || user.isPremium
              ? styles.actionBtnSuper
              : styles.actionBtnSuperEmpty,
          ]}
          onPress={() => handleAction('up')}
          activeOpacity={0.85}
        >
          <Star color="white" size={22} />
        </TouchableOpacity>

        {/* Like */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            styles.actionBtnLg,
            !user.isPremium && user.dailyLikesRemaining <= 0
              ? styles.actionBtnLikeEmpty
              : styles.actionBtnLike,
          ]}
          onPress={() => handleAction('right')}
          activeOpacity={0.85}
        >
          <Heart color="white" size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.cardBg,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: DS.cardBorder,
    marginTop: DS.space.sm,
    marginBottom: DS.space.xs,
  },
  closeBtn: {
    position: 'absolute',
    top: DS.space.lg,
    right: DS.space.base,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: DS.radius.pill,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: DS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  photoWrap: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
    position: 'relative',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: PHOTO_HEIGHT,
  },
  dots: {
    position: 'absolute',
    bottom: DS.space.base,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    width: 18,
    backgroundColor: DS.white,
  },
  info: {
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.xl,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: DS.space.xs,
  },
  ownerName: {
    ...DS.textHero,
    fontFamily: DS.font.display,
    color: DS.text,
    letterSpacing: -0.5,
    flex: 1,
  },
  distanceChip: {
    backgroundColor: 'rgba(255,107,157,0.10)',
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    marginLeft: DS.space.sm,
  },
  distanceText: {
    ...DS.textMicro,
    color: DS.primary,
    fontWeight: '700',
  },
  petInfo: {
    ...DS.textCaption,
    color: DS.primary,
    fontWeight: '700',
    marginBottom: DS.space.base,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DS.space.sm,
    marginBottom: DS.space.base,
  },
  tag: {
    backgroundColor: 'rgba(255,107,157,0.08)',
    borderRadius: DS.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.20)',
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.sm,
  },
  tagText: {
    fontSize: 12,
    color: DS.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: DS.cardBorder,
    marginBottom: DS.space.base,
  },
  description: {
    ...DS.textBody,
    color: DS.text,
    lineHeight: 24,
    marginBottom: DS.space.base,
  },
  city: {
    ...DS.textCaption,
    color: DS.muted,
    fontWeight: '500',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: DS.space.xl,
    paddingTop: DS.space.md,
    paddingHorizontal: DS.space.xxxl,
    backgroundColor: DS.cardBg,
    borderTopWidth: 1,
    borderTopColor: DS.cardBorder,
    ...DS.shadow.elevated,
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
  actionBtnLikeEmpty: {
    backgroundColor: DS.cardBorder,
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
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: DS.space.base,
  },
  errorText: {
    ...DS.textBody,
    color: DS.muted,
  },
  backBtn: {
    padding: DS.space.sm,
  },
  backBtnText: {
    ...DS.textBody,
    color: DS.primary,
    fontWeight: '700',
  },
})
