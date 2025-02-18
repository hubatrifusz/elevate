import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inputValidator } from '../../../shared/input-validator';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent {
  loginForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, inputValidator(/^[a-zA-Z0-9!#$%&'*+-=?^_{|}~.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/)]),
    password: new FormControl('', [Validators.required, inputValidator(/^(?=.*\d).{6,}$/)]),
  });

  onSubmit() {
    if (this.checkValidationErrors()) return;
    console.log('Successful account creation!');
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
}
