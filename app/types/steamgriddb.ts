export interface SteamGridDBAuthor {
  name: string
  steam64: string
  avatar: string
}

export interface SteamGridDBIcon {
  id: number
  score: number
  style: 'alternate' | 'blurred' | 'white_logo' | 'material' | 'custom' | string
  url: string
  thumb: string
  tags: string[]
  author: SteamGridDBAuthor
}

export interface SteamGridDBIconsResponse {
  success: boolean
  data: SteamGridDBIcon[]
}

export interface SteamGridDBLogo {
  id: number
  score: number
  style: 'official' | 'white' | 'black' | 'custom' | string
  url: string
  thumb: string
  tags: string[]
  author: SteamGridDBAuthor
}

export interface SteamGridDBLogosResponse {
  success: boolean
  data: SteamGridDBLogo[]
}