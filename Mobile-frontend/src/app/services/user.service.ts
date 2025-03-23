import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../.models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'http://localhost:8080/api';
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      }
    });

  }
}
