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
  shopId: string
  groupId: string
  brandId: string
}

export interface Category{
  id: string
  name: string
}

export interface ProductImage{
  id: string
  image: string
}
