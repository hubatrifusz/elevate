import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../.models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private apiUrl = 'http://localhost:8080/api';
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getFriends(): Observable<User[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<User[]>(`${this.apiUrl}/friendship/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      }
    });
  }
  getFriendRequests(): Observable<User[]> {
    const userId = localStorage.getItem('userId');
    return this.http.get<User[]>(`${this.apiUrl}/friendship/${userId}/friend-requests`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      }
    });
  }
  // startFriendShip(friendId: string): Observable<any> {

}
