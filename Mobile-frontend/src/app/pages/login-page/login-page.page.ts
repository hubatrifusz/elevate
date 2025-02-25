import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { add, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonContent, CommonModule, FormsModule, IonIcon, ReactiveFormsModule]
})
export class LoginPagePage implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
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

      this.login(this.form.value).subscribe({
        next: (userToken) => this.authService.saveToken(userToken),
        error: (e) => console.log(e),
        complete: () => this.router.navigate(['/footertabs/feed']),
      });
    }

  }
  CreateAccount() {
    this.router.navigate(['/create-account-page']);
  }

  ngOnInit() {
  }
  private apiUrl = 'http://localhost:8080/api';

  login(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, formResult);
  }
}
