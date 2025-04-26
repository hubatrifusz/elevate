import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-horseshoe-visualization',
  templateUrl: './horseshoe-visualization.component.html',
  styleUrls: ['./horseshoe-visualization.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HorseshoeVisualizationComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() updatedAt!: Date;
  @Input() size: number = 150; // Size of the horseshoe in pixels
  @Input() strokeWidth: number = 10; // Width of the horseshoe stroke
  @Input() primaryColor: string = '#2196F3'; // Color of the horseshoe
  @Input() secondaryColor: string = '#e0e0e0'; // Background color

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  // Calculated elapsed time
  elapsedDays: number = 0;
  elapsedHours: number = 0;
  elapsedMinutes: number = 0;
  elapsedSeconds: number = 0;
  elapsedTimeText: string = '';

  constructor() { }

  ngOnInit(): void {
    this.calculateElapsedTime();
  }

  ngAfterViewInit(): void {
    this.drawHorseshoe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['updatedAt']) {
      this.calculateElapsedTime();
      if (this.canvas) {
        this.drawHorseshoe();
      }
    }
  }

  calculateElapsedTime(): void {
    if (!this.updatedAt) return;

    const now = new Date();
    const updated = new Date(this.updatedAt);
    const diffMs = now.getTime() - updated.getTime();

    // Calculate days, hours, minutes, seconds
    this.elapsedSeconds = Math.floor(diffMs / 1000) % 60;
    this.elapsedMinutes = Math.floor(diffMs / (1000 * 60)) % 60;
    this.elapsedHours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    this.elapsedDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Format the elapsed time text
    this.formatElapsedTimeText();
  }

  formatElapsedTimeText(): void {
    let text = '';

    if (this.elapsedDays > 0) {
      text += `${this.elapsedDays}d `;
    }

    if (this.elapsedHours > 0 || this.elapsedDays > 0) {
      text += `${this.elapsedHours}h `;
    }

    if (this.elapsedMinutes > 0 || this.elapsedHours > 0 || this.elapsedDays > 0) {
      text += `${this.elapsedMinutes}m `;
    }

    text += `${this.elapsedSeconds}s`;

    this.elapsedTimeText = text;
  }

  drawHorseshoe(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas dimensions
    canvas.width = this.size;
    canvas.height = this.size;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = (canvas.width - this.strokeWidth) / 2;

    // Calculate progress (max is 30 days, after that it stays at 100%)
    const totalSeconds = this.elapsedDays * 24 * 60 * 60 +
      this.elapsedHours * 60 * 60 +
      this.elapsedMinutes * 60 +
      this.elapsedSeconds;
    const maxSeconds = 30 * 24 * 60 * 60; // 30 days
    const progress = Math.min(totalSeconds / maxSeconds, 1);

    // Draw background horseshoe (300 degrees, not full circle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.25, Math.PI * 2.25, false);
    ctx.strokeStyle = this.secondaryColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw progress horseshoe
    const progressAngle = Math.PI * 0.25 + (Math.PI * 2) * progress;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.25, progressAngle, false);
    ctx.strokeStyle = this.primaryColor;
    ctx.lineWidth = this.strokeWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw text in the center
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw elapsed time
    if (this.elapsedDays > 0) {
      ctx.fillText(`${this.elapsedDays} days`, centerX, centerY - 10);
      ctx.fillText(`${this.elapsedHours}h ${this.elapsedMinutes}m`, centerX, centerY + 10);
    } else if (this.elapsedHours > 0) {
      ctx.fillText(`${this.elapsedHours}h ${this.elapsedMinutes}m`, centerX, centerY - 5);
      ctx.fillText(`${this.elapsedSeconds}s`, centerX, centerY + 15);
    } else {
      ctx.fillText(this.elapsedTimeText, centerX, centerY);
    }
  }
}
