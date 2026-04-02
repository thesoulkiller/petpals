'use client'

import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Button, Text, YStack } from 'tamagui'
import { useRouter } from 'expo-router'
import Svg, { Circle, Path } from 'react-native-svg'
import { bubblegumColors } from '@my/config'

function PawPrintIcon({ size = 80 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Paw pads */}
      <Circle cx="50" cy="62" r="22" fill={bubblegumColors.primary} />
      <Circle cx="28" cy="42" r="11" fill={bubblegumColors.primary} />
      <Circle cx="50" cy="35" r="11" fill={bubblegumColors.primary} />
      <Circle cx="72" cy="42" r="11" fill={bubblegumColors.primary} />
      <Circle cx="35" cy="58" r="10" fill={bubblegumColors.primaryDark} />
      <Circle cx="50" cy="65" r="10" fill={bubblegumColors.primaryDark} />
      <Circle cx="65" cy="58" r="10" fill={bubblegumColors.primaryDark} />
    </Svg>
  )
}

export function WelcomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background} paddingHorizontal={24}>
        {/* Top decorative circles */}
        <YStack
          position="absolute"
          top={-60}
          right={-40}
          width={200}
          height={200}
          borderRadius={100}
          backgroundColor={bubblegumColors.primaryLight}
          opacity={0.3}
        />
        <YStack
          position="absolute"
          top={80}
          left={-60}
          width={150}
          height={150}
          borderRadius={75}
          backgroundColor={bubblegumColors.secondary}
          opacity={0.2}
        />

        <YStack flex={1} alignItems="center" justifyContent="center" gap="$5">
          <PawPrintIcon size={100} />

          <YStack alignItems="center" gap="$2">
            <Text
              fontSize={42}
              fontWeight="900"
              color={bubblegumColors.primary}
              letterSpacing={-1}
            >
              PetPals
            </Text>
            <Text
              fontSize={16}
              color={bubblegumColors.textMuted}
              textAlign="center"
              lineHeight={24}
            >
              Find the perfect playmate{'\n'}for your furry best friend 🐾
            </Text>
          </YStack>

          {/* Feature bubbles */}
          <YStack gap="$3" width="100%">
            {[
              { emoji: '📍', text: 'Matches near you' },
              { emoji: '🐶', text: 'Dogs, cats & more' },
              { emoji: '💕', text: 'Playdates made easy' },
            ].map(({ emoji, text }) => (
              <YStack
                key={text}
                flexDirection="row"
                alignItems="center"
                gap="$3"
                backgroundColor={bubblegumColors.backgroundCard}
                borderRadius={16}
                padding="$3"
                shadowColor={bubblegumColors.primary}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.08}
                shadowRadius={8}
              >
                <Text fontSize={24}>{emoji}</Text>
                <Text fontSize={15} fontWeight="600" color={bubblegumColors.text}>
                  {text}
                </Text>
              </YStack>
            ))}
          </YStack>
        </YStack>

        {/* CTA */}
        <YStack paddingBottom={32} gap="$3">
          <Button
            onPress={() => router.push('/onboarding/owner')}
            backgroundColor={bubblegumColors.primary}
            borderRadius={30}
            height={56}
            pressStyle={{ opacity: 0.88, scale: 0.98 }}
          >
            <Text color="white" fontWeight="800" fontSize={18}>
              Find My Pal 🐾
            </Text>
          </Button>
          <Text
            fontSize={11}
            color={bubblegumColors.textLight}
            textAlign="center"
          >
            Free to join · No credit card needed
          </Text>
        </YStack>
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: bubblegumColors.background,
  },
})
