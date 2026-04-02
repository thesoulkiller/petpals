import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { bubblegumColors } from '@my/config'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

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
            { backgroundColor: i < step ? bubblegumColors.primary : bubblegumColors.border },
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
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
})
