import { Product } from "./product";
import { User } from "./user";

export interface CartItem{
  product: Product
  user: User
  quantity: number
}
