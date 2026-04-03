import React, { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
const TAP_THRESHOLD = 8 // px — below this, treat gesture as a tap not a swipe

interface SwipeCardProps {
  profile: PetProfile
  onSwipe: (direction: SwipeDirection) => void
  onOpenDetail?: () => void
  isTop: boolean
  stackIndex: number
}

export function SwipeCard({ profile, onSwipe, onOpenDetail, isTop, stackIndex }: SwipeCardProps) {
  const position = useRef(new Animated.ValueXY()).current
  const [photoIndex, setPhotoIndex] = React.useState(0)

  // Keep a ref so PanResponder callbacks always read the current isTop value.
  // Without this, the closure captures isTop at mount time — cards below the
  // top mount with isTop=false and never become swipeable after promotion.
  const isTopRef = useRef(isTop)
  useEffect(() => {
    isTopRef.current = isTop
  }, [isTop])

  // Keep pet ref so PanResponder tap handler can access current photos.
  const petRef = useRef(profile.pet)
  useEffect(() => {
    petRef.current = profile.pet
  }, [profile.pet])

  // Keep onOpenDetail ref so stale PanResponder closure reads the current callback.
  const onOpenDetailRef = useRef(onOpenDetail)
  useEffect(() => {
    onOpenDetailRef.current = onOpenDetail
  }, [onOpenDetail])

  const setPhotoIndexRef = useRef(setPhotoIndex)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTopRef.current,
      onMoveShouldSetPanResponder: () => isTopRef.current,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (evt, gesture) => {
        const { dx, dy } = gesture
        const isTap = Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD

        if (isTap) {
          // Tap on left half of photo → prev photo, right half → next photo
          // (Info area taps are handled by the TouchableOpacity on the info section)
          const tapX = evt.nativeEvent.locationX
          const cardCenter = (SCREEN_WIDTH - 32) / 2
          const photos = petRef.current.photos
          setPhotoIndexRef.current((prev) =>
            tapX < cardCenter
              ? prev > 0 ? prev - 1 : photos.length - 1
              : (prev + 1) % photos.length,
          )
          return
        }

        if (dx > SWIPE_THRESHOLD) {
          swipeOut('right')
        } else if (dx < -SWIPE_THRESHOLD) {
          swipeOut('left')
        } else if (dy < SWIPE_UP_THRESHOLD) {
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

      {/* Card info — people first. TouchableOpacity wins the bubble-phase
          responder race over the parent PanResponder for taps; swipes are
          stolen back by onMoveShouldSetPanResponder once movement is detected. */}
      <TouchableOpacity
        style={styles.info}
        onPress={() => onOpenDetailRef.current?.()}
        activeOpacity={0.88}
        disabled={!isTop || !onOpenDetail}
      >
        <View style={styles.infoRow}>
          {/* Owner name is the headline — this is a human-first app */}
          <Text style={styles.ownerName}>
            {profile.ownerName}, {profile.ownerAge}
          </Text>
          {profile.distance !== undefined && (
            <Text style={styles.distance}>{profile.distance} km</Text>
          )}
        </View>

        {/* Pet as supporting info */}
        <Text style={styles.petInfo}>
          {pet.name} · {pet.breed} · {pet.age}yo
        </Text>

        {/* Tag pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScroll}
          contentContainerStyle={styles.tagsContent}
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
      </TouchableOpacity>
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
    height: '63%',
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
    bottom: '40%',
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
  // Owner name — the headline (human-first)
  ownerName: {
    fontSize: 22,
    fontWeight: '800',
    color: DS.text,
    fontFamily: DS.font.display,
    letterSpacing: -0.3,
    flex: 1,
  },
  distance: {
    ...DS.textCaption,
    color: DS.muted,
    fontWeight: '600',
  },
  // Pet info — supporting line
  petInfo: {
    ...DS.textCaption,
    color: DS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  tagsScroll: {
    marginTop: DS.space.sm,
    marginBottom: DS.space.xs,
    flexGrow: 0,
  },
  tagsContent: {
    alignItems: 'flex-start', // prevent pills from stretching to ScrollView's full height
    flexDirection: 'row',
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
    ...DS.textCaption,
    color: DS.muted,
    lineHeight: 18,
  },
})
