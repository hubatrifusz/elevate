import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Habit } from '../../../models/habit.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { HabitLog } from '../../../models/habitlog.model';

@Component({
  selector: 'app-task',
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  @Input() habitData!: Habit;
  @Input() habitLogData!: HabitLog;
  @Output() dataEmitter = new EventEmitter<Habit>();
  @Output() taskDoneEmitter = new EventEmitter<HabitLog>();

  showConfirmDialog: boolean = false;

  expandTask(event: MouseEvent) {
    let task_details = (event.target as HTMLElement).closest('#task_container')?.querySelector('#task_details_container');
    task_details?.classList.toggle('expand');
  }

  openConfirmationDialog() {
    this.showConfirmDialog = true;
  }

  taskDone() {
    // this.taskDoneEmitter.emit(this.habitData);
  }

  deleteHabit(result: boolean) {
    if (result) {
      this.dataEmitter.emit(this.habitData);
      document.querySelectorAll('.expand').forEach((el) => el.classList.remove('expand'));
      this.showConfirmDialog = false;
    } else {
      this.showConfirmDialog = false;
    }
  }
}
