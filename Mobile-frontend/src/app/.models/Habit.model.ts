export interface Habit {
    id: string;
    created_at: Date;
    title: string;
    description?: string;
    frequencyType: Frequency;
    customFrequency: number;
    color: string;
    is_positive: boolean;
    streak: number;
    streak_start?: Date;
    challengedFriends?: string[];

}
export enum Frequency {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Custom = 'custom'
}