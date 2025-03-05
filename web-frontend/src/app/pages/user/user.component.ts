import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  imports: [NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  constructor(private authService: AuthService) {}

  getUserData() {
    let userId = localStorage.getItem('id');
    this.authService.getUserData(userId).subscribe({
      next: (response) => {console.log(response)},
      error: (e) => {console.log(e)}
    });
  }

  logout() {
    this.authService.logout();
  }
}
