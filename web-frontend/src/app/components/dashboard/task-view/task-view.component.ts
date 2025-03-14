import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Habit } from '../../../models/habit.model';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { HabitLog } from '../../../models/habitlog.model';

@Component({
  selector: 'app-task-view',
  imports: [TaskComponent, ReactiveFormsModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  constructor(private alertService: AlertService, private userService: UserService) {}

  userId = localStorage.getItem('id');
  habitlogList: HabitLog[] = [];
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
    const today = new Date().toISOString();
    this.getTodaysHabitlogs(today);
  }

  getHabitByID(habitId: string) {
    this.userService.getHabitByID(habitId).subscribe({
      next: (response) => this.habitList.push(response),
      error: (error) => console.log(error),
    });
  }

  addNewHabit() {
    this.userService.addNewHabit(this.addNewTaskForm.value).subscribe({
      next: (response) => this.habitList.push(response as Habit),
      error: (error) => alert(error),
    });

    this.toggleFormVisibility();
  }

  deleteHabit(event: Habit) {
    let habitId = event.id;
    this.userService.deleteHabit(habitId).subscribe({
      next: () => this.alertService.showAlert('Task deleted successfully!'),
      error: (error) => this.alertService.showAlert(error),
      complete: () =>
        this.habitList.splice(
          this.habitList.findIndex((habit) => habit.id === habitId),
          1
        ),
    });
  }

  getTodaysHabitlogs(today: string) {
    this.userService.getTodaysHabitlogs(today).subscribe({
      next: (response) => (this.habitlogList = response as HabitLog[]),
      error: (error) => console.log(error),
      complete: () => {
        this.habitlogList.forEach((habitlog) => {
          this.getHabitByID(habitlog.habitId);
        });
      },
    });
  }

  getAllHabits() {
    this.userService.getHabits().subscribe({
      // next: (response) => (this.habitList = response as Habit[]),
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  isVisible: boolean = false;
  toggleFormVisibility() {
    this.isVisible = !this.isVisible;
  }
}
