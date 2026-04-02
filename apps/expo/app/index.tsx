import { Redirect } from 'expo-router'
import { useAppContext } from 'app/context/AppContext'

export default function Index() {
  const { user } = useAppContext()

  if (!user.onboardingComplete) {
    return <Redirect href="/onboarding" />
  }

  return <Redirect href="/(tabs)/discover" />
}
