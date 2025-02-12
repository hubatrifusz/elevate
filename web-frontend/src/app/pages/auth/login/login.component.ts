import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  togglePassword() {
    const icon = document.querySelector('#toggle_password_icon') as HTMLImageElement;
    const input = document.querySelector('#password_text_input') as HTMLInputElement;

    if (input.type == "password") {
      input.type = 'text';
      icon.src = 'icons/eye.png';
    }
    else if (input.type == "text") {
      input.type = 'password';
      icon.src = 'icons/eye-crossed.png';
    }
  }
}
