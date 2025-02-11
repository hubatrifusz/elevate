import { Component } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonMenuToggle, IonButton, IonTabButton, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { list, calendar, people, menu, settings } from 'ionicons/icons';
import { FootertabsComponent } from "../../components/footertabs/footertabs.component";


@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabButton, IonButton, IonButtons,IonMenuToggle, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar, FootertabsComponent]
})
export class FeedPage {

  constructor() {
      addIcons({settings,people,menu}); }



}
