import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton, IonIcon, IonMenu, IonContent, MenuController, IonAvatar, IonBadge } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, banOutline, logOutOutline, menu, menuOutline, people, person, personAddOutline, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, settings } from 'ionicons/icons';
import { ToastService } from './services/toast.service';
import { User } from './.models/user.model';
import { UserService } from './services/user.service';
import { FriendshipService } from './services/friendship.service';
import { ChallengeService } from './services/challenge.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonBadge, IonAvatar, IonApp, IonRouterOutlet, IonMenu, IonIcon, IonButton, IonContent],
})
export class AppComponent implements OnInit {

  auth = inject(AuthService);
  http = inject(HttpClient);
  private friendshipService = inject(FriendshipService);
  private challengeService = inject(ChallengeService);
  userservice = inject(UserService);
  userId = localStorage.getItem('userId');
  user: User | null = null;
  friendRequests: number = 0;
  challengeRequests: number = 0;

  constructor(private router: Router, private menuCtrl: MenuController, private toastService: ToastService) {
    addIcons({ personCircleOutline, banOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu, personAddOutline });
  }

  async ngOnInit() {
    // Subscribe to the userUpdated event
    this.loadNotifications();
    this.auth.userUpdated.subscribe(() => {
      this.getUserData(); // Fetch user data after login
    });

    // Check if the token is already available (e.g., on page reload)
    if (this.auth.isLoggedIn()) {
      this.getUserData();
      this.loadNotifications();
    }
  }

  async getUserData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userservice.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response;
          console.log('User loaded:', this.user);
        },
        error: (error) => {
          console.error('Error loading user:', error);
        }
      });
    }
  }
  goToUserPage(userId: string | undefined) {
    if (userId) {
      this.menuCtrl.close();
      this.router.navigate(['/profile', userId]);
    }
  }
  gotofriends() {
    this.friendRequests = 0;
    this.challengeRequests = 0;
    this.menuCtrl.close();
    this.router.navigate(['/footertabs/friends']);
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

  goToNegativeHabits() {
    this.menuCtrl.close();
    this.router.navigate(['/footertabs/negative-habits']);
  }

  async Logout() {
    await this.auth.logout(); // Assuming logout is async
    await this.menuCtrl.close();
    await this.toastService.presentToast('You have logged out');
  }

}
