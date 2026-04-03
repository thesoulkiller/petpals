

import React, { useState } from 'react'
import { StyleSheet, Image, TouchableOpacity, FlatList, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import { OnboardingProgress } from './OnboardingProgress'
import { PRESET_PHOTOS } from '../../types/petpals'

export function PhotosScreen() {
  const router = useRouter()
  const { user, updateUser } = useAppContext()
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  function togglePhoto(url: string) {
    setSelectedPhotos((prev) =>
      prev.includes(url)
        ? prev.filter((p) => p !== url)
        : prev.length < 4
          ? [...prev, url]
          : prev,
    )
  }

  function handleContinue() {
    if (selectedPhotos.length === 0) return
    if (user.pet) {
      updateUser({ pet: { ...user.pet, photos: selectedPhotos } })
    }
    router.push('/onboarding/location')
  }

  const canContinue = selectedPhotos.length > 0

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <OnboardingProgress step={3} total={4} />

        <View style={styles.body}>
          <View style={styles.textBlock}>
            <Text style={styles.title}>
              Pick {user.pet?.name ?? 'your pet'}'s best photos 📸
            </Text>
            <Text style={styles.subtitle}>
              Choose up to 4. First one becomes the profile pic!
            </Text>
          </View>

          <FlatList
            data={PRESET_PHOTOS}
            numColumns={2}
            keyExtractor={(item) => item}
            columnWrapperStyle={styles.photoRow}
            renderItem={({ item: url }) => {
              const selected = selectedPhotos.includes(url)
              const orderIndex = selectedPhotos.indexOf(url)
              return (
                <TouchableOpacity
                  onPress={() => togglePhoto(url)}
                  style={[styles.photoTile, selected && styles.photoTileSelected]}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: url }} style={styles.photoImage} resizeMode="cover" />
                  {selected && (
                    <View style={styles.checkBadge}>
                      <Check color={DS.white} size={14} />
                    </View>
                  )}
                  {selected && orderIndex === 0 && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>MAIN</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )
            }}
            style={styles.list}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.ctaBtn, !canContinue && styles.ctaBtnDisabled]}
            disabled={!canContinue}
            activeOpacity={0.88}
          >
            <Text style={styles.ctaText}>
              {canContinue
                ? `Continue with ${selectedPhotos.length} photo${selectedPhotos.length > 1 ? 's' : ''} →`
                : 'Select at least 1 photo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.surface },
  container: { flex: 1, backgroundColor: DS.surface },
  body: {
    flex: 1,
    paddingHorizontal: DS.space.xl,
    paddingTop: DS.space.xxxl,
    gap: DS.space.base,
  },
  textBlock: { gap: DS.space.sm },
  title: {
    ...DS.textHero,
    fontFamily: DS.font.display,
    color: DS.text,
  },
  subtitle: {
    ...DS.textBody,
    color: DS.muted,
    lineHeight: 22,
  },
  list: { flex: 1 },
  photoRow: { gap: DS.space.sm, marginBottom: DS.space.sm },
  photoTile: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: DS.radius.md,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  photoTileSelected: {
    borderColor: DS.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: DS.radius.pill,
    backgroundColor: DS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: DS.primary,
    borderRadius: DS.radius.sm,
    paddingHorizontal: DS.space.sm,
    paddingVertical: 2,
  },
  mainBadgeText: {
    fontSize: 9,
    color: DS.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: DS.space.xl,
    paddingBottom: DS.space.xxl,
  },
  ctaBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: DS.cardBorder,
  },
  ctaText: {
    ...DS.textSection,
    fontFamily: DS.font.display,
    color: DS.white,
    fontSize: 17,
  },
})
