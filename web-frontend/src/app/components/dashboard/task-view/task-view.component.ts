import { Component } from '@angular/core';
import { TaskComponent } from '../task/task.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit } from '../../../models/habit.model';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { HabitLog } from '../../../models/habitlog.model';
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-task-view',
  imports: [TaskComponent, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss',
})
export class TaskViewComponent {
  constructor(private alertService: AlertService, private userService: UserService, private authService: AuthService) { }

  userId!: string | null;
  habitlogList: HabitLog[] = [];
  habitList: Habit[] = [];
  date = new Date();
  weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
  dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

  isPreviousDisabled: boolean = false;
  isNextDisabled: boolean = false;
  isLoading: boolean = false;

  addNewTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    userID: new FormControl(),
    description: new FormControl('', [Validators.required]),
    frequencyType: new FormControl('', [Validators.required]),
    customFrequency: new FormControl(0), //TODO
    color: new FormControl('#000000', [Validators.required]),
    isNegativeHabit: new FormControl(false),
  });

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.addNewTaskForm.patchValue({
      userID: this.userId,
    });
    this.getTodaysHabitlogs(this.date.toISOString());

    this.addNewTaskForm.get('isNegativeHabit')?.valueChanges.subscribe(isNegative => {
      const frequencyControl = this.addNewTaskForm.get('frequencyType');

      if (isNegative) {
        frequencyControl?.clearValidators();
        frequencyControl?.updateValueAndValidity();
      } else {
        frequencyControl?.setValidators([Validators.required]);
        frequencyControl?.updateValueAndValidity();
      }
    });
  }

  toggleNegativeHabit() {
    const currentValue = this.addNewTaskForm.get('isNegativeHabit')?.value;
    this.addNewTaskForm.patchValue({
      isNegativeHabit: !currentValue
    });
  }

  onSubmit() {
    const isNegativeHabit = this.addNewTaskForm.get('isNegativeHabit')?.value;

    if (isNegativeHabit) {
      const { title, description, color } = this.addNewTaskForm.controls;
      if (!title.valid || !description.valid || !color.valid) {
        this.alertService.showAlert('Please fill in all required fields');
        return;
      }
    } else if (!this.addNewTaskForm.valid) {
      this.alertService.showAlert('Please fill in all required fields');
      return;
    }

    let colorValue = this.addNewTaskForm.value.color || '';
    if (colorValue.startsWith('#')) {
      this.addNewTaskForm.patchValue({
        color: colorValue.substring(1),
      });
    }

    console.log(this.addNewTaskForm.value);
    this.addNewHabit();
  }

  getHabitByID(habitId: string) {
    this.userService.getHabitByID(habitId).subscribe({
      next: (response) => {
        this.habitList.push(response);

        if (this.habitList.length >= this.habitlogList.length) {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  getHabitForLog(habitLog: HabitLog): Habit | undefined {
    return this.habitList.find((habit) => habit.id === habitLog.habitId);
  }

  addNewHabit() {
    const formData = this.addNewTaskForm.value;
    const isNegative = formData.isNegativeHabit === true;

    if (isNegative) {
      const negativeHabitData = {
        userId: formData.userID,
        title: formData.title,
        description: formData.description,
        color: formData.color
      };

      this.userService.addNewNegativeHabit(negativeHabitData).subscribe({
        next: (response) => this.habitList.push(response as Habit),
        error: (error) => {
          console.log(error);
          this.alertService.showAlert('Failed to create negative habit');
        },
        complete: () => {
          this.alertService.showAlert('Negative habit created successfully!');
          this.getTodaysHabitlogs(this.date.toISOString());
        },
      });
    } else {
      this.userService.addNewHabit(formData).subscribe({
        next: (response) => this.habitList.push(response as Habit),
        error: (error) => {
          console.log(error);
          this.alertService.showAlert('Failed to create habit');
        },
        complete: () => {
          this.alertService.showAlert('Habit created successfully!');
          this.getTodaysHabitlogs(this.date.toISOString());
        },
      });
    }

    this.addNewTaskForm.reset({
      color: '#000000',
      isNegativeHabit: false
    });
    this.toggleFormVisibility();
  }

  patchHabitLog(event: HabitLog) {
    this.userService.updateHabitLog(event.id, event).subscribe({
      next: () => this.alertService.showAlert('Task updated successfully!'),
      error: (error) => this.alertService.showAlert(error),
    });
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
    this.isLoading = true;

    this.userService.getTodaysHabitlogs(today).subscribe({
      next: (response) => {
        this.habitlogList = response as HabitLog[];

        if (this.habitlogList.length === 0) {
          this.isLoading = false;
        } else {
          this.habitlogList.forEach((habitlog) => {
            this.getHabitByID(habitlog.habitId);
          });
        }
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  getAllHabits() {
    this.userService.getHabits().subscribe({
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

    const today = new Date();
    this.isPreviousDisabled = this.date.toDateString() === today.toDateString();
    this.isNextDisabled =
      this.date.getDate() === today.getDate() &&
      this.date.getMonth() === (today.getMonth() + 1) % 12;

    this.getTodaysHabitlogs(this.date.toISOString());
  }

  isForToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  isCurrentDateToday(): boolean {
    const today = new Date();
    return this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear();
  }
}
