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
  pixelRatio: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.calculateElapsedTime();
    // Get device pixel ratio for high-DPI screens
    this.pixelRatio = window.devicePixelRatio || 1;
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

    // Scale for high-DPI displays
    const displayWidth = this.size;
    const displayHeight = this.size;

    // Set canvas dimensions with device pixel ratio
    canvas.width = displayWidth * this.pixelRatio;
    canvas.height = displayHeight * this.pixelRatio;

    // Set the CSS size
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Scale the context to account for the device pixel ratio
    ctx.scale(this.pixelRatio, this.pixelRatio);

    // Clear the canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const radius = (displayWidth - this.strokeWidth) / 2;

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

    // Improved text rendering
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Enable font smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Align text on pixel boundaries for crisp rendering
    const drawText = (text: string, x: number, y: number) => {
      const roundedX = Math.round(x);
      const roundedY = Math.round(y);
      ctx.fillText(text, roundedX, roundedY);
    };

    // Draw elapsed time with sharper text
    if (this.elapsedDays > 0) {
      drawText(`${this.elapsedDays} day${this.elapsedDays > 1 ? 's' : ''}`, centerX, centerY - 12);
      drawText(`${this.elapsedHours}h ${this.elapsedMinutes}m`, centerX, centerY + 12);
    } else if (this.elapsedHours > 0) {
      drawText(`${this.elapsedHours}h ${this.elapsedMinutes}m`, centerX, centerY - 8);
      drawText(`${this.elapsedSeconds}s`, centerX, centerY + 12);
    } else {
      drawText(this.elapsedTimeText, centerX, centerY);
    }
  }
}
