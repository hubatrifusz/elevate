import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrl = 'http://localhost:8080/api';

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  getFriends(id: string | null): Observable<any> {
    const params = new HttpParams().set('userId', this.authService.getUserId() as string);

    return this.http.get(`${this.apiUrl}/friendship/${id}/friends`, {
      headers: this.getAuthHeaders(),
    });
  }
}
