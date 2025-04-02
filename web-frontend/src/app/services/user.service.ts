import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  getUserData(id: string | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getHabits(): Observable<any> {
    const userId = this.authService.getUserId() ?? '';
    const params = new HttpParams().set('userId', userId).set('pageNumber', 1).set('pageSize', 20);

    return this.http.get(`${this.apiUrl}/habit`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  getHabitByID(habitId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/habit/${habitId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  addNewHabit(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/habit`, formResult, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteHabit(habitId: string) {
    return this.http.delete(`${this.apiUrl}/habit/${habitId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTodaysHabitlogs(date: string): Observable<any> {
    const userId = this.authService.getUserId() ?? '';
    const params = new HttpParams().set('userId', userId);

    return this.http.get(`${this.apiUrl}/habitlog/${date}`, {
      params,
      headers: this.getAuthHeaders(),
    });
  }

  updateHabitLog(habitlogId: string, formResult: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/habitlog/${habitlogId}`, formResult, {
      headers: this.getAuthHeaders(),
    });
  }
}
