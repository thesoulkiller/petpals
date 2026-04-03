

import React, { useState } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, TextInput, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import { OnboardingProgress } from './OnboardingProgress'

export function OwnerScreen() {
  const router = useRouter()
  const { updateUser } = useAppContext()
  const [name, setName] = useState('')

  function handleContinue() {
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    updateUser({ ownerName: trimmed })
    router.push('/onboarding/pet')
  }

  const isValid = name.trim().length >= 2

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <OnboardingProgress step={1} total={4} />

          <View style={styles.body}>
            <View style={styles.textBlock}>
              <Text style={styles.title}>What's your name? 👋</Text>
              <Text style={styles.subtitle}>
                Let other pet owners know who they're connecting with.
              </Text>
            </View>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              placeholderTextColor={DS.muted}
              style={[styles.input, isValid && styles.inputValid]}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]}
              disabled={!isValid}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaText}>Continue →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.surface },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: DS.surface },
  body: {
    flex: 1,
    paddingHorizontal: DS.space.xl,
    paddingTop: DS.space.xxxl,
    gap: DS.space.xl,
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
  input: {
    backgroundColor: DS.cardBg,
    borderWidth: 2,
    borderColor: DS.cardBorder,
    borderRadius: DS.radius.md,
    fontSize: 18,
    paddingHorizontal: DS.space.lg,
    paddingVertical: DS.space.base,
    color: DS.text,
    fontWeight: '600',
  },
  inputValid: {
    borderColor: DS.primary,
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
