'use client'

import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import { Button, Text, YStack, XStack } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
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

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background}>
        <OnboardingProgress step={3} total={4} />

        <YStack flex={1} paddingHorizontal={24} paddingTop={40} gap="$4">
          <YStack gap="$2">
            <Text fontSize={28} fontWeight="900" color={bubblegumColors.text}>
              Pick {user.pet?.name ?? 'your pet'}'s best photos 📸
            </Text>
            <Text fontSize={15} color={bubblegumColors.textMuted} lineHeight={22}>
              Choose up to 4 photos. First one will be the profile pic!
            </Text>
          </YStack>

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
                >
                  <Image source={{ uri: url }} style={styles.photoImage} resizeMode="cover" />
                  {selected && (
                    <YStack style={styles.photoCheckBadge}>
                      <Check color="white" size={14} />
                      {orderIndex === 0 && (
                        <Text style={styles.photoMainLabel}>MAIN</Text>
                      )}
                    </YStack>
                  )}
                </TouchableOpacity>
              )
            }}
            style={styles.list}
          />
        </YStack>

        <YStack paddingHorizontal={24} paddingBottom={32}>
          <Button
            onPress={handleContinue}
            disabled={selectedPhotos.length === 0}
            backgroundColor={selectedPhotos.length > 0 ? bubblegumColors.primary : bubblegumColors.border}
            borderRadius={30}
            height={56}
            pressStyle={{ opacity: 0.88, scale: 0.98 }}
          >
            <Text color="white" fontWeight="800" fontSize={17}>
              {selectedPhotos.length > 0
                ? `Continue with ${selectedPhotos.length} photo${selectedPhotos.length > 1 ? 's' : ''} →`
                : 'Select at least 1 photo'}
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  list: { flex: 1 },
  photoRow: { gap: 8, marginBottom: 8 },
  photoTile: {
    flex: 1,
    aspectRatio: 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  photoTileSelected: {
    borderColor: bubblegumColors.primary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: bubblegumColors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoMainLabel: {
    position: 'absolute',
    bottom: -18,
    fontSize: 8,
    color: bubblegumColors.primary,
    fontWeight: '800',
  },
})
