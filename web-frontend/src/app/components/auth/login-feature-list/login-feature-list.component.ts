import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login-feature-list',
  imports: [],
  templateUrl: './login-feature-list.component.html',
  styleUrl: './login-feature-list.component.scss',
})
export class LoginFeatureListComponent {
  @ViewChild('myVideo') videoRef!: ElementRef<HTMLVideoElement>;
  gridItems = Array.from({ length: 16 });

  ngAfterViewInit(): void {
    let grid = Array.from((document.querySelector('.grid') as HTMLElement)?.children);

    grid[9].children[0].classList.add('item-card');

    const video = this.videoRef.nativeElement;
    video.muted = true; // important in some browsers
    video.play().catch((err) => {
      console.warn('Autoplay failed:', err);
    });
  }
}
