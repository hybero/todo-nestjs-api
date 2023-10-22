import { List } from "src/list/type/list.type"

export type User = {
    id: number        
    createdAt: Date
    updatedAt: Date
    email: string
    hash: string
    firstName: string | null
    lastName: string | null
    refreshToken: string
    lists: List[]
}