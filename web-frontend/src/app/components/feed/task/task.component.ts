import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Habit } from '../../../models/habit.model';
import { HabitLog } from '../../../models/habitlog.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-task-feed',
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskFeedComponent {
  @Input() habitLogData!: {
    habitLog: HabitLog;
    habit: Habit;
    user: User;
  };
}
