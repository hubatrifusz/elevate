import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  id: string | null = null;

  navbarImageSrc: string = 'images/default_profile_picture.jpg';

  ngOnInit() {
    this.id = this.authService.getUserId();
    this.loadProfilePicture();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadProfilePicture() {
    let profilePictureBase64: string = '';

    this.userService.getUserData(this.authService.getUserId()).subscribe({
      next: (response) => {
        profilePictureBase64 = response.profilePictureBase64;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.navbarImageSrc = profilePictureBase64 ? 'data:image/png;base64,' + profilePictureBase64 : 'images/default_profile_picture.jpg';
      },
    });
  }
}
