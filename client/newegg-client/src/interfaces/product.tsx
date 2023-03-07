import { ProductReview } from "./review"
import { Shop } from "./shop"

export interface Product{
  id: string
  name: string
  images: ProductImage[]
  description: string
  price: number
  discount: number
  stock: number
  metadata: string
  createdAt: Date
  validTo: Date
  category: Category
  shop: Shop
  groupId: string
  brandId: string
  reviews: ProductReview[]
}

export interface Category{
  id: string
  name: string
}

export interface ProductImage{
  id: string
  image: string
}

export interface ProductBrand{
  id: string
  name: string
  logo: string
}
