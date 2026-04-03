import React from 'react'
import { View, StyleSheet } from 'react-native'
import { DS } from '../../theme'

interface OnboardingProgressProps {
  step: number   // 1-based
  total: number
}

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: i < step ? DS.primary : DS.cardBorder },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: DS.space.xl,
    paddingTop: DS.space.md,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
})
