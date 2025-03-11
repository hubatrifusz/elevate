export interface Habit {
  id: string;
  userId: string;
  createdAt: Date;
  title: string;
  description?: string;
  frequency: FrequencyEnum;
  customFrequency?: number;
  color: string;
  isPositive: boolean;
  streak: number;
  streakStart?: Date;
  deleted: boolean;
}

export enum FrequencyEnum {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Custom = 'Custom',
}
