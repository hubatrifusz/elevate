import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FriendsService } from '../../services/friends.service';
import { User } from '../../models/user.model';
import { FriendRequest } from '../../models/friendRequest.model';
import { AuthService } from '../../services/auth.service';
import { Friendship } from '../../models/friendship.model';

@Component({
  selector: 'app-friends',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent {
  constructor(private friendsService: FriendsService, private authService: AuthService) {}

  search: FormControl = new FormControl();

  searchResult: User[] = [];
  friendRequests: User[] = [];
  friends: User[] = [];
  friendships: User[] = [];

  ngOnInit() {
    this.getFriendRequests();
    this.getFriends();
  }

  searchUsers() {
    this.searchResult = [];

    this.friendsService.getUsersByEmail(this.search.value).subscribe({
      next: (response) => {
        // Filter out the current user and already existing friends
        this.searchResult = (response as User[]).filter(
          (user) => user.id !== this.authService.getUserId() && !this.friends.some((friend) => friend.id === user.id)
        );
      },
      error: (error) => console.log(error),
    });
  }

  getFriends() {
    this.friendsService.getFriends().subscribe({
      next: (response) => (this.friends = response as User[]),
      error: (error) => console.log(error),
    });
  }

  sendFriendsRequest(friendId: string, event: MouseEvent) {
    const friendRequest: FriendRequest = { friendId: friendId, userId: this.authService.getUserId() as string, status: 'pending' };

    this.friendsService.sendFriendRequest(friendRequest).subscribe({
      next: (response) => {},
      error: (error) => console.log(error),
      complete: () => {
        (event.target as HTMLImageElement).src = "icons/check.png";
      },
    });
  }

  getFriendRequests() {
    this.friendsService.getFriendRequests().subscribe({
      next: (response) => (this.friendRequests = response as User[]),
      error: (error) => console.log(error),
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
  }
}
