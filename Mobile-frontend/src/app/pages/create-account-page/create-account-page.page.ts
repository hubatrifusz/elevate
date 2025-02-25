import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonNote, IonIcon } from '@ionic/angular/standalone';
import { combineLatest, Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

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
  imports: [IonIcon, IonContent, CommonModule, FormsModule, ReactiveFormsModule]
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
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)]
    }),
    confirmPassword: this.fb.control('', { validators: [passwordMatchValidator, Validators.required] })
  });



  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;

    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }


  onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      // Call the register method from the AuthService
      this.postNewUser(this.form.value).subscribe({
        next: (v) => this.router.navigate(['/login-page']),
        error: (e) => console.error(e)
      });
    }
  }
  // Define the form group properly
  // loginForm = new FormGroup({
  //   email: new FormControl('',Validators.email),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   firstName: new FormControl(''),
  //   lastName: new FormControl('')  // Complete the lastName control
  // });

  constructor(private router: Router) {
    addIcons({ eyeOffOutline, eyeOutline })
  }

  ngOnInit() {
    // Initialize any required data here
  }
  private apiUrl = 'http://localhost:8080/api';

  postNewUser(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }
}
