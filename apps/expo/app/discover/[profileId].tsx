import { useLocalSearchParams } from 'expo-router'
import { ProfileDetailScreen } from '../../features/discover/ProfileDetailScreen'

export default function ProfileDetailRoute() {
  const { profileId } = useLocalSearchParams<{ profileId: string }>()
  return <ProfileDetailScreen profileId={profileId ?? ''} />
}
