export interface PetTag {
  id: string
  label: string
  emoji: string
}

export interface Pet {
  id: string
  name: string
  breed: string
  age: number // in years
  description: string
  photos: string[] // URLs
  tags: PetTag[]
  ownerId: string
}

export interface GeoLocation {
  lat: number
  lng: number
  city: string
}

export interface PetProfile {
  id: string
  ownerName: string
  ownerAge: number
  pet: Pet
  location: GeoLocation
  distance?: number // km, computed at runtime
}

export interface UserState {
  id: string
  ownerName: string
  pet: Pet | null
  location: { lat: number; lng: number } | null
  superlikes: number       // starts at 3 (free tier); unlimited for premium
  dailyLikesRemaining: number // 20/day for free; unlimited for premium
  isPremium: boolean
  onboardingComplete: boolean
}

export interface LikeRecord {
  id: string
  targetProfileId: string
  type: 'like' | 'superlike' | 'dislike'
  timestamp: number
  isMatch: boolean
}

export type SwipeDirection = 'left' | 'right' | 'up' // up = superlike

export interface MatchEvent {
  targetProfile: PetProfile
  userPetName: string
}

export const AVAILABLE_TAGS: PetTag[] = [
  { id: 'playful', label: 'Playful', emoji: '🎾' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'social', label: 'Social', emoji: '🐾' },
  { id: 'active', label: 'Active', emoji: '🏃' },
  { id: 'cuddly', label: 'Cuddly', emoji: '🤗' },
  { id: 'outdoor', label: 'Outdoor lover', emoji: '🌿' },
  { id: 'indoor', label: 'Indoor cat', emoji: '🏠' },
  { id: 'trained', label: 'Well trained', emoji: '🎓' },
  { id: 'kid_friendly', label: 'Kid-friendly', emoji: '👶' },
  { id: 'dog_friendly', label: 'Dog-friendly', emoji: '🐶' },
]

export const PRESET_PHOTOS = [
  'https://picsum.photos/seed/pet1/400/500',
  'https://picsum.photos/seed/pet2/400/500',
  'https://picsum.photos/seed/pet3/400/500',
  'https://picsum.photos/seed/pet4/400/500',
  'https://picsum.photos/seed/pet5/400/500',
  'https://picsum.photos/seed/pet6/400/500',
]
