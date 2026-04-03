import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { DS } from '../../theme'

// Tab icon: use emoji to sidestep Tamagui icon color token constraints
function DiscoverIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>🔍</Text>
}
function LikesIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>💕</Text>
}
function ProfileIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>🐾</Text>
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: DS.primary,
        tabBarInactiveTintColor: DS.muted,
        tabBarStyle: {
          backgroundColor: DS.white,
          borderTopColor: DS.cardBorder,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => <DiscoverIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Likes',
          tabBarIcon: ({ focused }) => <LikesIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />
    </Tabs>
  )
}
