'use client'

import React, { useState } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
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
        <YStack flex={1} backgroundColor={bubblegumColors.background}>
          <OnboardingProgress step={1} total={4} />

          <YStack flex={1} paddingHorizontal={24} paddingTop={40} gap="$5">
            <YStack gap="$2">
              <Text fontSize={28} fontWeight="900" color={bubblegumColors.text}>
                What's your name? 👋
              </Text>
              <Text fontSize={15} color={bubblegumColors.textMuted} lineHeight={22}>
                Let other pet owners know who they're connecting with.
              </Text>
            </YStack>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              placeholderTextColor={bubblegumColors.textLight}
              style={[
                styles.input,
                { borderColor: isValid ? bubblegumColors.primary : bubblegumColors.border },
              ]}
              autoCapitalize="words"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </YStack>

          <YStack paddingHorizontal={24} paddingBottom={32}>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  flex: { flex: 1 },
  input: {
    backgroundColor: bubblegumColors.backgroundCard,
    borderWidth: 2,
    borderRadius: 16,
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: bubblegumColors.text,
    fontWeight: '600',
  },
})
