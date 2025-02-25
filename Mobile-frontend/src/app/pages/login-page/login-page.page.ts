import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { add, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonContent, CommonModule, FormsModule, IonIcon, ReactiveFormsModule]
})
export class LoginPagePage implements OnInit {

  showPassword = false;

  fb = inject(NonNullableFormBuilder)
  form = this.fb.group({
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', {
      validators: [Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)]
    })
  });



  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;

    }
  }

  constructor(private router: Router) {
    addIcons({ eyeOffOutline, eyeOutline })
  }


  onSubmit() {
    console.log(this.form.value);
    console.log(this.form.valid);
    if (this.form.valid) {
      // Call the login method from the AuthService
      this.router.navigate(['/footertabs/feed']);
    }

  }
  CreateAccount() {
    this.router.navigate(['/create-account-page']);
  }

  ngOnInit() {
  }

}
