import { Habit } from './Habit.model';
import { User } from './user.model';


export interface Challenge {
    id: string;
    userId: string;
    friendId: string;
    habit: Habit;
    status: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
}