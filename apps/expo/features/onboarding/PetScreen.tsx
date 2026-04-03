'use client'

import React, { useState } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { Minus, Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
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
        <View style={styles.container}>
          <OnboardingProgress step={2} total={4} />

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.body}>
              <View style={styles.textBlock}>
                <Text style={styles.title}>Tell us about your pet 🐾</Text>
                <Text style={styles.subtitle}>Help other pets get to know yours!</Text>
              </View>

              {/* Pet name */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Pet Name</Text>
                <TextInput
                  value={petName}
                  onChangeText={setPetName}
                  placeholder="e.g. Biscuit"
                  placeholderTextColor={DS.muted}
                  style={[styles.input, petName.length >= 2 && styles.inputValid]}
                  autoCapitalize="words"
                />
              </View>

              {/* Breed */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Breed</Text>
                <TextInput
                  value={breed}
                  onChangeText={setBreed}
                  placeholder="e.g. Golden Retriever"
                  placeholderTextColor={DS.muted}
                  style={[styles.input, breed.length >= 2 && styles.inputValid]}
                  autoCapitalize="words"
                />
              </View>

              {/* Age */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Age (years)</Text>
                <View style={styles.ageRow}>
                  <TouchableOpacity
                    onPress={() => setAge((a) => Math.max(0, a - 1))}
                    style={styles.ageBtn}
                    activeOpacity={0.75}
                  >
                    <Minus color={DS.primary} size={20} />
                  </TouchableOpacity>
                  <Text style={styles.ageValue}>{age}</Text>
                  <TouchableOpacity
                    onPress={() => setAge((a) => Math.min(25, a + 1))}
                    style={styles.ageBtn}
                    activeOpacity={0.75}
                  >
                    <Plus color={DS.primary} size={20} />
                  </TouchableOpacity>
                  <Text style={styles.ageUnit}>{age === 1 ? 'year old' : 'years old'}</Text>
                </View>
              </View>

              {/* Personality tags */}
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Personality (up to 4)</Text>
                <View style={styles.tagsWrap}>
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = !!selectedTags.find((t) => t.id === tag.id)
                    const disabled = !isSelected && selectedTags.length >= 4
                    return (
                      <TouchableOpacity
                        key={tag.id}
                        onPress={() => !disabled && toggleTag(tag)}
                        style={[
                          styles.tagChip,
                          isSelected && styles.tagChipSelected,
                          disabled && styles.tagChipDisabled,
                        ]}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                          {tag.emoji} {tag.label}
                        </Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleContinue}
                style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]}
                disabled={!isValid}
                activeOpacity={0.88}
              >
                <Text style={styles.ctaText}>Continue →</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.surface },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: DS.surface },
  scroll: { paddingBottom: DS.space.xxxl },
  body: {
    paddingHorizontal: DS.space.xl,
    paddingTop: DS.space.xxxl,
    gap: DS.space.xl,
  },
  textBlock: { gap: DS.space.sm },
  title: {
    ...DS.text_hero,
    fontFamily: DS.font.display,
    color: DS.text,
  },
  subtitle: {
    ...DS.text_body,
    color: DS.muted,
    lineHeight: 22,
  },
  field: { gap: DS.space.sm },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: DS.cardBg,
    borderWidth: 2,
    borderColor: DS.cardBorder,
    borderRadius: DS.radius.md,
    fontSize: 17,
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.md,
    color: DS.text,
    fontWeight: '600',
  },
  inputValid: {
    borderColor: DS.primary,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.base,
  },
  ageBtn: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.pill,
    backgroundColor: DS.surface,
    borderWidth: 1.5,
    borderColor: DS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageValue: {
    fontSize: 26,
    fontWeight: '800',
    color: DS.text,
    width: 40,
    textAlign: 'center',
  },
  ageUnit: {
    ...DS.text_body,
    color: DS.muted,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DS.space.sm,
  },
  tagChip: {
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.sm,
    borderRadius: DS.radius.pill,
    backgroundColor: DS.cardBg,
    borderWidth: 1.5,
    borderColor: DS.cardBorder,
  },
  tagChipSelected: {
    backgroundColor: 'rgba(255,107,157,0.10)',
    borderColor: DS.primary,
  },
  tagChipDisabled: {
    opacity: 0.4,
  },
  tagText: {
    fontSize: 13,
    color: DS.muted,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: DS.primary,
  },
  ctaBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.space.sm,
  },
  ctaBtnDisabled: {
    backgroundColor: DS.cardBorder,
  },
  ctaText: {
    ...DS.text_section,
    fontFamily: DS.font.display,
    color: DS.white,
    fontSize: 17,
  },
})
