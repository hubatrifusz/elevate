import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'app-task',
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() habitData!: Habit;
}
