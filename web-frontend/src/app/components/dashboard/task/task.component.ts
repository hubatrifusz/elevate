import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { Habit } from '../../../models/habit.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { HabitLog } from '../../../models/habitlog.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-task',
  imports: [CommonModule, ConfirmDialogComponent, ReactiveFormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  @Input() habitData!: Habit;
  @Input() habitLogData!: HabitLog;
  @Input() isToday: boolean = true; // Default to true
  @Output() dataEmitter = new EventEmitter<Habit>();
  @Output() taskDoneEmitter = new EventEmitter<HabitLog>();
  @ViewChild('taskElement', { static: true }) taskElement!: ElementRef;
  @ViewChild('task_checkbox_input', { static: false }) taskCheckboxInput?: ElementRef;
  @ViewChild('checkmark', { static: false }) checkmark?: ElementRef;
  @ViewChild('checkbox', { static: false }) checkbox?: ElementRef;

  constructor(private userService: UserService) { }

  showConfirmDialog: boolean = false;

  taskCheckbox = new FormControl();
  notes = new FormControl('');

  taskCheckboxChecked = this.taskCheckbox.value;

  ngOnInit() {
    // Set notes form control value from habit log data
    if (this.habitLogData.notes) {
      this.notes.setValue(this.habitLogData.notes);
    }

    // Only apply disabled styling if it's completed and visible today
    if (this.habitLogData.completed && this.isToday) {
      this.taskElement.nativeElement.classList.add('task_container_disabled');

      // Wait until the view is fully rendered to access these elements
      setTimeout(() => {
        if (this.checkmark && this.checkbox) {
          this.checkmark.nativeElement.style.opacity = '1';
          this.checkbox.nativeElement.style.border = '2px solid hsl(249, 40%, 50%)';
        }
      });
    }
  }

  expandTask() {
    let taskDetails = this.taskElement.nativeElement.querySelector('.task_details_container');
    taskDetails?.classList.toggle('expand');
  }

  closeTask() {
    let taskDetails = this.taskElement.nativeElement.querySelector('.task_details_container');
    taskDetails?.classList.remove('expand');
  }

  saveNotes() {
    if (!this.habitLogData.notes || this.habitLogData.notes !== this.notes.value) {
      let updatedHabitLog = {
        notes: this.notes.value,
        isPublic: this.habitLogData.isPublic,
      };

      this.userService.updateHabitLog(this.habitLogData.id, updatedHabitLog).subscribe({
        next: () => {
          this.habitLogData.notes = this.notes.value || '';
        },
        error: (error) => console.log(error)
      });
    }
  }

  openConfirmationDialog() {
    this.showConfirmDialog = true;
  }

  taskDone(event: Event) {
    this.closeTask();
    const taskContainer = (event.target as HTMLElement).closest('.task_container') as HTMLElement;

    let updatedHabitLog = {
      completed: this.taskCheckbox.value,
      notes: this.notes.value,
      isPublic: this.habitLogData.isPublic,
    };

    this.userService.updateHabitLog(this.habitLogData.id, updatedHabitLog).subscribe({
      next: (res) => {
        this.habitData.streak++;
      },
      error: (error) => console.log(error),
      complete: () => {
        taskContainer.classList.add('task_container_disabled');
      },
    });
  }
}
