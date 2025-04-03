import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonItem, IonAvatar, IonLabel, IonButtons, IonBackButton, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonText, IonImg } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/.models/user.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FriendshipService } from 'src/app/services/friendship.service';
import { addIcons } from 'ionicons';
import { personAddOutline } from 'ionicons/icons';
import { ToastService } from 'src/app/services/toast.service';
import { Friendship } from 'src/app/.models/friendship.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonCol, IonRow, IonGrid, IonIcon, IonButton,
     IonBackButton, IonButtons, IonLabel, IonAvatar, IonItem, IonSpinner,
      IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader,
       IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage {
  private toast = inject(ToastService);
  private service = inject(UserService);
  private friendService = inject(FriendshipService);
  userId!: string;
  user: User | null = null;
  loginedUserId = localStorage.getItem('userId') || '';
  isFriend: boolean = false;
  isPending: boolean = false;
  loggedUserFriends: User[] = [];
  sentFriendRequests: Friendship[] = [];

  constructor(private route: ActivatedRoute) { 
    addIcons({personAddOutline});
  }

  async ionViewWillEnter() {

    this.userId = this.route.snapshot.paramMap.get('id') || '';
    console.log('User ID:', this.userId);
    await this.getFriends();
    await this.getFriendRequests();
    this.service.getUserById(this.userId).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.toast.presentToast(error.error);
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
        this.toast.presentToast('Error selecting image');
      }
    }
  }
  async getFriends() {
    this.friendService.getFriends().subscribe({
      next: (response) => {
        this.loggedUserFriends = response;
        response.forEach((friend) => {
          if (friend.id == this.userId) {
            this.isFriend = true;
          }
        });
      },
      error: (error) => {
        this.toast.presentToast(error.error);
      }
    })
  }
  async getFriendRequests() {
    this.friendService.getSentRequests().subscribe({
      next: (response) => {
        console.log('Sent friend requests:', response);
        response.forEach((friend) => {
          if (friend.friendId == this.userId) {
            this.isPending = true;
          }
        });
      },
      error: (error) => {
        this.toast.presentToast(error.error);
        console.error('Error loading sent friend requests:', error);
      }
    })
  }

  sendFriendRequest(userId: string) {
    this.friendService.addFriend(userId).subscribe({
      next: () => {
        this.isPending = true;
      },
      error: (error) => {
        this.toast.presentToast(error.error);
      }
    });
  }
  
}
