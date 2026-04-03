import { useLocalSearchParams } from 'expo-router'
import { ChatScreen } from '../../features/chat/ChatScreen'

export default function ChatRoute() {
  const { profileId } = useLocalSearchParams<{ profileId: string }>()
  return <ChatScreen profileId={profileId ?? ''} />
}
