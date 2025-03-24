import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { inputValidator } from '../../../shared/input-validator';
import { LoginFeatureListComponent } from '../../../components/auth/login-feature-list/login-feature-list.component';
import { AuthService } from '../../../services/auth.service';
import { PasswordToggleService } from '../../../services/password-toggle.service';
import { ValidationMessageComponent } from '../../../components/auth/validation-message/validation-message.component';
import { ValidationService } from '../../../services/validation.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, LoginFeatureListComponent, ValidationMessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  constructor(private router: Router, private authService: AuthService, private togglePasswordService: PasswordToggleService) {}

  formErrorMessage: string = '';

  loginForm = new FormGroup({
    email: new FormControl('', [ValidationService.requiredValidator(), Validators.email]),
    password: new FormControl('', [
      ValidationService.requiredValidator(),
      inputValidator(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*.]).{8,}$/),
      ValidationService.passwordMinLengthValidator(12),
    ]),
    rememberMe: new FormControl(false),
  });

  onSubmit() {
    this.handleLoginErrors();
    if (!this.loginForm.valid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log(response);

        this.authService.saveToken(response.token, this.loginForm.value.rememberMe as boolean);
        this.authService.saveUserID(response.userId, this.loginForm.value.rememberMe as boolean);
      },
      error: (e) => console.log(e),
      complete: () => this.router.navigate(['/dashboard']),
    });
  }

  onTogglePassword(event: MouseEvent) {
    this.togglePasswordService.togglePasswordView(event);
  }

  handleLoginErrors() {
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

    errors.sort()
    this.formErrorMessage = errors[0];
    console.log(errors);
    errors = [];
  }
}
