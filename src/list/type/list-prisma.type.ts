import { Task } from "src/task/type/task.type";
import { User } from "src/user/type/user.type";

export type ListPrisma = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    users?: ({ user: User } & { id: number; userId: number; listId: number })[];
    tasks?: Task[];
}