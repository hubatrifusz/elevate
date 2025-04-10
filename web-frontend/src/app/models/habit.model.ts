export interface Habit {
  id: string;
  userId: string;
  createdAt: Date;
  title: string;
  description?: string;
  frequencyType: FrequencyEnum;
  customFrequency?: number;
  color: string;
  isPositive: boolean;
  streak: number;
  streakStart?: Date;
  deleted: boolean;
  streakProgression: string; // Format: "x/y" where x is completed and y is total
}

export enum FrequencyEnum {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Custom = 'Custom',
}
