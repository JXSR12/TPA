import { Product } from "./product"
import { User } from "./user"

export interface Shop{
  id: string
  name: string
  description: string
  address: string
  profilePic: string
  user: User
  banner: string
  products: Product[]
}
