import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonListHeader, LoadingController, IonSearchbar, IonAvatar, IonIcon, IonFab, IonFabButton, IonModal, IonImg, IonButtons, IonBackButton, IonRefresher, IonRefresherContent, RefresherEventDetail, IonBadge, IonCard, IonCardContent, IonChip, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInfiniteScrollContent, IonInfiniteScroll } from '@ionic/angular/standalone';
import { FriendsFeedService } from 'src/app/services/friends-feed.service';
import { User } from 'src/app/.models/user.model';
import { FriendshipService } from 'src/app/services/friendship.service';
import { HeaderComponent } from "../../components/header/header.component";
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent } from '@ionic/core';
import { FriendComponent } from "../../components/friend/friend.component";
import { addIcons } from 'ionicons';
import { checkmark, close, happyOutline, people, add, sad } from 'ionicons/icons';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonInfiniteScroll, IonInfiniteScrollContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCol, IonRow, IonGrid, IonChip, IonCardContent, IonCard, IonBadge, IonRefresherContent, IonRefresher, IonBackButton, IonButtons, IonImg, IonModal, IonFabButton, IonFab, IonIcon, IonAvatar, IonSearchbar, IonListHeader, IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, FriendComponent]
})
export class FriendsPage {



  toastService = inject(ToastService);
  friendService = inject(FriendshipService);
  userService = inject(UserService);
  router = inject(Router);
  friends: User[] = [];
  friendRequests: User[] = [];
  searchedUsers: User[] = [];
  private page = 1;
  private pageSize = 15;
  isModalOpen = false;


  constructor(private loadingController: LoadingController) {
    addIcons({people,happyOutline,close,checkmark,sad,add});
  }

  async ionViewWillEnter() {
    this.friendRequests = [];
    this.page = 1;
    const loading = await this.presentLoading();

    await this.getFriendRequests();
    await this.getFriends(); // Fetch friends after friend requests
    loading.dismiss();

  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onIonInfinite($event: IonInfiniteScrollCustomEvent<void>) {
    throw new Error('Method not implemented.');
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    return loading;
  }


  async getFriendRequests() {
    this.friendRequests = [];
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
    this.friends = [];
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
          if (error.status === 404) {
            this.searchedUsers = []; // Clear the searched users if there's an error
          }
        }
      });

    }
  }
  addFriend(friend: User) {
    this.friendService.addFriend(friend.id).subscribe({
      next: (response) => {
        console.log('Friend request sent successfully:', response);
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



  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }
}
