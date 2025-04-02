import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonItem, IonAvatar, IonLabel, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/.models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FriendshipService } from 'src/app/services/friendship.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonButton, IonBackButton, IonButtons, IonLabel, IonAvatar, IonItem, IonSpinner, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage {

  private service = inject(UserService);
  private friendService = inject(FriendshipService);
  userId!: string;
  user: User | null = null;
  loginedUserId = localStorage.getItem('userId') || '';
  isFriend: boolean = false;
  isPending: boolean = false;
  loggedUserFriends: User[] = [];

  constructor(private route: ActivatedRoute) { }

  async ionViewWillEnter() {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    await this.getFriends();
    this.service.getUserById(this.userId).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    })
    console.log(this.loggedUserFriends);
    this.loggedUserFriends.forEach((friend) => {
      if (friend.id == this.userId) {
        this.isFriend = true;
        console.log('User is a friend:', this.isFriend);
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
  async getFriends() {
    this.friendService.getFriends().subscribe({
      next: (response) => {
        this.loggedUserFriends = response;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    })
  }
}
