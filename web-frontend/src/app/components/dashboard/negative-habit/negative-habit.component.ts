import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NegativeHabit } from '../../../models/habit.model';

@Component({
  selector: 'app-negative-habit',
  imports: [],
  templateUrl: './negative-habit.component.html',
  styleUrl: './negative-habit.component.scss',
})
export class NegativeHabitComponent {
  @Input() habitData!: NegativeHabit;
  @ViewChild('counter', { static: true }) counter!: ElementRef;
  differenceInDays: number = 0;
  private intervalId: any;

  private updateTimeDifference() {
    let targetDate = new Date(this.habitData.updatedAt);
    targetDate.setHours(targetDate.getHours() - 2);
    let currentDate = new Date();

    let differenceInMilliseconds = currentDate.getTime() - targetDate.getTime();
    this.differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60) / 24);
  }

  ngOnInit() {
    this.updateTimeDifference();

    this.intervalId = setInterval(() => {
      this.updateTimeDifference();
    }, 600000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ngAfterViewInit() {
    if (this.counter) {
      this.counter.nativeElement.style.background = `conic-gradient(#${this.habitData.color} 0% ${this.differenceInDays / 3.65}%, transparent ${
        this.differenceInDays / 3.65
      }% 100%)`;
    }
  }
}
