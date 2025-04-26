import { Component, Input, OnInit } from '@angular/core';
import { NegativeHabit } from 'src/app/.models/NegativeHabit.model';
import { IonItem, IonButton, IonLabel, IonCard, IonCardContent, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-negative-habit-card',
  templateUrl: './negative-habit-card.component.html',
  styleUrls: ['./negative-habit-card.component.scss'],
  imports: [IonIcon, IonCardContent, IonCard, IonItem, IonLabel, IonButton,CommonModule]
})
export class NegativeHabitCardComponent  implements OnInit {
  @Input() habit: NegativeHabit | null = null;
  daysSinceLastOccurrence: number = 0;
  progressValue: number = 0;
  progressDays: number = 0;
  constructor() { }

  ngOnInit() {
    this.calculateDaysSinceLastOccurrence();
  }
  private calculateDaysSinceLastOccurrence() {
    if (this.habit?.updatedAt) {
      const lastDate = new Date(this.habit.updatedAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      this.daysSinceLastOccurrence = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Cap at 100% for progress bar
      const targetDays = 30; // Example: 30 days goal
      this.progressValue = Math.min(this.daysSinceLastOccurrence / targetDays, 1);
      this.progressDays = this.daysSinceLastOccurrence;
    }
  }
}
