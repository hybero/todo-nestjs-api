import { Task } from "src/task/type/task.type";
import { User } from "src/user/type/user.type";

export type List = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    users?: User[];
    tasks?: Task[];
}