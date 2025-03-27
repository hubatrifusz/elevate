import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonListHeader, LoadingController, IonSearchbar, IonAvatar, IonIcon, IonFab, IonFabButton, IonModal, IonImg, IonButtons, IonBackButton, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/angular/standalone';
import { FriendsFeedService } from 'src/app/services/friends-feed.service';
import { User } from 'src/app/.models/user.model';
import { FriendshipService } from 'src/app/services/friendship.service';
import { HeaderComponent } from "../../components/header/header.component";
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonBackButton, IonButtons, IonImg, IonModal, IonFabButton, IonFab, IonIcon, IonAvatar, IonSearchbar, IonListHeader, IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent]
})
export class FriendsPage {


  toastService = inject(ToastService);
  friendService = inject(FriendshipService);
  userService = inject(UserService);
  router = inject(Router);
  friends: User[] = [];
  friendRequests: User[] = [];
  searchedUsers: User[] = [];
  disabledButtons: Set<string> = new Set();
  private page = 1;
  private pageSize = 15;


  constructor(private loadingController: LoadingController) { }

  async ionViewWillEnter() {
    this.friendRequests = [];
    this.page = 1;
    const loading = await this.presentLoading();

    await this.getFriendRequests();
    await this.getFriends(); // Fetch friends after friend requests
    loading.dismiss();

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    return loading;
  }


  async getFriendRequests() {
    this.friendService.getFriendRequests().subscribe({
      next: (response) => {
        this.friendRequests = response;
        console.log(response)// Assign the response to the friends array
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    });
  }

  getFriends() {
    this.friendService.getFriends().subscribe({
      next: (response) => {
        this.friends = response; // Assign the response to the friends array
      },
      error: (error) => {
        console.error('Error loading friends:', error);
      }
    });
  }
  userSearch(event: any) {
    const email = event.target.value.toLowerCase();

    if (email !== '') {
      this.userService.getUsersByEmail(email, this.page, this.pageSize).subscribe({
        next: (response) => {
          this.searchedUsers = response; // Assign the response to the friends array
        },
        error: (error) => {
          console.error('Error loading friends:', error);
        }
      });

    }
  }
  addFriend(friend: User) {
    this.friendService.addFriend(friend.id).subscribe({
      next: (response) => {
        console.log('Friend request sent successfully:', response);
        this.disabledButtons.add(friend.id);
        this.toastService.presentToast('Friend request sent successfully!');
      },
      error: (error) => {
        console.error('Error sending friend request:', error);
        this.toastService.presentToast('You have already sent a friend request to this user!');
      }
    });
  }


  rejectFriendRequest(friend: User) {
    this.friendService.friendShipStatus(friend.id, false).subscribe({
      next: (response) => {
        console.log('Friend request rejected successfully:', response);
        this.disabledButtons.add(friend.id);
        this.getFriendRequests();
        this.toastService.presentToast('Friend request rejected.');
      },
      error: (error) => {
        console.error('Error rejecting friend request:', error);
      }
    });
  }
  acceptFriendRequest(friend: User) {
    this.friendService.friendShipStatus(friend.id, true).subscribe({
      next: (response) => {
        console.log('Friend request accepted successfully:', response);
        this.getFriendRequests();
        this.getFriends();
        this.toastService.presentToast('Friend request accepted!');
      },
      error: (error) => {
        console.error('Error accepting friend request:', error);
      }
    });
  }

  DeleteFriend(userId: string) {
    this.friendService.deleteFriend(userId).subscribe({
      next: (response) => {
        console.log('Friend deleted successfully:', response);
        this.getFriends();
        this.toastService.presentToast('Friend deleted successfully.');
      },
      error: (error) => {
        console.error('Error deleting friend:', error);
      }
    });
  }
  handleRefresh($event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this.ionViewWillEnter().then(() => {
      $event.detail.complete(); // Complete the refresher after data is loaded
    });
  }

  isButtonDisabled(userId: string): boolean {
    return this.disabledButtons.has(userId);
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }
}
