import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inputValidator } from '../../../shared/input-validator';
import { LoginFeatureListComponent } from '../../../components/auth/login-feature-list/login-feature-list.component';
import { AuthService } from '../../../services/auth.service';
import { PasswordToggleService } from '../../../services/password-toggle.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, LoginFeatureListComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService, private togglePasswordService: PasswordToggleService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/)]),
    rememberMe: new FormControl(false, Validators.required),
  });

  onSubmit() {
    if (this.checkValidationErrors()) return;
    this.authService.login(this.loginForm.value).subscribe({
      next: (userToken) => this.authService.saveToken(userToken),
      error: (e) => this.checkLoginErrors(e),
      complete: () => this.router.navigate(['/dashboard']),
    });
  }

  onTogglePassword(event: MouseEvent) {
    this.togglePasswordService.togglePasswordView(event);
  }

  checkValidationErrors(): boolean {
    const validationMapping: Record<string, { elementId: string; errors: Record<string, string> }> = {
      email: {
        elementId: '#email_email_input_container',
        errors: {
          required: 'Email is required.',
          email: 'Invalid email.',
        },
      },
      password: {
        elementId: '#password_text_input_container',
        errors: {
          required: 'Password is required.',
          forbiddenPattern: 'Invalid password.',
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

  checkLoginErrors(error: any) {
    const passwordInput = document.querySelector('#password_text_input_container') as HTMLInputElement;

    if (error.status === 401) {
      passwordInput.style.setProperty('--after-content', '"Incorrect email or password."');
    } else {
      passwordInput.style.setProperty('--after-content', '""');
    }
  }
}
