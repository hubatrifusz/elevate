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

  saveToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  saveUserID(id: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('id', id);
    } else {
      sessionStorage.setItem('id', id);
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  login(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, formResult);
  }

  crateAccount(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getUserId(): string | null{
    return localStorage.getItem('id') || sessionStorage.getItem('id');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
