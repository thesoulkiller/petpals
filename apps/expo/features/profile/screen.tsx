'use client'

import React, { useState } from 'react'
import { StyleSheet, Image, ScrollView, TouchableOpacity, Alert, View, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { LinearGradient } from 'expo-linear-gradient'
import { Edit3, Star, Crown, Heart } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
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

  const pet = user.pet

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient header strip with avatar */}
        <LinearGradient
          colors={DS.gradient}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <Text style={styles.headerWatermark}>🐾</Text>

          {pet && pet.photos.length > 0 ? (
            <Image
              source={{ uri: pet.photos[0] }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Text style={{ fontSize: 40 }}>🐾</Text>
            </View>
          )}

          <Text style={styles.headerName}>
            {user.ownerName || 'Your Name'}
          </Text>
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <Crown color={DS.superlike} size={14} />
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
          )}
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Heart color={DS.primary} size={20} />
              <Text style={styles.statNumber}>{likesSent}</Text>
              <Text style={styles.statLabel}>Likes sent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={{ fontSize: 20 }}>💕</Text>
              <Text style={styles.statNumber}>{matchCount}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Star color={DS.superlike} size={20} />
              <Text style={styles.statNumber}>{user.superlikes}</Text>
              <Text style={styles.statLabel}>Superlikes</Text>
            </View>
          </View>

          {/* Name card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Your Name</Text>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  style={styles.nameInput}
                  onSubmitEditing={saveOwnerName}
                  returnKeyType="done"
                  placeholderTextColor={DS.muted}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={saveOwnerName} activeOpacity={0.85}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.nameValue}>
                  {user.ownerName || 'Set your name'}
                </Text>
                <TouchableOpacity onPress={() => setEditingName(true)} activeOpacity={0.7}>
                  <Edit3 color={DS.primary} size={18} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Pet info card */}
          {pet && (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>My Pet</Text>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>
                {pet.breed} · {pet.age}yo
              </Text>
              <View style={styles.tagsRow}>
                {pet.tags.map((tag) => (
                  <View key={tag.id} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.emoji} {tag.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Get more superlikes */}
          <View style={styles.card}>
            <View style={styles.superlikeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.superlikeTitle}>Superlikes</Text>
                <Text style={styles.superlikeSub}>{user.superlikes} remaining today</Text>
              </View>
              <TouchableOpacity
                style={styles.getMoreBtn}
                onPress={() => router.push('/paywall/superlikes')}
                activeOpacity={0.85}
              >
                <Text style={styles.getMoreText}>Get more</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Premium upsell */}
          {!user.isPremium && (
            <TouchableOpacity
              style={styles.premiumCta}
              onPress={() => router.push('/paywall/subscription')}
              activeOpacity={0.88}
            >
              <Crown color={DS.white} size={18} />
              <Text style={styles.premiumCtaText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}

          {/* Dev reset */}
          <TouchableOpacity
            style={styles.resetBtn}
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
                      isPremium: false,
                    })
                    router.replace('/onboarding')
                  },
                },
              ])
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.resetText}>Reset Profile (Dev)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  scroll: {
    paddingBottom: DS.space.xxxl,
  },
  gradientHeader: {
    paddingTop: DS.space.xl,
    paddingBottom: DS.space.xxxl,
    alignItems: 'center',
    gap: DS.space.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  headerWatermark: {
    position: 'absolute',
    fontSize: 160,
    right: -20,
    top: -10,
    opacity: 0.08,
    transform: [{ rotate: '15deg' }],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: DS.radius.avatar,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarEmpty: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerName: {
    ...DS.textSection,
    fontFamily: DS.font.display,
    color: DS.white,
    letterSpacing: -0.2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.xs,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
  },
  premiumBadgeText: {
    fontSize: 12,
    color: DS.white,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.base,
    gap: DS.space.md,
    marginTop: -DS.space.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: DS.space.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    padding: DS.space.base,
    alignItems: 'center',
    gap: DS.space.xs,
    ...DS.shadow.card,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: DS.text,
    fontFamily: DS.font.display,
  },
  statLabel: {
    fontSize: 11,
    color: DS.muted,
    fontWeight: '600',
  },
  card: {
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.md,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    padding: DS.space.base,
    gap: DS.space.sm,
    ...DS.shadow.card,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: DS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.sm,
  },
  nameInput: {
    flex: 1,
    fontSize: 17,
    color: DS.text,
    borderWidth: 2,
    borderColor: DS.primary,
    borderRadius: DS.radius.md,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.sm,
    backgroundColor: DS.surface,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.md,
    paddingHorizontal: DS.space.md,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: DS.white,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameValue: {
    fontSize: 18,
    fontWeight: '700',
    color: DS.text,
  },
  petName: {
    fontSize: 20,
    fontWeight: '800',
    color: DS.text,
    fontFamily: DS.font.display,
  },
  petBreed: {
    ...DS.textCaption,
    color: DS.primary,
    fontWeight: '600',
    marginTop: -2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DS.space.sm,
    marginTop: DS.space.xs,
  },
  tag: {
    backgroundColor: 'rgba(255,107,157,0.08)',
    borderRadius: DS.radius.pill,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
  },
  tagText: {
    fontSize: 12,
    color: DS.primary,
    fontWeight: '600',
  },
  superlikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  superlikeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DS.text,
  },
  superlikeSub: {
    ...DS.textCaption,
    color: DS.muted,
    marginTop: 2,
  },
  getMoreBtn: {
    backgroundColor: DS.superlike,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getMoreText: {
    color: DS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  premiumCta: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DS.space.sm,
    ...DS.shadow.elevated,
  },
  premiumCtaText: {
    color: DS.white,
    fontWeight: '800',
    fontSize: 16,
    fontFamily: DS.font.display,
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: DS.space.md,
    marginTop: DS.space.sm,
  },
  resetText: {
    ...DS.textCaption,
    color: DS.muted,
  },
})
