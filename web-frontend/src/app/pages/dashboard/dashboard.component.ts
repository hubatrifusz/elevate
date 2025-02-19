import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  animate() {
    let divList = document.querySelectorAll('.div');
    divList.forEach((element) => {
      element.classList.toggle('animate');
    });
  }
}
