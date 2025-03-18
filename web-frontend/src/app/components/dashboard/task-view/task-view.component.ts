import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  date = new Date();
  weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
  dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

  addNewTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    userID: new FormControl(localStorage.getItem('id')),
    description: new FormControl('', [Validators.required]),
    frequencyType: new FormControl('', [Validators.required]),
    customFrequency: new FormControl(0), //TODO
    color: new FormControl('blue', [Validators.required]),
    isPositive: new FormControl(true),
  });

  ngOnInit() {
    this.getTodaysHabitlogs(this.date.toISOString());
  }

  onSubmit() {
    if (!this.addNewTaskForm.valid) {
      console.log('form is not valid');
      return;
    }
    this.addNewHabit();
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
      error: (error) => console.log(error),
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
    this.habitlogList = [];
    this.habitList = [];

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

  previousDay() {
    this.date.setDate(this.date.getDate() - 1);
    this.updateDateDisplay();
  }

  nextDay() {
    this.date.setDate(this.date.getDate() + 1);
    this.updateDateDisplay();
  }

  updateDateDisplay() {
    this.weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
    this.dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

    this.getTodaysHabitlogs(this.date.toISOString());
  }
}
