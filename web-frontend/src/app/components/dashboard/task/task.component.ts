import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
export class TaskComponent {
  @Input() habitData!: Habit;
  @Input() habitLogData!: HabitLog;
  @Output() dataEmitter = new EventEmitter<Habit>();
  @Output() taskDoneEmitter = new EventEmitter<HabitLog>();
  @ViewChild('taskElement', { static: true }) taskElement!: ElementRef;
  @ViewChild('task_checkbox_input', { static: true }) taskCheckboxInput!: ElementRef;
  @ViewChild('checkmark', { static: true }) checkmark!: ElementRef;
  @ViewChild('checkbox', { static: true }) checkbox!: ElementRef;

  constructor(private userService: UserService) {}

  showConfirmDialog: boolean = false;

  taskCheckbox = new FormControl();
  notes = new FormControl('');

  notesValue: string = '';

  taskCheckboxChecked = this.taskCheckbox.value;

  ngOnInit() {
    if (this.habitLogData.completed) {
      this.taskElement.nativeElement.classList.add('task_container_disabled');
      this.checkmark.nativeElement.style.opacity = '1';
      this.checkbox.nativeElement.style.border = '2px solid hsl(249, 40%, 50%)';
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
    this.notesValue = this.notes.value!;
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
        console.log(res);
      },
      error: (error) => console.log(error),
      complete: () => {
        taskContainer.classList.add('task_container_disabled');
      },
    });
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
