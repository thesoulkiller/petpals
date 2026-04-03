'use client'

import React, { useState } from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'
import { TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Edit3, Star, Crown, Heart } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'

export function ProfileScreen() {
  const router = useRouter()
  const { user, likes, updateUser } = useAppContext()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(user.ownerName)

  const matchCount = likes.filter((l) => l.isMatch).length
  const likesSent = likes.filter((l) => l.type === 'like' || l.type === 'superlike').length

  function saveOwnerName() {
    if (nameInput.trim().length >= 2) {
      updateUser({ ownerName: nameInput.trim() })
    }
    setEditingName(false)
  }

  const hasPet = user.pet !== null

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <YStack paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2">
          <Text fontSize={24} fontWeight="900" color={bubblegumColors.text}>
            My Profile 🐾
          </Text>
        </YStack>

        {/* Pet photo */}
        <YStack alignItems="center" paddingTop="$2" paddingBottom="$4">
          {hasPet && user.pet!.photos.length > 0 ? (
            <Image
              source={{ uri: user.pet!.photos[0] }}
              style={styles.profilePhoto}
              resizeMode="cover"
            />
          ) : (
            <YStack
              width={140}
              height={140}
              borderRadius={70}
              backgroundColor={bubblegumColors.backgroundMuted}
              alignItems="center"
              justifyContent="center"
              borderWidth={3}
              borderColor={bubblegumColors.primaryLight}
            >
              <Text fontSize={48}>🐾</Text>
            </YStack>
          )}

          {/* Premium badge */}
          {user.isPremium && (
            <XStack
              backgroundColor={bubblegumColors.warning}
              borderRadius={20}
              paddingHorizontal="$3"
              paddingVertical="$1"
              marginTop="$2"
              alignItems="center"
              gap="$1"
            >
              <Crown color="white" size={14} />
              <Text color="white" fontSize={12} fontWeight="800">Premium</Text>
            </XStack>
          )}
        </YStack>

        {/* Name row */}
        <YStack paddingHorizontal="$4" gap="$3">
          <YStack
            backgroundColor={bubblegumColors.backgroundCard}
            borderRadius={16}
            padding="$4"
            gap="$2"
            shadowColor={bubblegumColors.text}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.05}
            shadowRadius={8}
          >
            <Text fontSize={12} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
              Your Name
            </Text>
            {editingName ? (
              <XStack gap="$2" alignItems="center" flex={1}>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  style={styles.nameInput}
                  onSubmitEditing={saveOwnerName}
                  returnKeyType="done"
                />
                <Button
                  onPress={saveOwnerName}
                  backgroundColor={bubblegumColors.primary}
                  borderRadius={12}
                  paddingHorizontal="$3"
                  height={44}
                >
                  <Text color="white" fontWeight="700">Save</Text>
                </Button>
              </XStack>
            ) : (
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize={18} fontWeight="700" color={bubblegumColors.text}>
                  {user.ownerName || 'Set your name'}
                </Text>
                <TouchableOpacity onPress={() => setEditingName(true)}>
                  <Edit3 color={bubblegumColors.primary} size={18} />
                </TouchableOpacity>
              </XStack>
            )}
          </YStack>

          {/* Pet info */}
          {hasPet && (
            <YStack
              backgroundColor={bubblegumColors.backgroundCard}
              borderRadius={16}
              padding="$4"
              gap="$3"
              shadowColor={bubblegumColors.text}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.05}
              shadowRadius={8}
            >
              <Text fontSize={12} fontWeight="700" color={bubblegumColors.textMuted} textTransform="uppercase" letterSpacing={1}>
                My Pet
              </Text>
              <XStack alignItems="center" gap="$3">
                <YStack flex={1}>
                  <Text fontSize={20} fontWeight="800" color={bubblegumColors.text}>
                    {user.pet!.name}
                  </Text>
                  <Text fontSize={14} color={bubblegumColors.primary} fontWeight="600">
                    {user.pet!.breed} · {user.pet!.age}yo
                  </Text>
                </YStack>
              </XStack>
              <XStack flexWrap="wrap" gap="$2">
                {user.pet!.tags.map((tag) => (
                  <YStack
                    key={tag.id}
                    backgroundColor={bubblegumColors.backgroundMuted}
                    borderRadius={20}
                    paddingHorizontal="$3"
                    paddingVertical="$1"
                  >
                    <Text fontSize={12} color={bubblegumColors.primary} fontWeight="600">
                      {tag.emoji} {tag.label}
                    </Text>
                  </YStack>
                ))}
              </XStack>
            </YStack>
          )}

          {/* Stats */}
          <XStack gap="$3">
            <YStack
              flex={1}
              backgroundColor={bubblegumColors.backgroundCard}
              borderRadius={16}
              padding="$4"
              alignItems="center"
              gap="$1"
            >
              <Heart color={bubblegumColors.primary} size={22} />
              <Text fontSize={22} fontWeight="900" color={bubblegumColors.text}>{likesSent}</Text>
              <Text fontSize={12} color={bubblegumColors.textMuted}>Likes sent</Text>
            </YStack>
            <YStack
              flex={1}
              backgroundColor={bubblegumColors.backgroundCard}
              borderRadius={16}
              padding="$4"
              alignItems="center"
              gap="$1"
            >
              <Text fontSize={22}>💕</Text>
              <Text fontSize={22} fontWeight="900" color={bubblegumColors.text}>{matchCount}</Text>
              <Text fontSize={12} color={bubblegumColors.textMuted}>Matches</Text>
            </YStack>
          </XStack>

          {/* Superlikes row */}
          <YStack
            backgroundColor={bubblegumColors.backgroundCard}
            borderRadius={16}
            padding="$4"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <XStack alignItems="center" gap="$2">
              <Star color={bubblegumColors.warning} size={20} />
              <YStack>
                <Text fontSize={15} fontWeight="700" color={bubblegumColors.text}>
                  Superlikes remaining
                </Text>
                <Text fontSize={13} color={bubblegumColors.textMuted}>
                  {user.superlikes} left today
                </Text>
              </YStack>
            </XStack>
            <Button
              onPress={() => router.push('/paywall/superlikes')}
              backgroundColor={bubblegumColors.warning}
              borderRadius={20}
              paddingHorizontal="$3"
              height={36}
              pressStyle={{ opacity: 0.85 }}
            >
              <Text color="white" fontWeight="700" fontSize={13}>Get more</Text>
            </Button>
          </YStack>

          {/* Premium upsell */}
          {!user.isPremium && (
            <Button
              onPress={() => router.push('/paywall/subscription')}
              backgroundColor={bubblegumColors.primary}
              borderRadius={16}
              height={56}
              pressStyle={{ opacity: 0.88, scale: 0.98 }}
              marginTop="$2"
            >
              <XStack alignItems="center" gap="$2">
                <Crown color="white" size={18} />
                <Text color="white" fontWeight="800" fontSize={16}>
                  Upgrade to Premium
                </Text>
              </XStack>
            </Button>
          )}

          {/* Reset onboarding (dev helper) */}
          <Button
            onPress={() => {
              Alert.alert('Reset Profile', 'This will restart onboarding.', [
                { text: 'Cancel' },
                {
                  text: 'Reset',
                  style: 'destructive',
                  onPress: () => {
                    updateUser({
                      ownerName: '',
                      pet: null,
                      location: null,
                      onboardingComplete: false,
                      superlikes: 3,
                      isPremium: false })
                    router.replace('/onboarding')
                  } },
              ])
            }}
            backgroundColor="transparent"
            borderRadius={12}
            marginTop="$2"
            marginBottom="$4"
          >
            <Text color={bubblegumColors.textMuted} fontSize={13}>
              Reset Profile (Dev)
            </Text>
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  scroll: { paddingBottom: 40 },
  nameInput: {
    flex: 1,
    fontSize: 17,
    color: bubblegumColors.text,
    borderWidth: 2,
    borderColor: bubblegumColors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: bubblegumColors.background,
    fontWeight: '600' },
  profilePhoto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: bubblegumColors.primaryLight } })
