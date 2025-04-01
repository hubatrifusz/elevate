import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Post} from '../.models/post.model';
import { User } from '../.models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FriendsFeedService {

  private apiUrl = 'https://elevate.koyeb.app/api';
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
