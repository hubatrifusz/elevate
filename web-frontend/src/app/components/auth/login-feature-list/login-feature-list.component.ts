import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-login-feature-list',
  imports: [],
  templateUrl: './login-feature-list.component.html',
  styleUrl: './login-feature-list.component.scss',
})
export class LoginFeatureListComponent {
  gridItems = Array.from({ length: 16 });

  @HostListener('window:load')
  onLoad() {
    let grid = Array.from((document.querySelector('.grid') as HTMLElement)?.children);

    grid[9].children[0].classList.add('item-card');

  }
}
