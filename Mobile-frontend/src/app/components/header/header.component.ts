import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IonHeader, IonAvatar, IonToolbar, IonTitle, IonSearchbar, IonButtons, IonButton, IonMenuToggle, IonBackButton, IonIcon, IonLabel, IonBadge } from "@ionic/angular/standalone";
import { FriendshipService } from 'src/app/services/friendship.service';
import { ChallengeService } from 'src/app/services/challenge.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonBadge, IonButton, IonButtons, IonHeader, IonAvatar, IonToolbar, IonTitle, IonSearchbar, IonMenuToggle]
})
export class HeaderComponent implements OnInit {
  user: any;
  @Input() title: string = '';
  @Input() showGreeting: boolean = false;
  private service = inject(UserService);
  friendRequests: number = 0;
  challengeRequests: number = 0;
  private friendshipService = inject(FriendshipService);
  private challengeService = inject(ChallengeService);


  constructor() { }

  ngOnInit() {
    this.loadNotifications();
    this.service.getUserById(localStorage.getItem('userId')!).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }
  loadNotifications() {
    // Get friend requests
    this.friendshipService.getFriendRequests().subscribe({
      next: (requests) => {
        this.friendRequests = requests.length;
      },
      error: (error) => console.error('Error loading friend requests:', error)
    });

    // Get challenge requests
    this.challengeService.getChallengeRequest().subscribe({
      next: (challenges) => {
        this.challengeRequests = challenges.length;
      },
      error: (error) => console.error('Error loading challenge requests:', error)
    });
  }
  Nulling(){
    this.friendRequests = 0;
    this.challengeRequests = 0;
  }

}
