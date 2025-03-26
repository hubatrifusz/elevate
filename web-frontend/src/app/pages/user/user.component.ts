import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  imports: [NavbarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  constructor(private authService: AuthService, private userService: UserService) {}

  userData!: User;

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    let userId = localStorage.getItem('id');
    this.userService.getUserData(userId).subscribe({
      next: (response) => this.userData = response as User,
      error: (e) => {
        console.log(e);
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
