import { Habit } from "./habit.model";
import { HabitLog } from "./habitlog.model";
import { User } from "./user.model";

export interface Post {
  user: User;
  habit: Habit;
  habitLog: HabitLog;
}