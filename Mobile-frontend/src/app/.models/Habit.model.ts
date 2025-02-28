export interface Habit {
    id: string;
    created_at: Date;
    title: string;
    description?: string;
    frequency: Frequency;
    custom_frequency: string;
    color: string;
    is_positive: boolean;
    streak: number;
    streak_start?: Date;
}
export enum Frequency {
    Daily,
    Weekly,
    Monthly,
    Yearly,
    Custom
}