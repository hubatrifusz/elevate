import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IonHeader, IonAvatar, IonToolbar, IonTitle, IonSearchbar, IonButtons, IonButton, IonMenuToggle, IonBackButton, IonIcon, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [ IonButton, IonButtons, IonHeader, IonAvatar, IonToolbar, IonTitle, IonSearchbar, IonMenuToggle]
})
export class HeaderComponent implements OnInit {
  user: any;
  @Input() title: string = '';
  @Input() showGreeting: boolean = false;
  private service = inject(UserService);

  constructor() { }

  ngOnInit() {
    this.service.getUserById(localStorage.getItem('userId')!).subscribe({
      next: (response) => {
        this.user = response;
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }

}
