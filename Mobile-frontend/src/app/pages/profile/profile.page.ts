import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonItem, IonAvatar, IonLabel, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/.models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonLabel, IonAvatar, IonItem, IonSpinner, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  private service = inject(UserService);
  userId!: string;
  user: User | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    this.service.getUserById(this.userId).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    })
  }
  async changeProfilePicture() {
    if (this.user!.id == localStorage.getItem('userId')) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Base64,
          source: CameraSource.Prompt, // Camera, Photos, or Prompt
        });

        if (image.base64String) {
          this.user!.profilePictureBase64 = image.base64String;
        }
      } catch (error) {
        console.error('Error selecting image:', error);
      }
    }
  }
}
