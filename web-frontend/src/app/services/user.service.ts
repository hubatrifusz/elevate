import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getUserData(id: string | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getHabits(): Observable<any> {
    const userId = localStorage.getItem('id') ?? '';
    const params = new HttpParams().set('userId', userId).set('pageNumber', 1).set('pageSize', 20);

    return this.http.get(`${this.apiUrl}/habit`, {
      params,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getHabitByID(habitId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/habit/${habitId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addNewHabit(formResult: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.apiUrl}/habit`, formResult, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteHabit(habitId: string) {
    return this.http.delete(`${this.apiUrl}/habit/${habitId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getTodaysHabitlogs(date: string): Observable<any> {
    const userId = localStorage.getItem('id') ?? '';
    const params = new HttpParams().set('userId', userId);

    return this.http.get(`${this.apiUrl}/habitlog/${date}`, {
      params,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
