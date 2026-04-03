'use client'

import React, { useRef } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { Text } from 'tamagui'
import { DS } from '../../theme'
import type { PetProfile, SwipeDirection } from '../../types/petpals'

const AnimatedView = Animated.View as React.ComponentType<React.ComponentProps<typeof View>>

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3
const SWIPE_UP_THRESHOLD = -120
const ROTATION_FACTOR = 0.08

interface SwipeCardProps {
  profile: PetProfile
  onSwipe: (direction: SwipeDirection) => void
  isTop: boolean
  stackIndex: number
}

export function SwipeCard({ profile, onSwipe, isTop, stackIndex }: SwipeCardProps) {
  const position = useRef(new Animated.ValueXY()).current
  const [photoIndex, setPhotoIndex] = React.useState(0)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeOut('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeOut('left')
        } else if (gesture.dy < SWIPE_UP_THRESHOLD) {
          swipeOut('up')
        } else {
          resetPosition()
        }
      },
    }),
  ).current

  function swipeOut(direction: SwipeDirection) {
    const x =
      direction === 'right'
        ? SCREEN_WIDTH + 100
        : direction === 'left'
          ? -(SCREEN_WIDTH + 100)
          : 0
    const y = direction === 'up' ? -500 : 0

    Animated.spring(position, {
      toValue: { x, y },
      useNativeDriver: true,
      tension: 30,
      friction: 7,
    }).start(() => {
      onSwipe(direction)
      position.setValue({ x: 0, y: 0 })
    })
  }

  function resetPosition() {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start()
  }

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [`-${ROTATION_FACTOR * 10}deg`, '0deg', `${ROTATION_FACTOR * 10}deg`],
    extrapolate: 'clamp',
  })

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD * 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD * 0.5, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const superOpacity = position.y.interpolate({
    inputRange: [SWIPE_UP_THRESHOLD, SWIPE_UP_THRESHOLD * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const stackScale = isTop ? 1 : 1 - stackIndex * 0.04
  const stackTranslateY = isTop ? 0 : stackIndex * 8

  const cardStyle = isTop
    ? { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }
    : { transform: [{ scale: stackScale }, { translateY: stackTranslateY }] }

  const { pet } = profile

  return (
    <AnimatedView
      style={[styles.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      {/* Full-bleed photo */}
      <Image
        source={{ uri: pet.photos[photoIndex] ?? pet.photos[0] }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Photo indicator dots */}
      {pet.photos.length > 1 && (
        <View style={styles.dotsContainer}>
          {pet.photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === photoIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      {/* Photo tap zones */}
      {isTop && (
        <View style={styles.tapZones}>
          <View
            style={styles.tapZoneLeft}
            onTouchEnd={() =>
              setPhotoIndex((prev) => (prev > 0 ? prev - 1 : pet.photos.length - 1))
            }
          />
          <View
            style={styles.tapZoneRight}
            onTouchEnd={() =>
              setPhotoIndex((prev) => (prev + 1) % pet.photos.length)
            }
          />
        </View>
      )}

      {/* LIKE overlay — mint green */}
      <AnimatedView style={[styles.overlay, styles.overlayLike, { opacity: likeOpacity }]}>
        <Text style={[styles.overlayText, { color: DS.match }]}>LIKE 🐾</Text>
      </AnimatedView>

      {/* NOPE overlay — red */}
      <AnimatedView style={[styles.overlay, styles.overlayNope, { opacity: nopeOpacity }]}>
        <Text style={[styles.overlayText, { color: DS.error }]}>NOPE ✕</Text>
      </AnimatedView>

      {/* SUPER overlay — gold */}
      <AnimatedView style={[styles.overlay, styles.overlaySuper, { opacity: superOpacity }]}>
        <Text style={[styles.overlayText, { color: DS.superlike }]}>SUPER ⭐</Text>
      </AnimatedView>

      {/* Card info — white section at bottom */}
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.petName}>
            {pet.name}, {pet.age}yo
          </Text>
          {profile.distance !== undefined && (
            <Text style={styles.distance}>{profile.distance} km</Text>
          )}
        </View>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.owner}>
          with {profile.ownerName}, {profile.ownerAge}
        </Text>

        {/* Tag pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
        >
          {pet.tags.map((tag) => (
            <View key={tag.id} style={styles.tag}>
              <Text style={styles.tagText}>
                {tag.emoji} {tag.label}
              </Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.description} numberOfLines={2}>
          {pet.description}
        </Text>
      </View>
    </AnimatedView>
  )
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * 1.4,
    borderRadius: DS.radius.card,
    backgroundColor: DS.cardBg,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    ...DS.shadow.card,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '66%',
  },
  dotsContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    backgroundColor: DS.white,
    width: 16,
  },
  tapZones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '66%',
    flexDirection: 'row',
  },
  tapZoneLeft: { flex: 1 },
  tapZoneRight: { flex: 1 },
  overlay: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: DS.radius.sm,
    paddingHorizontal: DS.space.sm,
    paddingVertical: DS.space.xs,
  },
  overlayLike: {
    top: 40,
    left: 20,
    borderColor: DS.match,
    transform: [{ rotate: '-15deg' }],
  },
  overlayNope: {
    top: 40,
    right: 20,
    borderColor: DS.error,
    transform: [{ rotate: '15deg' }],
  },
  overlaySuper: {
    bottom: '42%',
    alignSelf: 'center',
    borderColor: DS.superlike,
  },
  overlayText: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: DS.font.display,
  },
  info: {
    flex: 1,
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.md,
    paddingBottom: DS.space.sm,
    backgroundColor: DS.cardBg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 22,
    fontWeight: '800',
    color: DS.text,
    fontFamily: DS.font.display,
    letterSpacing: -0.3,
  },
  distance: {
    ...DS.text_caption,
    color: DS.muted,
    fontWeight: '600',
  },
  breed: {
    ...DS.text_caption,
    color: DS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  owner: {
    fontSize: 12,
    color: DS.muted,
    marginTop: 1,
  },
  tagsScroll: {
    marginTop: DS.space.sm,
    marginBottom: DS.space.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,107,157,0.08)',
    borderRadius: DS.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,107,157,0.20)',
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
    marginRight: DS.space.xs,
  },
  tagText: {
    fontSize: 11,
    color: DS.primary,
    fontWeight: '600',
  },
  description: {
    ...DS.text_caption,
    color: DS.muted,
    lineHeight: 18,
  },
})
