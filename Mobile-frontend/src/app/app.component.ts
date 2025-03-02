import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton, IonIcon, IonMenu, IonContent } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, logOutOutline, menu, menuOutline, people, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, settings } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonMenu, IonIcon, IonButton, IonContent,],
})
export class AppComponent {
  auth = inject(AuthService);
  http = inject(HttpClient);

  constructor(private router: Router) {
    addIcons({ personCircleOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu });

  }
  Logout() {
    this.auth.logout();
    this.router.navigate(['/login-page']);
  }
}
