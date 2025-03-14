export interface HabitLog {
  id: string;
  userId: string;
  habitId: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
  notes?: string;
  isPublic: boolean;
}
