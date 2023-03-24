import { Shop } from "./shop"
import { User } from "./user"

export interface UserChat{
  id: string
  createdAt: Date
  seller: Shop
  customer: User
  messages: UserMessage[]
}

export interface SupportChat{
  id: string
  createdAt: Date
  customer: User
  isResolved: boolean
  topicTags: string
  messages: SupportMessage[]
}

export interface SupportMessage{
  id: string
  isStaffMessage: boolean
  createdAt: Date
  chat: SupportChat
  text: string
  fileURL: string
  imageURL: string
}

export interface UserMessage{
  id: string
  isSellerMessage: boolean
  createdAt: Date
  chat: UserChat
  text: string
  fileURL: string
  imageURL: string
}

export interface Notification{
  id: string
  createdAt: Date
  fromName: string
  user: User
  text: string
  isRead: boolean
}
