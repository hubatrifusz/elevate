import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Habit } from '../.models/Habit.model';
import { Observable } from 'rxjs';
import { Challenge } from '../.models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private router = inject(Router);
  private http = inject(HttpClient)
  private apiUrl = 'https://elevate.koyeb.app/api';
  constructor() { }

  sendChallenge(habit: Habit, friendId: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    const UserId = localStorage.getItem('userId');

    const body = {
      userId: UserId,
      friendId: friendId,
      habit: habit
    };

    return this.http.post(`${this.apiUrl}/challenge`, body, { headers: headers });
  }
  getChallengeRequest(): Observable<Challenge[]> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    const UserId = localStorage.getItem('userId');
    return this.http.get<Challenge[]>(`${this.apiUrl}/challenge/${UserId}/challenge-invites`, { headers: headers });
  }
  statusChallenge(challenge: Challenge, status: 'accepted' | 'rejected'): Observable<Challenge> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Add authorization header
    });

    // Construct the payload
    const payload = {
      userId: userId,
      friendId: challenge.friendId,
      habit: challenge.habit,
      status: status // Use 'accepted' or 'rejected'
    };

    // Send the PATCH request
    return this.http.patch<Challenge>(`${this.apiUrl}/challenge`, payload, { headers: headers });
  }

}
