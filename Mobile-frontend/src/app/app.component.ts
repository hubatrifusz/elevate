import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton, IonIcon, IonMenu, IonContent, MenuController } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, menu, menuOutline, people, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, settings } from 'ionicons/icons';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonMenu, IonIcon, IonButton, IonContent],
})
export class AppComponent {
  auth = inject(AuthService);
  http = inject(HttpClient);
  userName: string | null = null;

  constructor(private router: Router, private menuCtrl: MenuController, private toastService: ToastService) {
    addIcons({ personCircleOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu });
  }

  async ngOnInit() {
    await this.loadUserName();
  }

  async loadUserName() {
    // Simulate an async operation (e.g., using Ionic Storage or IndexedDB in the future)
    this.userName = await Promise.resolve(localStorage.getItem('userName'));
    console.log('User name loaded:', this.userName);
  }

  async Logout() {
    await this.auth.logout(); // Assuming logout is async
    await this.menuCtrl.close();
    await this.toastService.presentToast('You have logged out');
  }
}
