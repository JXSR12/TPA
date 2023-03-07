import { Address } from "./address"
import { PaymentMethod } from "./paymentmethod"
import { Product } from "./product"
import { Shipment } from "./shipment"
import { User } from "./user"

export interface TransactionDetail{
  product: Product
  quantity: number
  notes: string
}

export interface TransactionHeader{
  id: string
  date: Date
  user: User
  shipment: Shipment
  paymentMethod: PaymentMethod
  address: Address
  status: string
  transactionDetails: TransactionDetail[]
}
