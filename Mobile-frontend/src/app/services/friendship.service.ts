import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../.models/user.model';
import { Observable } from 'rxjs';
import { Friendship } from '../.models/friendship.model';

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
  addFriend(friendId: string): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    return this.http.post<Friendship>(`${this.apiUrl}/friendship`, { userId, friendId }, {
      headers: {
        Authorization: `Bearer ${this.token}`, // Include the token in the headers
      },
    });
  }

  friendShipStatus(friendId: string, accepted: boolean): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    const status = accepted ? 'accepted' : 'declined'; // Determine the status based on the accepted parameter

    return this.http.patch<Friendship>(`${this.apiUrl}/friendship`, { userId, friendId, status }, {
      headers: {
        Authorization: `Bearer ${this.token}`, // Include the token in the headers
      },
    });
  }

  deleteFriend(friendId: string): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    const params = new HttpParams()
      .set('userId', userId!) // Add userId as a query parameter
      .set('friendId', friendId); // Add friendId as a query parameter

    return this.http.delete<Friendship>(`${this.apiUrl}/friendship`, {
      headers: {
        Authorization: `Bearer ${this.token}`, // Include the token in the headers
      },
      params: params, // Attach the query parameters
    });
  }
}
