
import React, { useState } from 'react'
import { StyleSheet, FlatList, Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'
import type { PetProfile } from '../../types/petpals'

const LIKED_PANEL_LIMIT = 5

function ProfileCard({
  profile,
  isMatch,
  onPress,
}: {
  profile: PetProfile
  isMatch: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.88}>
      <View style={styles.cardPhotoWrap}>
        <Image
          source={{ uri: profile.pet.photos[0] }}
          style={styles.cardPhoto}
          resizeMode="cover"
        />
        {isMatch && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>MATCH 💕</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={1}>
          {profile.ownerName}
        </Text>
        <Text style={styles.cardCity} numberOfLines={1}>
          {profile.pet.name} · {profile.location.city}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export function LikesScreen() {
  const router = useRouter()
  const { likes, profiles } = useAppContext()
  const [activeTab, setActiveTab] = useState<'matches' | 'likes'>('matches')

  const likeRecords = likes
    .filter((l) => l.type !== 'dislike')
    .sort((a, b) => b.timestamp - a.timestamp)
  const matchRecords = likeRecords.filter((l) => l.isMatch)

  // Last 5 liked (non-match likes shown in liked tab)
  const recentLikeRecords = likeRecords.slice(0, LIKED_PANEL_LIMIT)

  const displayRecords = activeTab === 'matches' ? matchRecords : recentLikeRecords

  const displayProfiles: PetProfile[] = displayRecords
    .map((r) => profiles.find((p) => p.id === r.targetProfileId))
    .filter((p): p is PetProfile => p !== undefined)

  if (likes.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💕</Text>
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptyBody}>
            Start swiping in Discover to collect likes and matches.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Likes & Matches</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['matches', 'likes'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
                {tab === 'matches'
                  ? `Matches (${matchRecords.length})`
                  : `Liked (${recentLikeRecords.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={displayProfiles}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const record = displayRecords.find((r) => r.targetProfileId === item.id)
            const isMatch = record?.isMatch ?? false
            return (
              <ProfileCard
                profile={item}
                isMatch={isMatch}
                onPress={() => {
                  if (isMatch) {
                    router.push(`/chat/${item.id}`)
                  }
                }}
              />
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={{ fontSize: 32 }}>🐾</Text>
              <Text style={styles.emptyListText}>
                {activeTab === 'matches' ? 'No matches yet — keep swiping!' : 'No likes sent yet!'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  header: {
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.md,
    paddingBottom: DS.space.sm,
  },
  heading: {
    ...DS.textTitle,
    fontFamily: DS.font.display,
    color: DS.text,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: DS.space.base,
    gap: DS.space.md,
    marginBottom: DS.space.md,
  },
  tab: {
    paddingVertical: DS.space.sm,
    paddingHorizontal: DS.space.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: DS.primary,
  },
  tabLabel: {
    ...DS.textCaption,
    fontWeight: '700',
    color: DS.muted,
  },
  tabLabelActive: {
    color: DS.primary,
  },
  grid: {
    paddingHorizontal: DS.space.base,
    paddingBottom: DS.space.xl,
  },
  row: {
    gap: DS.space.md,
    marginBottom: DS.space.md,
  },
  card: {
    flex: 1,
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    overflow: 'hidden',
    ...DS.shadow.card,
  },
  cardPhotoWrap: {
    position: 'relative',
  },
  cardPhoto: {
    width: '100%',
    aspectRatio: 0.85,
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: DS.primary,
    borderRadius: DS.radius.sm,
    paddingHorizontal: DS.space.sm,
    paddingVertical: DS.space.xs,
  },
  matchBadgeText: {
    fontSize: 10,
    color: DS.white,
    fontWeight: '800',
  },
  cardInfo: {
    padding: DS.space.sm,
    gap: 2,
  },
  cardName: {
    ...DS.textCaption,
    fontWeight: '700',
    color: DS.text,
  },
  cardCity: {
    fontSize: 11,
    color: DS.muted,
  },
  empty: {
    flex: 1,
    backgroundColor: DS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: DS.space.base,
    paddingHorizontal: DS.space.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    ...DS.textTitle,
    fontFamily: DS.font.display,
    color: DS.text,
    textAlign: 'center',
  },
  emptyBody: {
    ...DS.textBody,
    color: DS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyList: {
    alignItems: 'center',
    paddingTop: DS.space.xxxl,
    gap: DS.space.sm,
  },
  emptyListText: {
    ...DS.textBody,
    color: DS.muted,
    textAlign: 'center',
  },
})
