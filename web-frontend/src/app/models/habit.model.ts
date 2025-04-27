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

export interface NegativeHabit {
  id: string;
  userId: string;
  updatedAt: string | Date;
  title: string;
  description?: string;
  color: string;
}

export enum FrequencyEnum {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Custom = 'Custom',
}
