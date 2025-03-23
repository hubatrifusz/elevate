export interface User {
    id: string;
    createdAt?: Date;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureBase64?: string;
    longestStreak: number;
}
