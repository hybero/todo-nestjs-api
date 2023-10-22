import { User } from "src/user/type/user.type";

export type List = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string | null;
    users: User[];
}