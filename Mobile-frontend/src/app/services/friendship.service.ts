import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../.models/user.model';
import { Observable } from 'rxjs';
import { Friendship } from '../.models/friendship.model';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  private apiUrl = 'https://elevate-backend.koyeb.app/api';

  constructor(private http: HttpClient) { }

  getFriends(): Observable<User[]> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    return this.http.get<User[]>(`${this.apiUrl}/friendship/${userId}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
  getFriendRequests(): Observable<User[]> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    return this.http.get<User[]>(`${this.apiUrl}/friendship/${userId}/friend-requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
  addFriend(friendId: string): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    const token = localStorage.getItem('token');
    return this.http.post<Friendship>(`${this.apiUrl}/friendship`, { userId, friendId }, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
  }

  friendShipStatus(friendId: string, accepted: boolean): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    const status = accepted ? 'accepted' : 'declined'; // Determine the status based on the accepted parameter
    const token = localStorage.getItem('token');


    return this.http.patch<Friendship>(`${this.apiUrl}/friendship`, { userId, friendId, status }, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
    });
  }

  deleteFriend(friendId: string): Observable<Friendship> {
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage
    const params = new HttpParams()
      .set('userId', userId!) // Add userId as a query parameter
      .set('friendId', friendId); // Add friendId as a query parameter

    const token = localStorage.getItem('token');


    return this.http.delete<Friendship>(`${this.apiUrl}/friendship`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      params: params, // Attach the query parameters
    });
  }
  getSentRequests(): Observable<Friendship[]> {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    return this.http.get<Friendship[]>(`${this.apiUrl}/friendship/${userId}/friend-requests-sent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
}
