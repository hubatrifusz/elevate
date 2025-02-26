import { Component, inject } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonList, IonLabel, IonCheckbox, ScrollDetail, IonTabButton, IonSearchbar } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, logOutOutline, add, cogSharp, menuOutline } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";
import { Router, RouterLink } from '@angular/router';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonTabButton, IonCheckbox, IonLabel, IonList, IonCardTitle, IonItem, IonCardContent, IonCardHeader, IonCard, IonMenuToggle, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonIcon, TaskCardComponent, FootertabsComponent]
})
export class FeedPage {
  private auth = inject(AuthService);
  private http = inject(HttpClient);


  tasks: { title: string }[] = [];
  private prevScrollPos: number = 0;
  header = document.getElementsByTagName('ion-header');
  searchbar = document.getElementsByTagName('ion-searchbar');
  title = document.getElementsByTagName('ion-title');

  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({ personCircleOutline, ribbonOutline, settings, logOutOutline, menuOutline, add, ribbon, personOutline, personCircle, person, people, menu });

  }

  setStatusBarStyleDark = async () => {
    // await StatusBar.setStyle({ style: Style.Dark });
  };

  Logout() {
    this.router.navigate(['/login-page']);
    this.auth.logout();

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

}