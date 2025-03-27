import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton, IonIcon, IonMenu, IonContent, MenuController, IonAvatar } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, menu, menuOutline, people, person, personAddOutline, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, settings } from 'ionicons/icons';
import { ToastService } from './services/toast.service';
import { User } from './.models/user.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonAvatar, IonApp, IonRouterOutlet, IonMenu, IonIcon, IonButton, IonContent],
})
export class AppComponent {
  auth = inject(AuthService);
  http = inject(HttpClient);
  userservice = inject(UserService);
  userId = localStorage.getItem('userId');
  user: User | null = null;

  constructor(private router: Router, private menuCtrl: MenuController, private toastService: ToastService) {
    addIcons({ personCircleOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu, personAddOutline });
  }

  async ngOnInit() {
    await this.userservice.getUserById(this.userId!).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    })
  }
  goToUserPage(userId: string | undefined) {
    if (userId) {
      this.menuCtrl.close();
      this.router.navigate(['/profile', userId]);
    }
  }
  gotofriends(){
    this.menuCtrl.close();
    this.router.navigate(['/footertabs/friends']);
  }

  async Logout() {
    await this.auth.logout(); // Assuming logout is async
    await this.menuCtrl.close();
    await this.toastService.presentToast('You have logged out');
  }
}
