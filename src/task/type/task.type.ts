import { List } from "src/list/type/list.type"
import { User } from "src/user/type/user.type"

export type Task = {
    id: number
    createdAt: Date
    updatedAt: Date
    listId: number
    userId: number
    title: string,
    description: string,
    flag: string
    deadline: Date
    list?: List
    user?: User
}