import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit } from '../.models/Habit.model';
import { IonDatetime } from '@ionic/angular/standalone';
import { HabitLog } from '../.models/HabitLog.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  private http = inject(HttpClient);
  private apiUrl = 'https://elevate.koyeb.app/api/habit';  // Replace with your API URL

  getHabits(userId: string, pageNumber: number, pageSize: number): Observable<Habit[]> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });

    let params = new HttpParams()
      .set('userId', userId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Habit[]>(this.apiUrl, { headers: headers, params: params });
  }
  getHabitByID(habitId: string): Observable<any> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });

    return this.http.get(`${this.apiUrl}/${habitId}`, { headers: headers });
  }
  getTodaysHabitlogs(date: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    const userId = localStorage.getItem('userId') ?? '';
    const params = new HttpParams().set('userId', userId);

    return this.http.get(`https://elevate.koyeb.app/api/habitlog/${date}`, { headers: headers, params: params });
  }

  createHabit(habitData: any): Observable<Habit> {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    if (habitData.color.startsWith('#')) {
      habitData.color = habitData.color.slice(1);
    }

    return this.http.post<Habit>(`${this.apiUrl}`, habitData, { headers: headers });
  }

  editHabit(Editedhabit: Habit) {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    if (Editedhabit.color.startsWith('#')) {
      Editedhabit.color = Editedhabit.color.slice(1);
    }
    return this.http.patch(`${this.apiUrl}/${Editedhabit.id}`, Editedhabit, { headers: headers });

  }

  deleteHabit(id: string) {
    const token = localStorage.getItem('token');

    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: headers });
  }

  completeHabit(habitLogId: string, Ispublic : boolean): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Include the token in the headers
    });

    const body = {
      completed: true,
      isPublic: Ispublic
    };

    return this.http.patch(`https://elevate.koyeb.app/api/habitlog/${habitLogId}`, body, { headers: headers });
  }

  sendChallenge(habit: Habit, friendId: string):Observable<any> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Or however your backend expects the token
    });
    const UserId = localStorage.getItem('userId');

    const body = {
      userId: UserId,
      friendId: friendId,
      habit: habit
    };

    return this.http.post(`https://elevate.koyeb.app/api/challenge`, body, { headers: headers });
  }
}