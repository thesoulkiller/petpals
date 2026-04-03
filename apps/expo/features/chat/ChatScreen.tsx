import React, { useState, useRef } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'tamagui'
import { useRouter } from 'expo-router'
import { DS } from '../../theme'
import { useAppContext } from '../../context/AppContext'

interface Message {
  id: string
  text: string
  fromMe: boolean
  timestamp: number
}

const STUB_REPLIES = [
  'Aww, they sound adorable! 🐾',
  'My dog would love that!',
  'We should set up a playdate sometime!',
  'What breed is your pup?',
  'That is so cute omg 😍',
  'Same! Our pets would get along so well.',
  'Haha yes! Dogs are the best 🐶',
]

interface ChatScreenProps {
  profileId: string
}

export function ChatScreen({ profileId }: ChatScreenProps) {
  const router = useRouter()
  const { profiles, user } = useAppContext()
  const profile = profiles.find((p) => p.id === profileId)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'stub_0',
      text: `Hey! We matched 💕 Can't wait to introduce our pets!`,
      fromMe: false,
      timestamp: Date.now() - 60000,
    },
  ])
  const [inputText, setInputText] = useState('')
  const listRef = useRef<FlatList<Message>>(null)

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Profile not found.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  function sendMessage() {
    const text = inputText.trim()
    if (!text) return

    const myMsg: Message = {
      id: `msg_${Date.now()}`,
      text,
      fromMe: true,
      timestamp: Date.now(),
    }

    setMessages((prev) => {
      const next = [...prev, myMsg]

      // Stub auto-reply after short delay
      setTimeout(() => {
        const reply: Message = {
          id: `reply_${Date.now()}`,
          text: STUB_REPLIES[Math.floor(Math.random() * STUB_REPLIES.length)],
          fromMe: false,
          timestamp: Date.now(),
        }
        setMessages((p) => [...p, reply])
        listRef.current?.scrollToEnd({ animated: true })
      }, 1000 + Math.random() * 800)

      return next
    })

    setInputText('')
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50)
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{profile.ownerName}</Text>
          <Text style={styles.headerSub}>{profile.pet.name} · {profile.pet.breed}</Text>
        </View>
        <View style={styles.matchPill}>
          <Text style={styles.matchPillText}>💕 Match</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Message list */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, item.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                {item.text}
              </Text>
            </View>
          )}
        />

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message ${profile.ownerName}...`}
            placeholderTextColor={DS.muted}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            activeOpacity={0.8}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendBtnText}>🐾</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.surface,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.md,
    borderBottomWidth: 1,
    borderBottomColor: DS.cardBorder,
    backgroundColor: DS.cardBg,
    gap: DS.space.sm,
  },
  backBtn: {
    padding: DS.space.xs,
  },
  backArrow: {
    fontSize: 22,
    color: DS.primary,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '800',
    color: DS.text,
    fontFamily: DS.font.display,
  },
  headerSub: {
    fontSize: 12,
    color: DS.muted,
    fontWeight: '500',
    marginTop: 1,
  },
  matchPill: {
    backgroundColor: 'rgba(255,107,157,0.12)',
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.md,
    paddingVertical: DS.space.xs,
    borderWidth: 1,
    borderColor: DS.cardBorder,
  },
  matchPillText: {
    fontSize: 11,
    color: DS.primary,
    fontWeight: '700',
  },
  messageList: {
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.md,
    gap: DS.space.sm,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.sm,
    marginBottom: DS.space.sm,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: DS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: DS.cardBg,
    borderWidth: 1,
    borderColor: DS.cardBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  bubbleTextMe: {
    color: DS.white,
    fontWeight: '500',
  },
  bubbleTextThem: {
    color: DS.text,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DS.space.base,
    paddingVertical: DS.space.sm,
    borderTopWidth: 1,
    borderTopColor: DS.cardBorder,
    backgroundColor: DS.cardBg,
    gap: DS.space.sm,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: DS.surface,
    borderRadius: DS.radius.pill,
    paddingHorizontal: DS.space.base,
    fontSize: 15,
    color: DS.text,
    borderWidth: 1,
    borderColor: DS.cardBorder,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: DS.radius.pill,
    backgroundColor: DS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: DS.cardBorder,
  },
  sendBtnText: {
    fontSize: 20,
  },
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: DS.space.base,
  },
  errorText: {
    fontSize: 16,
    color: DS.muted,
  },
  backBtnText: {
    color: DS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
})
