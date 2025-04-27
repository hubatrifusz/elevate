import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../.models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'https://elevate.koyeb.app/api';

  constructor(private http: HttpClient) { }
  getUserById(userId: string): Observable<User> {
    const token = localStorage.getItem('token'); // Retrieve token dynamically
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
  getUsersByEmail(email: string, pageNumber: number, pageSize: number): Observable<User[]> {
    const token = localStorage.getItem('token'); // Retrieve token dynamically

    return this.http.get<User[]>(`${this.apiUrl}/user`, {
      params: {
        email: email,
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
  editUser(profilePictureBase64 : string){
    const token = localStorage.getItem('token'); // Retrieve token dynamically
    const userId = localStorage.getItem('userId'); // Retrieve userId dynamically

    return this.http.patch<User>(`${this.apiUrl}/user/${userId}`, { profilePictureBase64 }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  }
}
