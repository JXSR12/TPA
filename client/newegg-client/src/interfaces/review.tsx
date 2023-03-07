import { User } from "./user";

export interface ProductReview{
  id: string
  user: User
  rating: number
  description: string
  isAnonymous: boolean
}
