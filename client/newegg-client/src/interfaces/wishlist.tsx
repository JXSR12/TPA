import { Product } from "./product"
import { User } from "./user"

export interface WishlistItem{
  product: Product
}

export interface Wishlist{
  id: string
  title: string
  type: string
  user: User
  items: WishlistItem[]
}
