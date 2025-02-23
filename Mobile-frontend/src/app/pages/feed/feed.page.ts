import { Component } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton, IonCard, IonCardHeader, IonCardContent, IonItem, IonCardTitle, IonList, IonLabel, IonCheckbox } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline, personOutline, ribbon, ribbonOutline, logOutOutline, add } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";
import { Router, RouterLink } from '@angular/router';
import { TaskCardComponent } from "../../components/task-card/task-card.component";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonCheckbox, IonLabel, IonList, IonCardTitle, IonItem, IonCardContent, IonCardHeader, IonCard, IonMenuToggle, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonIcon, TaskCardComponent]
})
export class FeedPage {
  tasks: { title: string }[] = [];

  constructor(private menuCtrl: MenuController, private router: Router) {
    addIcons({ ribbonOutline, settings, logOutOutline, add, ribbon, personOutline, personCircleOutline, personCircle, person, people, menu });

    this.generateTasks();
  }



  Logout() {
    this.router.navigate(['/login-page']);
  }

  generateTasks() {
    for (let i = 1; i <= 40; i++) {
      this.tasks.push({ title: `Task ${i}` });
    }
  }

  openMenu() {
    this.menuCtrl.toggle('');
  }
}