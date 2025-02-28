import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(private authService: AuthService) {}

  getData() {
    this.authService.getUserData(localStorage.getItem('id')).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (e) => console.log(e),
    });
  }
}
