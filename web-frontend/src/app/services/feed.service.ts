import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private apiUrl = 'http://localhost:8080/api';
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  getFeed(pageNumber: Number, pageSize: Number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/feed`, {
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
