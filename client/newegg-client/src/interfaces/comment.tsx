import { User } from "./user"

export interface WishlistComment{
  id: string
  content: string
  date: Date
  user: User
}
