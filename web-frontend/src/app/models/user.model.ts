export interface User {
  id: string;
  createdAt?: Date;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: Uint8Array;
  longestStreak: number;
}
