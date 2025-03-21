export interface HabitLog {
  id: string;
  userId: string;
  habitId: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  isPublic: boolean;
}
