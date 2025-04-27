import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NegativeHabit } from 'src/app/.models/NegativeHabit.model';
import { IonItem, IonButton, IonLabel, IonCard, IonCardContent, IonIcon, IonCol, IonProgressBar, IonRow, IonChip, IonText } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { calendarOutline, refreshOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-negative-habit-card',
  templateUrl: './negative-habit-card.component.html',
  styleUrls: ['./negative-habit-card.component.scss'],
  imports: [IonText, IonChip, IonRow, IonProgressBar, IonCol, IonIcon, IonCardContent, IonCard, IonItem, IonLabel, IonButton, CommonModule]
})
export class NegativeHabitCardComponent implements OnInit {
  @Input() habit: NegativeHabit | null = null;
  @Output() deleteHabitEvent = new EventEmitter<string>();
  @Output() resetHabitEvent = new EventEmitter<string>();

  daysSinceLastOccurrence: number = 0;
  progressValue: number = 0;
  currentGoal: string = '';
  nextGoalDays: number = 0;

  private milestones = [
    { name: '1 Month', days: 30 },
    { name: '3 Months', days: 90 },
    { name: '6 Months', days: 180 },
    { name: '1 Year', days: 365 },
    { name: '2 Years', days: 730 }
  ];


  constructor() {
    addIcons({ trashOutline, refreshOutline, calendarOutline });
  }

  ngOnInit() {
    this.calculateDaysSinceLastOccurrence();
  }
  private calculateDaysSinceLastOccurrence() {
    if (this.habit?.updatedAt) {
      const lastDate = new Date(this.habit.updatedAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      this.daysSinceLastOccurrence = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate current goal and progress
      this.calculateGoalProgress();
    }
  }
  private calculateGoalProgress() {
    // Find the next milestone
    let nextMilestone = this.milestones[0];

    for (const milestone of this.milestones) {
      if (this.daysSinceLastOccurrence < milestone.days) {
        nextMilestone = milestone;
        break;
      }
    }

    // If we've passed all milestones, use the last one
    if (this.daysSinceLastOccurrence >= this.milestones[this.milestones.length - 1].days) {
      const lastMilestone = this.milestones[this.milestones.length - 1];
      this.currentGoal = `Beyond ${lastMilestone.name}!`;
      this.progressValue = 1; // 100%
      this.nextGoalDays = lastMilestone.days;
    } else {
      // Find the previous milestone (or 0 if this is the first milestone)
      const milestoneIndex = this.milestones.indexOf(nextMilestone);
      const prevMilestoneDays = milestoneIndex > 0 ? this.milestones[milestoneIndex - 1].days : 0;

      // Calculate progress between previous milestone and next milestone
      const milestoneDuration = nextMilestone.days - prevMilestoneDays;
      const progressInCurrentMilestone = this.daysSinceLastOccurrence - prevMilestoneDays;

      this.progressValue = progressInCurrentMilestone / milestoneDuration;
      this.currentGoal = nextMilestone.name;
      this.nextGoalDays = nextMilestone.days;
    }
  }

  deleteHabit(habitId: string) {
    this.deleteHabitEvent.emit(habitId);
  }
  resetHabit(habitId: string) {
    this.resetHabitEvent.emit(habitId);
  }
}
