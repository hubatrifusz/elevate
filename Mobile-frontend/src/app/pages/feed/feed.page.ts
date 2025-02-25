import { Component } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonList, IonLabel, IonCheckbox, ScrollDetail, IonTabButton } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, logOutOutline, add, cogSharp } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";
import { Router, RouterLink } from '@angular/router';
import { TaskCardComponent } from "../../components/task-card/task-card.component";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonTabButton, IonCheckbox, IonLabel, IonList, IonCardTitle, IonItem, IonCardContent, IonCardHeader, IonCard, IonMenuToggle, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonIcon, TaskCardComponent]
})
export class FeedPage {
  tasks: { title: string }[] = [];

  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({ ribbonOutline, settings, logOutOutline, add, ribbon, personOutline, personCircleOutline, personCircle, person, people, menu });

  }



  Logout() {
    this.router.navigate(['/login-page']);
  }

  header = document.getElementsByTagName('ion-header');

  handleScrollStart() {
    // console.log('scroll start');
  }

  handleScroll(event: CustomEvent<ScrollDetail>) {
    console.log('scroll', JSON.stringify(event.detail))
    console.log(this.header);
    if (this.header) {
      if(event.detail.scrollTop > 30){
        this.header[0].style.position = "fixed";
        this.header[0].style.top = `-${event.detail.scrollTop}px`;
      }
      else if(event.detail.scrollTop < 30){
        this.header[0].style.position = "static";
      }
    
    }
  }

  handleScrollEnd() {
    // console.log('scroll end');
  }


}