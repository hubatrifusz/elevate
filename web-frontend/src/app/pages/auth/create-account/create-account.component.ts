import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inputValidator } from '../../../shared/input-validator';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginFeatureListComponent } from "../../../components/auth/login-feature-list/login-feature-list.component";

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterModule, LoginFeatureListComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(private http: HttpClient) {}

  loginForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d).{6,}$/)]),
    confirmPassword: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d).{6,}$/)]),
  });

  onSubmit() {
    if (this.checkValidationErrors()) return;
    this.postNewUser(this.loginForm.value).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  checkValidationErrors(): boolean {
    const validationMapping: Record<string, { elementId: string; errors: Record<string, string> }> = {
      name: {
        elementId: '#name_text_input_container',
        errors: {
          required: 'Full name is required',
        },
      },
      email: {
        elementId: '#email_email_input_container',
        errors: {
          required: 'Email is required.',
          forbiddenPattern: 'Invalid email.',
        },
      },
      password: {
        elementId: '#password_text_input_container',
        errors: {
          required: 'Password is required.',
          forbiddenPattern: 'Must be at least 6 characters and contain a number.',
        },
      },
    };

    let hasErrors = false;

    Object.entries(validationMapping).forEach(([field, config]) => {
      const inputElement = document.querySelector(config.elementId) as HTMLElement;
      const control = this.loginForm.get(field);

      if (inputElement && control) {
        const errorKey = Object.keys(config.errors).find((error) => control.hasError(error)) as keyof typeof config.errors | undefined;

        if (errorKey) {
          inputElement.style.setProperty('--after-content', `"${config.errors[errorKey]}"`);
          hasErrors = true;
        } else {
          inputElement.style.setProperty('--after-content', '""');
        }
      }
    });

    return hasErrors;
  }

  togglePasswordView(event: MouseEvent): void {
    const icon = event.target as HTMLImageElement;
    const input = icon.parentElement?.children[0] as HTMLInputElement;

    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';
    icon.src = isPassword ? 'icons/eye-crossed.png' : 'icons/eye.png';
    icon.title = isPassword ? 'Hide Password' : 'Show Password';
  }

  private apiUrl = 'http://localhost:8080/api';

  postNewUser(formResult: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formResult);
  }
}
