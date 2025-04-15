import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordToggleService {
  constructor() {}

  togglePasswordView(event: MouseEvent): void {
    const icon = event.target as HTMLImageElement;
    const input = icon.parentElement?.children[0] as HTMLInputElement;

    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';
    icon.src = isPassword ? 'icons/eye-crossed.png' : 'icons/eye.png';
    icon.title = isPassword ? 'Hide Password' : 'Show Password';
  }
}
