import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FriendsService } from '../../services/friends.service';
import { User } from '../../models/user.model';
import { FriendRequest } from '../../models/friendRequest.model';
import { AuthService } from '../../services/auth.service';

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

  searchFriends() {
    this.searchResult = [];

    this.friendsService.getUsersByEmail(this.search.value).subscribe({
      next: (response) => (this.searchResult = response as User[]),
      error: (error) => console.log(error),
    });
  }

  sendFriendsRequest(friendId: string) {
    const friendRequest: FriendRequest = { friendId: friendId, userId: this.authService.getUserId() as string };

    this.friendsService.sendFriendRequest(friendRequest).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  getFriendRequests() {}
}
