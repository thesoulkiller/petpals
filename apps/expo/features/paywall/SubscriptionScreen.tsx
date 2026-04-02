'use client'

import React from 'react'
import { SafeAreaView, StyleSheet, Alert, ScrollView } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'
import { Check, ChevronLeft, Crown } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'

interface TierCardProps {
  title: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
  badge?: string
  onPress: () => void
}

function TierCard({ title, price, period, features, highlighted, badge, onPress }: TierCardProps) {
  return (
    <YStack
      backgroundColor={highlighted ? bubblegumColors.primary : bubblegumColors.backgroundCard}
      borderRadius={20}
      padding="$5"
      gap="$3"
      borderWidth={highlighted ? 0 : 2}
      borderColor={bubblegumColors.border}
      position="relative"
      shadowColor={highlighted ? bubblegumColors.primary : bubblegumColors.text}
      shadowOffset={{ width: 0, height: highlighted ? 8 : 2 }}
      shadowOpacity={highlighted ? 0.25 : 0.05}
      shadowRadius={highlighted ? 20 : 8}
    >
      {badge && (
        <YStack
          position="absolute"
          top={-12}
          alignSelf="center"
          backgroundColor={bubblegumColors.secondary}
          borderRadius={20}
          paddingHorizontal="$3"
          paddingVertical="$1"
        >
          <Text fontSize={11} fontWeight="800" color="white">
            {badge}
          </Text>
        </YStack>
      )}

      <YStack gap="$1">
        <Text
          fontSize={16}
          fontWeight="800"
          color={highlighted ? 'white' : bubblegumColors.text}
        >
          {title}
        </Text>
        <XStack alignItems="baseline" gap="$1">
          <Text
            fontSize={30}
            fontWeight="900"
            color={highlighted ? 'white' : bubblegumColors.text}
          >
            {price}
          </Text>
          <Text
            fontSize={13}
            color={highlighted ? 'rgba(255,255,255,0.7)' : bubblegumColors.textMuted}
          >
            /{period}
          </Text>
        </XStack>
      </YStack>

      <YStack gap="$2">
        {features.map((f) => (
          <XStack key={f} alignItems="center" gap="$2">
            <Check
              color={highlighted ? 'white' : bubblegumColors.success}
              size={16}
            />
            <Text
              fontSize={14}
              color={highlighted ? 'rgba(255,255,255,0.9)' : bubblegumColors.text}
              flex={1}
            >
              {f}
            </Text>
          </XStack>
        ))}
      </YStack>

      <Button
        onPress={onPress}
        backgroundColor={highlighted ? 'white' : bubblegumColors.primary}
        borderRadius={30}
        height={48}
        pressStyle={{ opacity: 0.85, scale: 0.97 }}
      >
        <Text
          color={highlighted ? bubblegumColors.primary : 'white'}
          fontWeight="800"
          fontSize={15}
        >
          {title === 'Free' ? 'Current Plan' : `Subscribe — ${price}/${period}`}
        </Text>
      </Button>
    </YStack>
  )
}

export function SubscriptionScreen() {
  const router = useRouter()

  function handleSubscribe(tier: string, price: string) {
    Alert.alert(
      '🐾 PetPals Premium',
      `This would start your ${tier} subscription for ${price}. Payment coming soon!`,
      [{ text: 'Got it!' }],
    )
  }

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
            Go Premium 💎
          </Text>
          <YStack width={40} />
        </XStack>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <YStack alignItems="center" paddingVertical="$4" gap="$2">
            <Crown color={bubblegumColors.warning} size={48} />
            <Text fontSize={26} fontWeight="900" color={bubblegumColors.text} textAlign="center">
              Find your pet's perfect match
            </Text>
            <Text fontSize={15} color={bubblegumColors.textMuted} textAlign="center" lineHeight={22}>
              Unlock all features and help your furry friend find their forever playmate.
            </Text>
          </YStack>

          <YStack paddingHorizontal="$4" gap="$4">
            <TierCard
              title="Free"
              price="$0"
              period="forever"
              features={[
                '3 superlikes per day',
                'Limited daily swipes',
                'Basic discovery',
              ]}
              onPress={() => router.back()}
            />

            <TierCard
              title="Premium Monthly"
              price="$9.99"
              period="mo"
              features={[
                'Unlimited swipes',
                'See who liked you',
                '10 superlikes/day',
                'No ads',
                'Boost your profile',
              ]}
              onPress={() => handleSubscribe('Monthly', '$9.99')}
            />

            <TierCard
              title="Premium Annual"
              price="$59.99"
              period="yr"
              features={[
                'Everything in Monthly',
                '50% savings vs monthly',
                '25 superlikes/day',
                'Priority support',
                'Early access to new features',
              ]}
              highlighted
              badge="🔥 Best Value"
              onPress={() => handleSubscribe('Annual', '$59.99')}
            />
          </YStack>

          <Text fontSize={11} color={bubblegumColors.textLight} textAlign="center" paddingHorizontal="$6" paddingVertical="$4">
            Subscriptions auto-renew unless cancelled 24 hours before renewal. Payment stub — no real charges.
          </Text>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  scroll: { paddingBottom: 40 },
})
