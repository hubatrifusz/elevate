import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordToggleService {
  constructor() {}

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
