import { FrequencyEnum } from "./habit.model";

export interface Challenge {
  id: string,
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
    streakProgression: string; 
  }
  status: string;
}