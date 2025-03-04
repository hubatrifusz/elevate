import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit } from '../.models/Habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/habit';  // Replace with your API URL

  getHabits(userId: string, pageNumber: number, pageSize: number): Observable<Habit[]> {
    const token = localStorage.getItem('token'); // Or retrieve from @ionic/storage

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });

    let params = new HttpParams()
      .set('userId', userId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Habit[]>(this.apiUrl, { headers: headers, params: params });
  }

  createHabit(habitData: any): Observable<Habit> {
    const token = localStorage.getItem('token'); // Or retrieve from @ionic/storage

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });

    return this.http.post<Habit>(this.apiUrl, habitData, { headers: headers });
  }
}