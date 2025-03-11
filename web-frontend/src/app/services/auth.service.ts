import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token = localStorage.getItem('token');

  constructor(private http: HttpClient, private router: Router) {}

  private apiUrl = 'http://localhost:8080/api';

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveUserID(id: string) {
    localStorage.setItem('id', id);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  login(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, formResult);
  }

  crateAccount(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }

  getUserData(id: string | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getUserHabits(): Observable<any> {
    const userId = localStorage.getItem('id') ?? '';
    const params = new HttpParams().set('userId', userId).set('pageNumber', 1).set('pageSize', 20);

    return this.http.get(`${this.apiUrl}/habit`, {
      params,
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addNewTask(formResult: any): Observable<any> {
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
}
