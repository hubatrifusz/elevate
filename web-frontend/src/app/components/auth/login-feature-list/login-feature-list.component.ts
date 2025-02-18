import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login-feature-list',
  imports: [],
  templateUrl: './login-feature-list.component.html',
  styleUrl: './login-feature-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LoginFeatureListComponent {
  ngOnInit() {
    this.autoScrollFeatureCarousel();
    this.addNavDots();
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
}
