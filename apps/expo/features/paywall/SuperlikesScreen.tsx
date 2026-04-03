'use client'

import React from 'react'
import { StyleSheet, Alert, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { ChevronLeft, Star } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'

interface PackCardProps {
  count: number
  price: string
  popular?: boolean
  onPress: () => void
}

function PackCard({ count, price, popular, onPress }: PackCardProps) {
  return (
    <View style={[styles.packCard, popular && styles.packCardPopular]}>
      {popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>⭐ Popular</Text>
        </View>
      )}

      <View style={styles.packLeft}>
        <View style={[styles.packIconRing, popular && styles.packIconRingPopular]}>
          <Star color={popular ? DS.white : DS.superlike} size={24} />
        </View>
        <View style={styles.packInfo}>
          <Text style={[styles.packCount, popular && styles.packTextWhite]}>
            {count} Superlikes
          </Text>
          <Text style={[styles.packPerPrice, popular && styles.packPerPriceWhite]}>
            ${(parseFloat(price.replace('$', '')) / count).toFixed(2)} per superlike
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={[styles.packBtn, popular && styles.packBtnPopular]}
        activeOpacity={0.85}
      >
        <Text style={[styles.packBtnText, popular && styles.packBtnTextPopular]}>
          {price}
        </Text>
      </TouchableOpacity>
    </View>
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
      <View style={styles.container}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.navBack}
            activeOpacity={0.7}
          >
            <ChevronLeft color={DS.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Get Superlikes ⭐</Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Current balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View style={styles.balanceRow}>
              <Star color={DS.superlike} size={28} />
              <Text style={styles.balanceCount}>{user.superlikes}</Text>
              <Text style={styles.balanceUnit}>superlikes</Text>
            </View>
          </View>

          {/* Explanation */}
          <View style={styles.explainBlock}>
            <Text style={styles.explainTitle}>Stand out with a Superlike ⭐</Text>
            <Text style={styles.explainBody}>
              Superlikes let pets know you're extra interested. Profiles you superlike see your pet
              first — and are 3× more likely to match!
            </Text>
          </View>

          {/* Packs */}
          <View style={styles.packs}>
            {packs.map((pack) => (
              <PackCard
                key={pack.count}
                count={pack.count}
                price={pack.price}
                popular={pack.popular}
                onPress={() => handleBuy(pack.count, pack.price)}
              />
            ))}
          </View>

          <Text style={styles.legal}>
            Payment stub — no real charges will be made.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.surface },
  container: { flex: 1, backgroundColor: DS.surface },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.space.base,
    paddingTop: DS.space.md,
    paddingBottom: DS.space.sm,
  },
  navBack: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    ...DS.text_section,
    fontFamily: DS.font.display,
    color: DS.text,
    flex: 1,
    textAlign: 'center',
  },
  navSpacer: { width: 40 },
  scroll: {
    paddingHorizontal: DS.space.base,
    paddingBottom: DS.space.xxl,
    gap: DS.space.xl,
  },
  balanceCard: {
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.card,
    padding: DS.space.base,
    alignItems: 'center',
    gap: DS.space.sm,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    ...DS.shadow.card,
  },
  balanceLabel: {
    ...DS.text_caption,
    color: DS.muted,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.sm,
  },
  balanceCount: {
    fontSize: 36,
    fontWeight: '900',
    color: DS.text,
  },
  balanceUnit: {
    ...DS.text_body,
    color: DS.muted,
  },
  explainBlock: { gap: DS.space.sm },
  explainTitle: {
    ...DS.text_section,
    fontFamily: DS.font.display,
    color: DS.text,
  },
  explainBody: {
    ...DS.text_body,
    color: DS.muted,
    lineHeight: 22,
  },
  packs: { gap: DS.space.base },
  packCard: {
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.card,
    padding: DS.space.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: DS.cardBorder,
    ...DS.shadow.card,
  },
  packCardPopular: {
    backgroundColor: DS.superlike,
    borderColor: DS.superlike,
    ...DS.shadow.elevated,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: DS.space.base,
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: 3,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DS.white,
  },
  packLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.md,
    flex: 1,
  },
  packIconRing: {
    width: 52,
    height: 52,
    borderRadius: DS.radius.pill,
    backgroundColor: 'rgba(255,209,102,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packIconRingPopular: {
    backgroundColor: 'rgba(255,255,255,0.30)',
  },
  packInfo: { gap: 2 },
  packCount: {
    fontSize: 18,
    fontWeight: '900',
    color: DS.text,
  },
  packTextWhite: { color: DS.white },
  packPerPrice: {
    fontSize: 13,
    color: DS.muted,
  },
  packPerPriceWhite: { color: 'rgba(255,255,255,0.75)' },
  packBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.base,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packBtnPopular: {
    backgroundColor: DS.white,
  },
  packBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: DS.white,
  },
  packBtnTextPopular: {
    color: '#C8960A', // dark gold to pair with white button on superlike background
  },
  legal: {
    ...DS.text_micro,
    color: DS.muted,
    textAlign: 'center',
    paddingHorizontal: DS.space.xl,
    opacity: 0.7,
  },
})
