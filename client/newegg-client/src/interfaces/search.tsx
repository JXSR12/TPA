import { User } from "./user"

export interface SearchQuery{
  id: string
  query: string
  count: number
}

export interface UserSearch{
  search: SearchQuery
  user: User
  createdAt: Date
}
