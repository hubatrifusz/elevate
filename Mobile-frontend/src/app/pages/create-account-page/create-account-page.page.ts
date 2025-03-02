import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control?.root?.get('password');
  if (password?.value !== control?.value) {
    return { passwordMatch: "Passwords do not  match" };
  }
  return null;
}

@Component({
  selector: 'app-create-account-page',
  templateUrl: './create-account-page.page.html',
  styleUrls: ['./create-account-page.page.scss'],
  standalone: true,
  imports: [IonToast, IonIcon, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreateAccountPagePage implements OnInit {
  showPassword = false;
  showConfirmPassword = false;
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  fb = inject(NonNullableFormBuilder)
  form = this.fb.group({
    firstName: this.fb.control('', { validators: [Validators.required] }),
    lastName: this.fb.control('', { validators: [Validators.required] }),
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.control('', {
      validators: [Validators.required,
      Validators.minLength(12),
        passwordMatchValidator,
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)/)]
    }),
    confirmPassword: this.fb.control('', { validators: [passwordMatchValidator, Validators.required] })
  });

  constructor(private router: Router) {
    addIcons({ eyeOffOutline, eyeOutline });
  }

  ngOnInit() { }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.postNewUser(this.form.value).subscribe({
        next: (v) => {
          this.router.navigate(['/login-page'], { queryParams: { message: 'Account created successfully, please log in' } });
        },
        error: (e) => {
          console.error('Error creating account:', e);
        }
      });
    } else {
      console.log('Form is invalid.');
    }
  }

  private apiUrl = 'http://localhost:8080/api';

  postNewUser(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }
}