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
}
