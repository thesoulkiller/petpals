'use client'

import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack } from 'tamagui'
import { ChevronLeft, Star } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'

interface PackCardProps {
  count: number
  price: string
  popular?: boolean
  onPress: () => void
  key?: React.Key
}

function PackCard({ count, price, popular, onPress }: PackCardProps) {
  return (
    <YStack
      backgroundColor={popular ? bubblegumColors.warning : bubblegumColors.backgroundCard}
      borderRadius={20}
      padding="$5"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      borderWidth={popular ? 0 : 2}
      borderColor={bubblegumColors.border}
      shadowColor={popular ? bubblegumColors.warning : bubblegumColors.text}
      shadowOffset={{ width: 0, height: popular ? 6 : 2 }}
      shadowOpacity={popular ? 0.2 : 0.05}
      shadowRadius={popular ? 16 : 8}
      position="relative"
    >
      {popular && (
        <YStack
          position="absolute"
          top={-12}
          right={20}
          backgroundColor={bubblegumColors.primary}
          borderRadius={20}
          paddingHorizontal="$3"
          paddingVertical="$1"
        >
          <Text fontSize={11} fontWeight="800" color="white">⭐ Popular</Text>
        </YStack>
      )}

      <XStack alignItems="center" gap="$3">
        <YStack
          width={52}
          height={52}
          borderRadius={26}
          backgroundColor={popular ? 'rgba(255,255,255,0.3)' : bubblegumColors.backgroundMuted}
          alignItems="center"
          justifyContent="center"
        >
          <Star color={popular ? 'white' : bubblegumColors.warning} size={24} />
        </YStack>
        <YStack>
          <Text fontSize={20} fontWeight="900" color={popular ? 'white' : bubblegumColors.text}>
            {count} Superlikes
          </Text>
          <Text fontSize={13} color={popular ? 'rgba(255,255,255,0.75)' : bubblegumColors.textMuted}>
            {(parseFloat(price.replace('$', '')) / count).toFixed(2)} per superlike
          </Text>
        </YStack>
      </XStack>

      <Button
        onPress={onPress}
        backgroundColor={popular ? 'white' : bubblegumColors.primary}
        borderRadius={30}
        paddingHorizontal="$4"
        height={44}
        pressStyle={{ opacity: 0.85 }}
      >
        <Text
          color={popular ? bubblegumColors.warning : 'white'}
          fontWeight="800"
          fontSize={15}
        >
          {price}
        </Text>
      </Button>
    </YStack>
  )
}

export function SuperlikesScreen() {
  const router = useRouter()
  const { user } = useAppContext()

  function handleBuy(count: number, price: string) {
    Alert.alert(
      `⭐ ${count} Superlikes`,
      `This would purchase ${count} superlikes for ${price}. Payment coming soon!`,
      [{ text: 'Got it!' }],
    )
  }

  const packs: Array<{ count: number; price: string; popular?: boolean }> = [
    { count: 3, price: '$0.99' },
    { count: 10, price: '$2.99', popular: true },
    { count: 25, price: '$5.99' },
  ]

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background}>
        {/* Nav */}
        <XStack paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2" alignItems="center">
          <Button
            onPress={() => router.back()}
            backgroundColor="transparent"
            width={40}
            height={40}
            padding={0}
            icon={<ChevronLeft color={bubblegumColors.text} size={24} />}
          />
          <Text fontSize={20} fontWeight="900" color={bubblegumColors.text} flex={1} textAlign="center">
            Get Superlikes ⭐
          </Text>
          <YStack width={40} />
        </XStack>

        <YStack flex={1} paddingHorizontal="$4" paddingTop="$2" gap="$5">
          {/* Current balance */}
          <YStack
            backgroundColor={bubblegumColors.backgroundCard}
            borderRadius={20}
            padding="$4"
            alignItems="center"
            gap="$1"
          >
            <Text fontSize={14} color={bubblegumColors.textMuted} fontWeight="600">Current Balance</Text>
            <XStack alignItems="center" gap="$2">
              <Star color={bubblegumColors.warning} size={28} />
              <Text fontSize={36} fontWeight="900" color={bubblegumColors.text}>
                {user.superlikes}
              </Text>
              <Text fontSize={16} color={bubblegumColors.textMuted}>superlikes</Text>
            </XStack>
          </YStack>

          {/* Explanation */}
          <YStack gap="$2">
            <Text fontSize={18} fontWeight="800" color={bubblegumColors.text}>
              Stand out with a Superlike ⭐
            </Text>
            <Text fontSize={14} color={bubblegumColors.textMuted} lineHeight={22}>
              Superlikes let pets know you're extra interested. Profiles you superlike see your pet first — and are 3× more likely to match!
            </Text>
          </YStack>

          {/* Packs */}
          <YStack gap="$4">
            {packs.map((pack) => (
              <PackCard
                key={pack.count}
                count={pack.count}
                price={pack.price}
                popular={pack.popular}
                onPress={() => handleBuy(pack.count, pack.price)}
              />
            ))}
          </YStack>
        </YStack>

        <Text
          fontSize={11}
          color={bubblegumColors.textLight}
          textAlign="center"
          paddingHorizontal="$6"
          paddingBottom="$4"
        >
          Payment stub — no real charges will be made.
        </Text>
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
})
