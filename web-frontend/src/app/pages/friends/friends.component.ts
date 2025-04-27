import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FriendsService } from '../../services/friends.service';
import { User } from '../../models/user.model';
import { FriendRequest } from '../../models/friendRequest.model';
import { AuthService } from '../../services/auth.service';
import { Friendship } from '../../models/friendship.model';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-friends',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  constructor(private friendsService: FriendsService, private authService: AuthService) { }

  search: FormControl = new FormControl();

  searchResult: User[] = [];
  friendRequests: User[] = [];
  friends: User[] = [];
  friendships: User[] = [];
  sentFriendRequests: Friendship[] = [];

  friendToDelete!: User;

  // Loading states
  isFriendsLoading = true;
  isFriendRequestsLoading = true;
  isSentRequestsLoading = true;
  isSearchLoading = false;

  ngOnInit() {
    this.getFriendRequests();
    this.getFriends();
    this.getSentFriendRequests();
  }

  searchUsers() {
    this.searchResult = [];
    this.isSearchLoading = true;

    this.friendsService.getUsersByEmail(this.search.value).subscribe({
      next: (response) => {
        // Filter out the current user and already existing friends
        this.searchResult = (response as User[]).filter(
          (user) => user.id !== this.authService.getUserId() && !this.friends.some((friend) => friend.id === user.id)
        );
      },
      error: (error) => console.log(error),
      complete: () => (this.isSearchLoading = false),
    });
  }

  getFriends() {
    this.isFriendsLoading = true;

    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response as User[];
        this.isFriendsLoading = false;
      },
      error: (error) => {
        console.log(error);
        if (error.error === "User has no friends.") {
          this.friends = [];
        }
        this.isFriendsLoading = false;
      }
    });
  }

  sendFriendsRequest(friendId: string, event: MouseEvent) {
    const friendRequest: FriendRequest = { friendId: friendId, userId: this.authService.getUserId() as string, status: 'pending' };

    this.friendsService.sendFriendRequest(friendRequest).subscribe({
      next: (response) => { },
      error: (error) => console.log(error),
      complete: () => {
        let button = event.target as HTMLImageElement;
        button.src = 'icons/check.png';
        button.style.pointerEvents = 'none';
      },
    });
  }

  getFriendRequests() {
    this.isFriendRequestsLoading = true;

    this.friendsService.getFriendRequests().subscribe({
      next: (response) => {
        this.friendRequests = response as User[];
        this.isFriendRequestsLoading = false;
      },
      error: (error) => {
        console.log(error);
        // If the error is that there are no friend requests, we treat it as an empty array
        if (error.error === "User has no friend requests.") {
          this.friendRequests = [];
        }
        this.isFriendRequestsLoading = false;
      }
    });
  }

  getSentFriendRequests() {
    this.isSentRequestsLoading = true;

    this.friendsService.getSentFriendRequests().subscribe({
      next: (response) => (this.sentFriendRequests = response as Friendship[]),
      error: (error) => console.log(error),
      complete: () => (this.isSentRequestsLoading = false),
    });
  }

  acceptFriendRequest(friend: User) {
    const friendRequest: FriendRequest = { userId: this.authService.getUserId() as string, friendId: friend.id, status: 'accepted' };
    this.friendsService.patchFriendship(friendRequest).subscribe({
      next: () => {
        const index = this.friendRequests.findIndex((friendReq) => friendReq.id === friend.id);
        this.friendRequests.splice(index, 1);
      },
      error: (error) => console.log(error),
      complete: () => this.getFriends(),
    });
  }

  declineFriendRequest(friend: User) {
    const friendRequest: FriendRequest = { userId: this.authService.getUserId() as string, friendId: friend.id, status: 'declined' };
    this.friendsService.patchFriendship(friendRequest).subscribe({
      next: (response) => {
        console.log(response);
        const index = this.friendRequests.findIndex((friendReq) => friendReq.id === friend.id);
        this.friendRequests.splice(index, 1);
      },
      error: (error) => console.log(error),
      complete: () => this.getFriends(),
    });
  }

  deleteFriend(friend: User) {
    this.friendsService.deleteFriend(friend.id).subscribe({
      next: () => {
        this.friends = this.friends.filter((f) => f.id !== friend.id);
      },
      error: (error) => console.log(error),
    });

    const optionsDiv = document.querySelector('#options') as HTMLDivElement;
    optionsDiv.style.display = 'none';
  }

  showOptions(event: MouseEvent, friend: User) {
    const optionsDiv: HTMLDivElement = document.querySelector('#options') as HTMLDivElement;
    if (!optionsDiv) return;

    let eventPosition = (event.target as HTMLImageElement).getBoundingClientRect();

    let positionTop: string = (eventPosition.top + 20).toString();
    let positionLeft: string = (eventPosition.left - 40).toString();

    optionsDiv.style.display = 'block';
    optionsDiv.style.top = positionTop + 'px';
    optionsDiv.style.left = positionLeft + 'px';

    document.removeEventListener('click', this.hideOptions);

    setTimeout(() => {
      document.addEventListener('click', this.hideOptions);
    }, 0);

    this.friendToDelete = friend;
  }

  hideOptions = (event: MouseEvent) => {
    const optionsDiv = document.querySelector('#options') as HTMLDivElement;
    if (!optionsDiv) return;

    if (!optionsDiv.contains(event.target as Node)) {
      optionsDiv.style.display = 'none';
      document.removeEventListener('click', this.hideOptions);
    }
  };
}
