import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import{ NegativeHabit } from '../.models/NegativeHabit.model';

@Injectable({
  providedIn: 'root'
})
export class NegativeHabitService {
  private http = inject(HttpClient);
  private apiUrl = 'https://elevate-backend.koyeb.app/api/habit/negative';
  
  constructor() { }

  getHabits(pageNumber: number, pageSize: number): Observable<NegativeHabit[]> {
    const token = localStorage.getItem('token');
  
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    const userId = localStorage.getItem('userId') ?? '';


    return this.http.get<NegativeHabit[]>(`${this.apiUrl}/${userId}`, { headers: headers, params: { userId, pageNumber, pageSize } })
  }
  
  createHabit( habit: NegativeHabit): Observable<NegativeHabit> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.post<NegativeHabit>(this.apiUrl, habit, { headers: headers });
  }

  resetHabit(habitId: string): Observable<NegativeHabit> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.patch<NegativeHabit>(`${this.apiUrl}/${habitId}`, {}, { headers: headers });
  }
  deleteHabit(habitId: string): Observable<NegativeHabit> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });
    return this.http.delete<NegativeHabit>(`${this.apiUrl}/${habitId}`, { headers: headers });
  }
}
