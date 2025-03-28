import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { FriendRequest } from '../models/friendRequest.model';
import { Friendship } from '../models/friendship.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrl = environment.apiUrl;;

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  getFriends(): Observable<any> {
    const params = new HttpParams().set('userId', this.authService.getUserId() as string);

    return this.http.get(`${this.apiUrl}/friendship/${this.authService.getUserId()}/friends`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  sendFriendRequest(friendRequest: FriendRequest) {
    return this.http.post(`${this.apiUrl}/friendship`, friendRequest, {
      headers: this.getAuthHeaders(),
    });
  }

  getUsersByEmail(email: string) {
    const params = new HttpParams().set('email', email).set('pageNumber', 1).set('pageSize', 10);

    return this.http.get(`${this.apiUrl}/user`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  getFriendRequests() {
    return this.http.get(`${this.apiUrl}/friendship/${this.authService.getUserId()}/friend-requests`, {
      headers: this.getAuthHeaders(),
    });
  }

  patchFriendship(friendRequest: FriendRequest) {
    return this.http.patch(`${this.apiUrl}/friendship`, friendRequest, {
      headers: this.getAuthHeaders(),
    });
  }
}
