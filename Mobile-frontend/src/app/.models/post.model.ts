import { User } from "./user.model";
import { Habit } from "./Habit.model";
import { HabitLog } from "./HabitLog.model";

export interface Post {
    user: User;
    habit: Habit;
    habitLog: HabitLog;
}