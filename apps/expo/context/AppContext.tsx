'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import type { LikeRecord, MatchEvent, PetProfile, SwipeDirection, UserState } from '../types/petpals'

// ---------------------------------------------------------------------------
// Haversine distance (km) between two lat/lng points
// ---------------------------------------------------------------------------
function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
interface AppState {
  user: UserState
  profiles: PetProfile[]
  likes: LikeRecord[]
  swipedIds: Set<string>
  pendingMatch: MatchEvent | null
}

type AppAction =
  | { type: 'SET_USER'; payload: Partial<UserState> }
  | { type: 'COMPLETE_ONBOARDING'; payload: UserState }
  | { type: 'SET_PROFILES'; payload: PetProfile[] }
  | { type: 'SWIPE'; payload: { profileId: string; direction: SwipeDirection } }
  | { type: 'CLEAR_MATCH' }
  | { type: 'SET_PREMIUM' }

const defaultUser: UserState = {
  id: 'user_local',
  ownerName: '',
  pet: null,
  location: null,
  superlikes: 3,
  isPremium: false,
  onboardingComplete: false,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } }

    case 'COMPLETE_ONBOARDING':
      return { ...state, user: { ...action.payload, onboardingComplete: true } }

    case 'SET_PROFILES':
      return { ...state, profiles: action.payload }

    case 'SWIPE': {
      const { profileId, direction } = action.payload
      const newSwipedIds = new Set(state.swipedIds)
      newSwipedIds.add(profileId)

      const likeType =
        direction === 'up'
          ? 'superlike'
          : direction === 'right'
            ? 'like'
            : 'dislike'

      // 30% chance of mutual match for likes/superlikes
      const isMatch =
        likeType !== 'dislike' && Math.random() < 0.3

      const record: LikeRecord = {
        id: `like_${Date.now()}_${profileId}`,
        targetProfileId: profileId,
        type: likeType,
        timestamp: Date.now(),
        isMatch,
      }

      const newLikes = [...state.likes, record]

      // Build match event if mutual
      const targetProfile = state.profiles.find((p) => p.id === profileId)
      const pendingMatch =
        isMatch && targetProfile && state.user.pet
          ? { targetProfile, userPetName: state.user.pet.name }
          : null

      // Deduct superlike from counter
      const superlikes =
        likeType === 'superlike'
          ? Math.max(0, state.user.superlikes - 1)
          : state.user.superlikes

      return {
        ...state,
        user: { ...state.user, superlikes },
        swipedIds: newSwipedIds,
        likes: newLikes,
        pendingMatch,
      }
    }

    case 'CLEAR_MATCH':
      return { ...state, pendingMatch: null }

    case 'SET_PREMIUM':
      return { ...state, user: { ...state.user, isPremium: true } }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------
interface AppContextValue {
  user: UserState
  profiles: PetProfile[]
  likes: LikeRecord[]
  remainingProfiles: PetProfile[]
  pendingMatch: MatchEvent | null
  swipe: (profileId: string, direction: SwipeDirection) => void
  updateUser: (patch: Partial<UserState>) => void
  completeOnboarding: (user: UserState) => void
  clearMatch: () => void
  setPremium: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
interface AppProviderProps {
  children: React.ReactNode
  initialProfiles: PetProfile[]
}

export function AppProvider({ children, initialProfiles }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    user: defaultUser,
    profiles: [],
    likes: [],
    swipedIds: new Set<string>(),
    pendingMatch: null,
  })

  // Load profiles on mount, enrich with distance if user has location
  useEffect(() => {
    const enriched = initialProfiles.map((p) => {
      if (state.user.location) {
        const distance = Math.round(
          haversineKm(
            state.user.location.lat,
            state.user.location.lng,
            p.location.lat,
            p.location.lng,
          ),
        )
        return { ...p, distance }
      }
      return p
    })
    dispatch({ type: 'SET_PROFILES', payload: enriched })
  }, [initialProfiles, state.user.location])

  const swipe = useCallback(
    (profileId: string, direction: SwipeDirection) => {
      dispatch({ type: 'SWIPE', payload: { profileId, direction } })
    },
    [],
  )

  const updateUser = useCallback((patch: Partial<UserState>) => {
    dispatch({ type: 'SET_USER', payload: patch })
  }, [])

  const completeOnboarding = useCallback((user: UserState) => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: user })
  }, [])

  const clearMatch = useCallback(() => {
    dispatch({ type: 'CLEAR_MATCH' })
  }, [])

  const setPremium = useCallback(() => {
    dispatch({ type: 'SET_PREMIUM' })
  }, [])

  const remainingProfiles = state.profiles.filter(
    (p) => !state.swipedIds.has(p.id),
  )

  return (
    <AppContext.Provider
      value={{
        user: state.user,
        profiles: state.profiles,
        likes: state.likes,
        remainingProfiles,
        pendingMatch: state.pendingMatch,
        swipe,
        updateUser,
        completeOnboarding,
        clearMatch,
        setPremium,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}
