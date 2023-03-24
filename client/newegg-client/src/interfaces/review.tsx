import { Product } from "./product";
import { User } from "./user";

export interface ProductReview{
  id: string
  user: User
  product: Product
  rating: number
  description: string
  isAnonymous: boolean
  createdAt: Date
  onTimeDelivery: boolean
  productAccuracy: boolean
  serviceSatisfaction: boolean
}

export interface SupportChatReview{
  id: string
  user: User
  rating: number
  description: string
  createdAt: Date
}
