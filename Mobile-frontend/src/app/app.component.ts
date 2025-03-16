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
  imports: [IonApp, IonRouterOutlet, IonMenu, IonIcon, IonButton, IonContent,],
})
export class AppComponent {
  auth = inject(AuthService);
  http = inject(HttpClient);
  userName: string | null = localStorage.getItem('userName');

  constructor(private router: Router, private menuCtrl: MenuController, private toastService: ToastService) {
    addIcons({ personCircleOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu });

  }

  ngOnInit(){
  }

  Logout() {
    this.auth.logout();
    this.menuCtrl.close();
    this.toastService.presentToast('You have logged out');

  }
}
