import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.prod';
import { Habit, NegativeHabit } from '../models/habit.model';
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

  getChallengesByHabitId(habitId: string): Observable<Challenge[]> {
    const userId = this.authService.getUserId();

    return this.http.get<Challenge[]>(`${this.apiUrl}/challenge/${userId}/challenge-invites-sent`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      map((response: Challenge[]) => {
        return response.filter(invite => invite.habit.id === habitId);
      }),
      catchError(error => {
        console.log('No challenges found, returning empty array');
        return of([]);
      })
    );
  }

  getChallengeInvites(): Observable<Challenge[]> {
    const userId = this.authService.getUserId();

    return this.http.get<Challenge[]>(`${this.apiUrl}/challenge/${userId}/challenge-invites`, {
      headers: this.getAuthHeaders()
    });
  }

  acceptChallenge(challenge: Challenge): Observable<Challenge> {
    const userId = this.authService.getUserId();
    challenge.status = "Accepted";
    challenge.friendId = userId!;

    return this.http.patch<Challenge>(`${this.apiUrl}/challenge`, challenge, {
      headers: this.getAuthHeaders(),
    });
  }

  declineChallenge(challenge: Challenge): Observable<Challenge> {
    const userId = this.authService.getUserId();
    challenge.status = "Declined";
    challenge.friendId = userId!;

    return this.http.patch<Challenge>(`${this.apiUrl}/challenge`, challenge, {
      headers: this.getAuthHeaders(),
    });
  }

  getNegativeHabits(): Observable<NegativeHabit[]> {
    const userId = this.authService.getUserId();
    const params = new HttpParams()
      .set('pageNumber', 1)
      .set('pageSize', 20);

    return this.http.get<NegativeHabit[]>(`${this.apiUrl}/habit/negative/${userId}`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }
}
