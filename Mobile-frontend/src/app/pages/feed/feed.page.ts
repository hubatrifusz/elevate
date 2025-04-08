import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonList, IonLabel, IonCheckbox, ScrollDetail, IonTabButton, IonSearchbar, IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherEventDetail, IonAvatar } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, logOutOutline, add, cogSharp, menuOutline, searchOutline, search } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";
import { Router, RouterLink } from '@angular/router';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { createGesture, IonRefresherCustomEvent } from '@ionic/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/.models/user.model';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonInfiniteScrollContent, IonInfiniteScroll, IonFabButton, IonFab, 
     IonContent,  IonIcon, TaskCardComponent,  HeaderComponent]
})
export class FeedPage {

  private auth = inject(AuthService);
  public loadMoreHabits = new EventEmitter<void>();
  public hasMoreHabits: boolean = true;




  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({ search, personCircleOutline, add, searchOutline, ribbonOutline, settings, logOutOutline, menuOutline, ribbon, personOutline, personCircle, person, people, menu });
  }


  Logout() {
    this.router.navigate(['/login-page']);
    this.auth.logout();

  }

  ionViewWillEnter() {
    this.auth.userUpdated.emit();
 
  }
  
  newHabit() {
    this.router.navigate(['/create-habit']);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.loadMoreHabits.emit();
    console.log('Infinite scroll triggered');
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      window.location.reload();
      (event.target as HTMLIonRefresherElement).complete();
    }, 400);
  }
}