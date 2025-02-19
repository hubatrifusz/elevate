import { Component, OnInit } from '@angular/core';
import { IonIcon, IonTabBar, IonTabButton, IonTabs, IonHeader, IonTitle, IonToolbar, IonContent } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { list, calendar, people } from 'ionicons/icons';


@Component({
  selector: 'app-footertabs',
  templateUrl: './footertabs.component.html',
  styleUrls: ['./footertabs.component.scss'],
  imports: [IonIcon, IonTabBar, IonTabButton, IonTabs]
})
export class FootertabsComponent  implements OnInit {

  constructor() { addIcons({ list, calendar, people }); }

  ngOnInit() {}

}
