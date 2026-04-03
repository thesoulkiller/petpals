'use client'

import React, { useState } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack } from 'tamagui'
import { Minus, Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'
import { OnboardingProgress } from './OnboardingProgress'
import { AVAILABLE_TAGS } from '../../types/petpals'
import type { PetTag } from '../../types/petpals'

export function PetScreen() {
  const router = useRouter()
  const { user, updateUser } = useAppContext()

  const [petName, setPetName] = useState('')
  const [breed, setBreed] = useState('')
  const [age, setAge] = useState(1)
  const [selectedTags, setSelectedTags] = useState<PetTag[]>([])

  function toggleTag(tag: PetTag) {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag],
    )
  }

  function handleContinue() {
    if (!petName.trim() || !breed.trim()) return
    updateUser({
      pet: {
        id: `pet_${user.id}`,
        name: petName.trim(),
        breed: breed.trim(),
        age,
        description: '',
        photos: [],
        tags: selectedTags,
        ownerId: user.id,
      },
    })
    router.push('/onboarding/photos')
  }

  const isValid = petName.trim().length >= 2 && breed.trim().length >= 2

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack flex={1} backgroundColor={bubblegumColors.background}>
          <OnboardingProgress step={2} total={4} />

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <YStack gap="$5" paddingHorizontal={24} paddingTop={40}>
              <YStack gap="$2">
                <Text fontSize={28} fontWeight="900" color={bubblegumColors.text}>
                  Tell us about your pet 🐾
                </Text>
                <Text fontSize={15} color={bubblegumColors.textMuted} lineHeight={22}>
                  Help other pets get to know yours!
                </Text>
              </YStack>

              {/* Pet Name */}
              <YStack gap="$2">
                <Text fontSize={13} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
                  Pet Name
                </Text>
                <TextInput
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="e.g. Biscuit"
                  placeholderTextColor={bubblegumColors.textLight}
                  style={[
                    styles.input,
                    { borderColor: petName.length >= 2 ? bubblegumColors.primary : bubblegumColors.border },
                  ]}
                  autoCapitalize="words"
                />
              </YStack>

              {/* Breed */}
              <YStack gap="$2">
                <Text fontSize={13} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
                  Breed
                </Text>
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
                  placeholder="e.g. Golden Retriever"
                  placeholderTextColor={bubblegumColors.textLight}
                  style={[
                    styles.input,
                    { borderColor: breed.length >= 2 ? bubblegumColors.primary : bubblegumColors.border },
                  ]}
                  autoCapitalize="words"
                />
              </YStack>

              {/* Age */}
              <YStack gap="$2">
                <Text fontSize={13} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
                  Age (years)
                </Text>
                <XStack alignItems="center" gap="$4">
                  <TouchableOpacity
                    onPress={() => setAge((a) => Math.max(0, a - 1))}
                    style={styles.ageButton}
                  >
                    <Minus color={bubblegumColors.primary} size={20} />
                  </TouchableOpacity>
                  <Text fontSize={26} fontWeight="800" color={bubblegumColors.text} width={40} textAlign="center">
                    {age}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAge((a) => Math.min(25, a + 1))}
                    style={styles.ageButton}
                  >
                    <Plus color={bubblegumColors.primary} size={20} />
                  </TouchableOpacity>
                  <Text fontSize={14} color={bubblegumColors.textMuted}>
                    {age === 1 ? 'year old' : 'years old'}
                  </Text>
                </XStack>
              </YStack>

              {/* Tags */}
              <YStack gap="$3">
                <Text fontSize={13} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
                  Personality (pick up to 4)
                </Text>
                <XStack flexWrap="wrap" gap="$2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.find((t) => t.id === tag.id)
                    const disabled = !isSelected && selectedTags.length >= 4
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        onPress={() => !disabled && toggleTag(tag)}
                        style={[
                          styles.tagChip,
                          isSelected ? styles.tagChipSelected : null,
                          disabled ? styles.tagChipDisabled : null,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tagChipText,
                            isSelected ? styles.tagChipTextSelected : null,
                          ]}
                        >
                          {tag.emoji} {tag.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </XStack>
              </YStack>

              <YStack paddingBottom={32}>
                <Button
                  onPress={handleContinue}
                  disabled={!isValid}
                  backgroundColor={isValid ? bubblegumColors.primary : bubblegumColors.border}
                  borderRadius={30}
                  height={56}
                  pressStyle={{ opacity: 0.88, scale: 0.98 }}
                >
                  <Text color="white" fontWeight="800" fontSize={17}>
                    Continue →
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  flex: { flex: 1 },
  scroll: { paddingBottom: 40 },
  input: {
    backgroundColor: bubblegumColors.backgroundCard,
    borderWidth: 2,
    borderRadius: 16,
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: bubblegumColors.text,
    fontWeight: '600',
  },
  ageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: bubblegumColors.backgroundMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: bubblegumColors.backgroundCard,
    borderWidth: 2,
    borderColor: bubblegumColors.border,
    marginBottom: 4,
  },
  tagChipSelected: {
    backgroundColor: bubblegumColors.primaryLight,
    borderColor: bubblegumColors.primary,
  },
  tagChipDisabled: {
    opacity: 0.4,
  },
  tagChipText: {
    fontSize: 13,
    color: bubblegumColors.textMuted,
    fontWeight: '600',
  },
  tagChipTextSelected: {
    color: bubblegumColors.primaryDark,
  },
})
