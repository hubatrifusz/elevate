import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inputValidator } from '../../../shared/input-validator';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginFeatureListComponent } from '../../../components/auth/login-feature-list/login-feature-list.component';
import { LoadingScreenComponent } from '../../../components/loading-screen/loading-screen.component';
import { PasswordToggleService } from '../../../services/password-toggle.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterModule, LoginFeatureListComponent, LoadingScreenComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(private router: Router, private togglePassword: PasswordToggleService, private authService: AuthService) {}

  loginForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d).{6,}$/)]),
    confirmPassword: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d).{6,}$/)]),
  });

  onSubmit() {
    if (this.checkValidationErrors()) return;
    this.authService.crateAccount(this.loginForm.value).subscribe({
      next: (v) => this.router.navigate(['/login']),
      error: (e) => console.error(e),
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

  onTogglePassword(event: MouseEvent) {
    this.togglePassword.togglePasswordView(event);
  }
}
