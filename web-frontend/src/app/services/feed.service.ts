import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HabitLog } from '../models/habitlog.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'http://localhost:8080/api';
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getFeed(pageNumber: Number, pageSize: Number): Observable<HabitLog[]> {
    return this.http.get<HabitLog[]>(`${this.apiUrl}/feed`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      }
    });
  }
}
