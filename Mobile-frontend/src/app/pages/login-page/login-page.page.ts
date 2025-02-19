import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule]
})
export class LoginPagePage implements OnInit {

  constructor(private router: Router) { }


  login(){
    this.router.navigate(['/footertabs/feed']);
  }

  ngOnInit() {
  }

}
