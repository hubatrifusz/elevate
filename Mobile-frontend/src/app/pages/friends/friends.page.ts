import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonListHeader, LoadingController, IonSearchbar, IonAvatar, IonIcon, IonFab, IonFabButton, IonModal, IonImg, IonButtons, IonBackButton, IonRefresher, IonRefresherContent, RefresherEventDetail, IonBadge, IonCard, IonCardContent, IonChip, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInfiniteScrollContent, IonInfiniteScroll, IonFooter, IonSpinner } from '@ionic/angular/standalone';
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
import { checkmark, close, happyOutline, people, add, sad, trophyOutline, trophy } from 'ionicons/icons';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Challenge } from 'src/app/.models/challenge.model';
import { ChallengeRequestComponent } from "../../components/challenge-request/challenge-request.component";
import { Friendship } from 'src/app/.models/friendship.model';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCol, IonRow, IonGrid, IonChip, IonCardContent,
    IonCard, IonBadge, IonRefresherContent, IonRefresher, IonButtons, IonModal, IonFabButton, IonFab, IonIcon,
    IonAvatar, IonSearchbar, IonButton, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, HeaderComponent, FriendComponent, ChallengeRequestComponent]
})
export class FriendsPage {


  loggendUserId = localStorage.getItem('userId') || '';
  toastService = inject(ToastService);
  friendService = inject(FriendshipService);
  userService = inject(UserService);
  router = inject(Router);
  challengeService = inject(ChallengeService);
  friends: User[] = [];
  friendRequests: User[] = [];
  sentFriendRequests: Friendship[] = [];
  searchedUsers: User[] = [];
  challengeRequests: Challenge[] = [];
  isChallengeModalOpen = false;
  isLoading = true;

  private page = 1;
  private pageSize = 15;
  isModalOpen = false;


  constructor(private loadingController: LoadingController) {
    addIcons({ trophy, people, happyOutline, close, trophyOutline, checkmark, add, sad });
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    this.friendRequests = [];
    this.page = 1;
    const loading = await this.presentLoading();
    await this.getSentFriendRequests();
    await this.getChallengeRequests();
    await this.getFriendRequests();
    await this.getFriends(); // Fetch friends after friend requests
    loading.dismiss();
    this.isLoading = false;
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  onIonInfinite($event: IonInfiniteScrollCustomEvent<void>) {
    throw new Error('Method not implemented.');
  }


  setChallengeModalOpen(isOpen: boolean) {
    this.isChallengeModalOpen = isOpen;
  }

  async getChallengeRequests() {
    this.challengeRequests = [];
    this.challengeService.getChallengeRequest().subscribe({
      next: async (response) => {
        // Fetch user details for each challenge request
        this.challengeRequests = await Promise.all(
          response.map(async (challenge) => {
            const userDetails = await this.userService.getUserById(challenge.userId).toPromise();
            return { ...challenge, user: userDetails }; // Attach user details to the challenge
          })
        );
        console.log('Challenge Requests with User Details:', this.challengeRequests);
      },
      error: (error) => {
        console.error('Error loading challenge requests:', error);
      }
    });
  }
  acceptChallengeRequest(challenge: Challenge) {
    this.challengeRequests = this.challengeRequests.filter((c) => c.id !== challenge.id); // Remove the accepted challenge from the list
  }

  rejectChallengeRequest(challenge: Challenge) {
    this.challengeRequests = this.challengeRequests.filter((c) => c.id !== challenge.id); // Remove the rejected challenge from the list
    // Add logic to reject the challenge
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

  async getSentFriendRequests() {
    this.sentFriendRequests = [];
    this.friendService.getSentRequests().subscribe({
      next: (response) => {
        this.sentFriendRequests = response;
        console.log(response) // Assign the response to the friends array
      },
      error: (error) => {
        // this.toastService.presentToast(error.error);
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
          this.searchedUsers = response.filter((user) => user.id !== this.loggendUserId);
          // Filter out the logged-in user

          // Assign the response to the friends array
        },
        error: (error) => {
          if (error.status === 404) {
            this.searchedUsers = []; // Clear the searched users if there's an error
          }
        }
      });
    }
    else {
      this.searchedUsers = [];

    }
  }
  addFriend(friend: User) {
    this.friendService.addFriend(friend.id).subscribe({
      next: (response) => {
        console.log('Friend request sent successfully:', response);
        this.getSentFriendRequests();
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
    this.isLoading = true;
    this.ionViewWillEnter().then(() => {
      this.isLoading = false;
      $event.detail.complete(); // Complete the refresher after data is loaded
    });
  }



  goToProfile(userId: string) {
    this.setChallengeModalOpen(false);
    this.router.navigate(['/profile', userId]);
  }

  isPendingRequest(userId: string | number): boolean {
    return this.sentFriendRequests?.some(request => request.friendId === userId) ?? false;
  }
  isFriend(userId: string): boolean{

    return this.friends?.some(friend => friend.id === userId) ?? false;
  }
}
