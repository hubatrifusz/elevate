export interface HabitLog {
    id: string;
    userId: string;
    habitId: string;
    dueDate: Date;
    completed: boolean;
    completedAt?: Date | null;
    notes?: string | null;
    isPublic: boolean;
}

