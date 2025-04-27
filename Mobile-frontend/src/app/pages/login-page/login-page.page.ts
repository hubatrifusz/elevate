import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonCheckbox, IonRouterOutlet, IonToast, ToastController, LoadingController } from '@ionic/angular/standalone';
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
  imports: [IonContent, CommonModule, FormsModule, IonIcon, ReactiveFormsModule]
})
export class LoginPagePage implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  showPassword = false;
  isLoading = false;



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
    private toastController: ToastController, private toastService: ToastService, private loadingController: LoadingController) {
    addIcons({ eyeOffOutline, eyeOutline })
  }


  async onSubmit() {
    if (!this.form.valid) {
      this.toastService.presentToast('Please correct the form errors');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Logging in...',
      spinner: 'circular',
    });
    await loading.present();

    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.toastService.presentToast('Successful login');
        this.router.navigate(['/footertabs/feed']);
      },
      error: (error) => {
        loading.dismiss();
        if (error) {
          if (error.status === 403) {
            this.toastService.presentToast('Invalid login details');
          } else if (error.status === 404) {
            this.toastService.presentToast('User not found');
          }
          else if (error.status === 400) {
            this.toastService.presentToast('Invalid credentials');
          } else {
            this.toastService.presentToast('Something went wrong');
          }
        }
      },
      complete: () => {
        loading.dismiss();
      }
    });
  }
  CreateAccount() {
    this.router.navigate(['/create-account-page']);
  }

  ngOnInit() {

  }


}
