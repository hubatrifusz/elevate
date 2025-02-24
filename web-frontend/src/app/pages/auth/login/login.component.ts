import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inputValidator } from '../../../shared/input-validator';
import { LoginFeatureListComponent } from "../../../components/auth/login-feature-list/login-feature-list.component";

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, LoginFeatureListComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  togglePasswordView(): void {
    const icon = document.querySelector('#toggle_password_icon') as HTMLImageElement;
    const input = document.querySelector('#password_text_input') as HTMLInputElement;

    if (input.type == 'password') {
      input.type = 'text';
      icon.src = 'icons/eye-crossed.png';
      icon.title = 'Hide Password';
    } else if (input.type == 'text') {
      input.type = 'password';
      icon.src = 'icons/eye.png';
      icon.title = 'Show Password';
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false, Validators.required),
  });

  onSubmit() {
    if (this.checkValidationErrors()) return;
    console.log('Successful login!');
  }

  checkValidationErrors(): boolean {
    const validationMapping: Record<string, { elementId: string; errors: Record<string, string> }> = {
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
}
