import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'app-task-view',
  imports: [TaskComponent, ReactiveFormsModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  constructor(private authService: AuthService) {}

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
      next: (response) => (this.habitList = response),
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

  isVisible: boolean = false;
  toggleFormVisibility() {
    this.isVisible = !this.isVisible;
  }
}
