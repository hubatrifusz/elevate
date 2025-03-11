import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonList, IonLabel, IonCheckbox, ScrollDetail, IonTabButton, IonSearchbar, IonFab, IonFabButton, IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, logOutOutline, add, cogSharp, menuOutline, searchOutline, search } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";
import { Router, RouterLink } from '@angular/router';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonInfiniteScrollContent, IonInfiniteScroll, IonFabButton, IonFab, IonSearchbar, IonTabButton, IonCheckbox, IonLabel, IonList, IonCardTitle, IonItem, IonCardContent, IonCardHeader, IonCard, IonMenuToggle, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonIcon, TaskCardComponent, FootertabsComponent]
})
export class FeedPage implements OnInit {

  private auth = inject(AuthService);
  private http = inject(HttpClient);
  @Output() loadMoreHabits = new EventEmitter<void>();
  @Output() refreshHabits = new EventEmitter<void>();
  public hasMoreHabits: boolean = true;

  userInfo: string | null = localStorage.getItem('userInfo');
  public userName: string = '';

  tasks: { title: string }[] = [];
  private prevScrollPos: number = 0;
  header = document.getElementsByTagName('ion-header');
  searchbar = document.getElementsByTagName('ion-searchbar');
  title = document.getElementsByTagName('ion-title');

  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({ search, personCircleOutline, add, searchOutline, ribbonOutline, settings, logOutOutline, menuOutline, ribbon, personOutline, personCircle, person, people, menu });
  }

  setStatusBarStyleDark = async () => {
    // await StatusBar.setStyle({ style: Style.Dark });
  };

  Logout() {
    this.router.navigate(['/login-page']);
    this.auth.logout();

  }

  ngOnInit() {
    if (this.userInfo) {
      this.userName = localStorage.getItem('userName')!;
    }
  }

  handleScrollStart() {
    // console.log('scroll start');
  }

  //Header scroll effect
  handleScroll(event: CustomEvent<ScrollDetail>) {
    const currentScrollPos = event.detail.scrollTop;
    // console.log('scroll', JSON.stringify(event.detail));
    // console.log(this.header);

    if (this.header) {
      if (currentScrollPos > this.prevScrollPos) {
        // Scrolling down
        if (currentScrollPos > 1) {
          this.header[0].style.transition = "0.1s";
          this.header[0].style.top = `-${currentScrollPos / 2}px`;
          if (currentScrollPos > 130) {
            this.title[0].style.display = "none";
            this.searchbar[0].style.display = "block";
          }
        }
      }
      else {
        // Scrolling up
        this.header[0].style.transition = "0.1s";
        this.header[0].style.top = "0px";
      }
      if (currentScrollPos < 2) {
        this.header[0].style.transition = "0.1s";
        this.title[0].style.display = "block";
        this.searchbar[0].style.display = "none";
      }
    }

    this.prevScrollPos = currentScrollPos;
  }
  handleScrollEnd() {
    // console.log('scroll end');
  }
  newHabit() {
    this.router.navigate(['/create-habit']);
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    // console.log('Infinite scroll triggered');
    this.loadMoreHabits.emit();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      window.location.reload();
      (event.target as HTMLIonRefresherElement).complete();
    }, 200);
  }
}