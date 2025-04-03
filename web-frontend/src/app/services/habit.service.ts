import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.prod';
import { Habit } from '../models/habit.model';
import { Challenge } from '../models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  getHabits(): Observable<Habit[]> {
    const userId = this.authService.getUserId();
    const params = new HttpParams()
      .set('userId', userId as string)
      .set('pageNumber', 1)
      .set('pageSize', 20);

    return this.http.get<Habit[]>(`${this.apiUrl}/habit`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  sendChallenge(habit: Habit, friendId: string): Observable<any> {
    const userId = this.authService.getUserId();

    const challenge = {
      userId: userId,
      friendId: friendId,
      habit: habit
    };

    return this.http.post(`${this.apiUrl}/challenge`, challenge, {
      headers: this.getAuthHeaders(),
    });
  }

  getChallengeByHabitId(habitId: string): Observable<Challenge | null> {
    const userId = this.authService.getUserId();

    const sentChallengeInvites: Observable<Challenge[]> = this.http.get<Challenge[]>(`${this.apiUrl}/challenge/${userId}/challenge-invites-sent`, {
      headers: this.getAuthHeaders(),
    });

    return sentChallengeInvites.pipe(
      map((response: Challenge[]) => response.find((invite: Challenge) => invite.habit.id === habitId)!)
    );
  }
}
