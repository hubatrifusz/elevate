import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Habit } from '../../../models/habit.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-task-view',
  imports: [TaskComponent, ReactiveFormsModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  constructor(private authService: AuthService, private alertService: AlertService) {}

  userId = localStorage.getItem('id');
  habitList: Habit[] = [];

  addNewTaskForm = new FormGroup({
    title: new FormControl(''),
    userID: new FormControl(localStorage.getItem('id')),
    description: new FormControl(''),
    frequencyType: new FormControl('Daily'),
    customFrequency: new FormControl(0),
    color: new FormControl('blue'),
    isPositive: new FormControl(true),
  });

  ngOnInit() {
    this.authService.getUserHabits().subscribe({
      next: (response) => (this.habitList = response as Habit[]),
      error: (error) => console.log(error),
    });
  }

  addNewTask() {
    this.authService.addNewTask(this.addNewTaskForm.value).subscribe({
      next: (response) => this.habitList.push(response as Habit),
      error: (error) => alert(error),
    });

    this.toggleFormVisibility();
  }

  deleteHabit(event: Habit) {
    let habitId = event.id;
    this.authService.deleteHabit(habitId).subscribe({
      next: () => this.alertService.showAlert('Task deleted successfully!'),
      error: (error) => this.alertService.showAlert(error),
      complete: () =>
        this.habitList.splice(
          this.habitList.findIndex((habit) => habit.id === habitId),
          1
        ),
    });
  }

  isVisible: boolean = false;
  toggleFormVisibility() {
    this.isVisible = !this.isVisible;
  }
}
