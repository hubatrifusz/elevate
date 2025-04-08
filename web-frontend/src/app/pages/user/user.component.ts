import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('profilePicture') profilePicture!: ElementRef<HTMLInputElement>;

  imageSrc: string = 'images/default_profile_picture.jpg';

  userData!: User;

  ngOnInit() {
    this.getUserData();
    this.loadProfilePicture();
  }

  getUserData() {
    let userId = this.authService.getUserId();
    this.userService.getUserData(userId).subscribe({
      next: (response) => (this.userData = response as User),
      error: (e) => {
        console.log(e);
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const updatedUser = {
          firstName: this.userData.firstName,
          lastName: this.userData.lastName,
          profilePictureBase64: base64String,
        };
        console.log(updatedUser);
        this.userService.updateUser(this.authService.getUserId(), updatedUser).subscribe({
          next: () => {},
          error: () => {},
          complete: () => this.loadProfilePicture(),
        });
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsDataURL(file);
    }
  }

  loadProfilePicture() {
    let profilePictureBase64: string = '';

    this.userService.getUserData(this.authService.getUserId()).subscribe({
      next: (response) => {
        profilePictureBase64 = response.profilePictureBase64;
      },
      error: (error) => console.log(error),
      complete: () => {
        if (profilePictureBase64 != null) {
          this.imageSrc = 'data:image/png;base64,' + profilePictureBase64;
        }
      },
    });
  }
}
