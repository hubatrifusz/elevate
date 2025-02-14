import { Component } from '@angular/core';
import { IonMenuToggle, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings, person, personCircle, personCircleOutline } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonMenuToggle, IonButton, IonButtons, IonContent, IonHeader, IonMenu, IonTitle, IonToolbar]
})
export class FeedPage {


  constructor(private menuCtrl: MenuController) {
    addIcons({personCircleOutline,personCircle,person,settings,people,menu});
  }

  openMenu() {
    this.menuCtrl.toggle('');
  }

}
