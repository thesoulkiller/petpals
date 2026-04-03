'use client'

import React, { useState } from 'react'
import {
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text, XStack, YStack } from 'tamagui'
import { Lock } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { bubblegumColors } from '@my/config'
import { useAppContext } from '../../context/AppContext'
import type { PetProfile } from '../../types/petpals'

function ProfileCard({
  profile,
  isMatch,
  isPremium,
  onPress }: {
  profile: PetProfile
  isMatch: boolean
  isPremium: boolean
  onPress: () => void
}) {
  const blurred = isMatch && !isPremium

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <YStack position="relative">
        <Image
          source={{ uri: profile.pet.photos[0] }}
          style={[styles.cardPhoto, blurred && styles.blurredPhoto]}
          resizeMode="cover"
          blurRadius={blurred ? 15 : 0}
        />
        {blurred && (
          <YStack style={styles.lockOverlay}>
            <Lock color="white" size={20} />
            <Text color="white" fontSize={10} fontWeight="700" textAlign="center">
              Premium
            </Text>
          </YStack>
        )}
        {isMatch && (
          <YStack style={styles.matchBadge}>
            <Text fontSize={10} color="white" fontWeight="800">MATCH 💕</Text>
          </YStack>
        )}
      </YStack>
      <YStack padding="$2" gap="$0.5">
        <Text fontSize={13} fontWeight="700" color={bubblegumColors.text} numberOfLines={1}>
          {blurred ? '???' : profile.pet.name}
        </Text>
        <Text fontSize={11} color={bubblegumColors.textMuted} numberOfLines={1}>
          {blurred ? profile.location.city : profile.location.city}
        </Text>
      </YStack>
    </TouchableOpacity>
  )
}

export function LikesScreen() {
  const router = useRouter()
  const { likes, profiles, user } = useAppContext()
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches')

  const likeRecords = likes.filter((l) => l.type !== 'dislike')
  const matchRecords = likes.filter((l) => l.isMatch)

  const displayRecords = activeTab === 'matches' ? matchRecords : likeRecords

  const displayProfiles: PetProfile[] = displayRecords
    .map((r) => profiles.find((p) => p.id === r.targetProfileId))
    .filter((p): p is PetProfile => p !== undefined)

  if (likes.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <YStack flex={1} backgroundColor={bubblegumColors.background} alignItems="center" justifyContent="center" gap="$4" paddingHorizontal="$6">
          <Text fontSize={48}>💕</Text>
          <Text fontSize={22} fontWeight="800" color={bubblegumColors.text} textAlign="center">
            No likes yet!
          </Text>
          <Text fontSize={15} color={bubblegumColors.textMuted} textAlign="center" lineHeight={22}>
            Start swiping in Discover to collect likes and matches.
          </Text>
        </YStack>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <YStack flex={1} backgroundColor={bubblegumColors.background}>
        {/* Header */}
        <YStack paddingHorizontal="$4" paddingTop="$3" paddingBottom="$2">
          <Text fontSize={24} fontWeight="900" color={bubblegumColors.text}>
            Likes & Matches 💕
          </Text>
        </YStack>

        {/* Tabs */}
        <XStack paddingHorizontal="$4" gap="$3" marginBottom="$3">
          {(['matches', 'likes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text
                fontSize={14}
                fontWeight="700"
                color={activeTab === tab ? bubblegumColors.primary : bubblegumColors.textMuted}
              >
                {tab === 'matches' ? `Matches (${matchRecords.length})` : `Liked (${likeRecords.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </XStack>

        {/* Premium upsell for matches */}
        {activeTab === 'matches' && !user.isPremium && matchRecords.length > 0 && (
          <Button
            onPress={() => router.push('/paywall/subscription')}
            backgroundColor={bubblegumColors.primaryLight}
            borderRadius={12}
            marginHorizontal="$4"
            marginBottom="$3"
            height={48}
            pressStyle={{ opacity: 0.9 }}
          >
            <Text fontSize={13} color={bubblegumColors.primaryDark} fontWeight="700">
              💎 Unlock matches with Premium
            </Text>
          </Button>
        )}

        <FlatList
          data={displayProfiles}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const record = displayRecords.find((r) => r.targetProfileId === item.id)
            return (
              <ProfileCard
                profile={item}
                isMatch={record?.isMatch ?? false}
                isPremium={user.isPremium}
                onPress={() => {/* stub: open profile detail */}}
              />
            )
          }}
          ListEmptyComponent={
            <YStack flex={1} alignItems="center" paddingTop="$8" gap="$2">
              <Text fontSize={32}>🐾</Text>
              <Text fontSize={16} color={bubblegumColors.textMuted} textAlign="center">
                {activeTab === 'matches' ? 'No matches yet — keep swiping!' : 'No likes sent yet!'}
              </Text>
            </YStack>
          }
        />
      </YStack>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: bubblegumColors.background },
  grid: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: bubblegumColors.backgroundCard,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: bubblegumColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3 },
  cardPhoto: {
    width: '100%',
    aspectRatio: 0.85 },
  blurredPhoto: {
    opacity: 0.7 },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4 },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: bubblegumColors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent' },
  tabActive: {
    borderBottomColor: bubblegumColors.primary } })
