import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http= inject(HttpClient)
  private apiUrl = 'https://elevate.koyeb.app/api';  
  userUpdated = new EventEmitter<void>();


  saveToken(token: string) {
    localStorage.setItem('token', token);
    console.log(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login-page']).then(() => {
      // Reload the app to ensure fresh state
      window.location.reload();
    });
  }
  
  login(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, formResult).pipe(
      tap((response: any) => {
        this.saveToken(response.token); // Save the token
        localStorage.setItem('userId', response.userId); // Save the user ID
        this.userUpdated.emit(); // Emit the event after login
      })
    );
  }
  postNewUser(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }

  
}
