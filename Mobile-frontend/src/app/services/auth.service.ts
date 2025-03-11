import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http= inject(HttpClient)
  private apiUrl = 'http://localhost:8080/api';  // Replace with your API URL

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
  }
  
  login(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, formResult);
  }

  async getUserInfo() {
    const token = localStorage.getItem('token'); // Or retrieve from @ionic/storage

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });

    try {
      const response: any = await this.http.get(`${this.apiUrl}/user/${localStorage.getItem('userId')}`, { headers }).toPromise();
      localStorage.setItem('userInfo', JSON.stringify(response));
      if (response.firstName && response.lastName) {
        const username = `${response.firstName} ${response.lastName}`;
        localStorage.setItem('userName', username);
      }
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }
}
