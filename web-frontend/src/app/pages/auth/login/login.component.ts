import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { inputValidator } from '../../../shared/input-validator';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  ngOnInit() {
    this.autoScrollFeatureCarousel();
    this.addNavDots();
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

  autoScrollFeatureCarousel() {
    const carouselDiv = document.querySelector('#features_container') as HTMLElement;
    const navDots = document.querySelector('#nav_dots') as HTMLElement;
    let index = 0;

    const autoScroll = setInterval(() => {
      carouselDiv.children[index + 1].scrollIntoView();

      Array.from(navDots.children).forEach((element) => {
        element.classList.remove('nav_dot_in_focus');
      });

      navDots.children[index].classList.add('nav_dot_in_focus');
      index++;

      setTimeout(() => {
        if (index == carouselDiv.children.length - 1) {
          index = 0;
          carouselDiv.style.scrollBehavior = 'auto';
          carouselDiv.scrollTo(0, 0);
          carouselDiv.style.scrollBehavior = 'smooth';
        }
      }, 2000);
    }, 5000);
  }

  addNavDots() {
    const carouselDiv = document.querySelector('#features_container') as HTMLElement;
    const carouselDivChildren = Array.from(carouselDiv.children);

    const navDots = document.querySelector('#nav_dots') as HTMLElement;
    navDots.innerHTML = '';

    for (let i = 0; i < carouselDivChildren.length - 1; i++) {
      const navDot = document.createElement('div');
      navDot.classList.add('nav_dot');

      navDots.appendChild(navDot);
    }

    navDots.children[navDots.children.length - 1].classList.add('nav_dot_in_focus');
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, inputValidator(/^[a-zA-Z0-9!#$%&'*+-=?^_{|}~.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/)]),
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
