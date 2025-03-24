import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginFeatureListComponent } from '../../../components/auth/login-feature-list/login-feature-list.component';
import { LoadingScreenComponent } from '../../../components/loading-screen/loading-screen.component';
import { PasswordToggleService } from '../../../services/password-toggle.service';
import { AuthService } from '../../../services/auth.service';
import { ValidationMessageComponent } from '../../../components/auth/validation-message/validation-message.component';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterModule, LoginFeatureListComponent, LoadingScreenComponent, ValidationMessageComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  constructor(private router: Router, private togglePassword: PasswordToggleService, private authService: AuthService) {}

  formErrorMessage: string = '';

  loginForm = new FormGroup(
    {
      firstname: new FormControl('', ValidationService.requiredValidator()),
      lastname: new FormControl('', ValidationService.requiredValidator()),
      email: new FormControl('', [ValidationService.requiredValidator(), ValidationService.emailValidator()]),
      password: new FormControl('', [ValidationService.requiredValidator(), ValidationService.createAccountPasswordValidator()]),
      confirmPassword: new FormControl('', [ValidationService.requiredValidator(), ValidationService.createAccountPasswordValidator()]),
    },
    {
      validators: [ValidationService.passwordMatchValidator('password', 'confirmPassword')],
    }
  );

  onSubmit() {
    this.handleFormValidationErrors();
    if (!this.loginForm.valid) return;

    this.authService.crateAccount(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => {
        if (error.status == 409) {
          this.formErrorMessage = 'This account already exists.';
        } else {
          this.formErrorMessage = 'An error occurred. Please try again later.';
        }
      },
    });
  }

  onTogglePassword(event: MouseEvent) {
    this.togglePassword.togglePasswordView(event);
  }

  handleFormValidationErrors() {
    let errors: string[] = [];
    Object.keys(this.loginForm.controls).forEach((key) => {
      const controlErrors = this.loginForm.get(key)?.errors;
      if (controlErrors) {
        Object.entries(controlErrors).forEach(([errorKey, errorValue]) => {
          if (typeof errorValue === 'object' && errorValue.message) {
            errors.push(errorValue.message);
          } else {
            console.log(`- ${errorKey}:`, errorValue);
          }
        });
      }
    });

    errors.sort();
    this.formErrorMessage = errors[0];
    errors = [];
  }
}
