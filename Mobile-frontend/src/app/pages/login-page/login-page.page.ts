import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox, IonRouterOutlet, IonToast, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { add, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpStatusCode, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

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
      Validators.minLength(12),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)/)]
    })
  });



  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;

    }
  }

  constructor(private router: Router, private route: ActivatedRoute,
    private toastController: ToastController, private toastService: ToastService) {
    addIcons({ eyeOffOutline, eyeOutline })
  }


  async onSubmit() {
    if (this.form.valid) {
      try {
        const response = await this.authService.login(this.form.value).toPromise();
        this.toastService.presentToast('Successful login');
        this.router.navigate(['/footertabs/feed']);
      } catch (e) {
        console.error(e);
        if (e instanceof HttpErrorResponse && e.status === 403) {
          this.toastService.presentToast('Invalid login details');
        }
        if (e instanceof HttpErrorResponse && e.status === 400) {
          this.toastService.presentToast('Invalid credentials');
        }
        else{
          this.toastService.presentToast("Something went wrong");
        }
      }
    }
  }



  CreateAccount() {
    this.router.navigate(['/create-account-page']);
  }

  ngOnInit() {

  }






}
