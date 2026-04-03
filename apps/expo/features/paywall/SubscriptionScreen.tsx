'use client'

import React from 'react'
import { StyleSheet, Alert, ScrollView, View, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { Check, ChevronLeft, Crown } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'

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
    <View style={[styles.tierCard, highlighted && styles.tierCardHighlighted]}>
      {badge && (
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.tierHeader}>
        <Text style={[styles.tierTitle, highlighted && styles.tierTextWhite]}>{title}</Text>
        <View style={styles.tierPriceRow}>
          <Text style={[styles.tierPrice, highlighted && styles.tierTextWhite]}>{price}</Text>
          <Text style={[styles.tierPeriod, highlighted && styles.tierPeriodWhite]}>/{period}</Text>
        </View>
      </View>

      <View style={styles.featureList}>
        {features.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Check
              color={highlighted ? DS.white : DS.match}
              size={16}
            />
            <Text style={[styles.featureText, highlighted && styles.featureTextWhite]}>
              {f}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onPress}
        style={[styles.tierBtn, highlighted && styles.tierBtnHighlighted]}
        activeOpacity={0.85}
      >
        <Text style={[styles.tierBtnText, highlighted && styles.tierBtnTextHighlighted]}>
          {title === 'Free' ? 'Current Plan' : `Subscribe — ${price}/${period}`}
        </Text>
      </TouchableOpacity>
    </View>
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
          <Text style={styles.navTitle}>Go Premium 💎</Text>
          <View style={styles.navSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.hero}>
            <Crown color={DS.superlike} size={48} />
            <Text style={styles.heroTitle}>Find your pet's perfect match</Text>
            <Text style={styles.heroSubtitle}>
              Unlock all features and help your furry friend find their forever playmate.
            </Text>
          </View>

          {/* Tier cards */}
          <View style={styles.tiers}>
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
          </View>

          <Text style={styles.legal}>
            Subscriptions auto-renew unless cancelled 24 hours before renewal.{'\n'}
            Payment stub — no real charges.
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
  hero: {
    alignItems: 'center',
    paddingVertical: DS.space.base,
    gap: DS.space.sm,
  },
  heroTitle: {
    ...DS.text_title,
    fontFamily: DS.font.display,
    color: DS.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...DS.text_body,
    color: DS.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  tiers: { gap: DS.space.lg },
  tierCard: {
    backgroundColor: DS.cardBg,
    borderRadius: DS.radius.card,
    padding: DS.space.lg,
    gap: DS.space.base,
    borderWidth: 1.5,
    borderColor: DS.cardBorder,
    ...DS.shadow.card,
  },
  tierCardHighlighted: {
    backgroundColor: DS.primary,
    borderColor: DS.primary,
    ...DS.shadow.elevated,
  },
  tierBadge: {
    position: 'absolute',
    top: -13,
    alignSelf: 'center',
    backgroundColor: DS.superlike,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: 3,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D1B00',
  },
  tierHeader: { gap: 4 },
  tierTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DS.text,
  },
  tierTextWhite: { color: DS.white },
  tierPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  tierPrice: {
    fontSize: 30,
    fontWeight: '900',
    color: DS.text,
  },
  tierPeriod: {
    fontSize: 13,
    color: DS.muted,
  },
  tierPeriodWhite: { color: 'rgba(255,255,255,0.70)' },
  featureList: { gap: DS.space.sm },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DS.space.sm,
  },
  featureText: {
    ...DS.text_body,
    color: DS.text,
    flex: 1,
  },
  featureTextWhite: { color: 'rgba(255,255,255,0.90)' },
  tierBtn: {
    backgroundColor: DS.primary,
    borderRadius: DS.radius.pill,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: DS.space.sm,
  },
  tierBtnHighlighted: {
    backgroundColor: DS.white,
  },
  tierBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: DS.white,
  },
  tierBtnTextHighlighted: {
    color: DS.primary,
  },
  legal: {
    ...DS.text_micro,
    color: DS.muted,
    textAlign: 'center',
    paddingHorizontal: DS.space.xl,
    opacity: 0.7,
    lineHeight: 18,
  },
})
