import { FrequencyEnum } from "./habit.model";

export interface Challenge {
  userId: string;
  friendId: string;
  habit: {
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
    challengedFriends?: string[];
  }
  status: string;
}