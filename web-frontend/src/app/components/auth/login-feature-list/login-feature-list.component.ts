import { Component } from '@angular/core';

@Component({
  selector: 'app-login-feature-list',
  imports: [],
  templateUrl: './login-feature-list.component.html',
  styleUrl: './login-feature-list.component.scss',
})
export class LoginFeatureListComponent {
  gridItems = Array(16).fill(null);
}
