import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption, IonContent, IonInput, IonCardHeader, IonCard, IonCardTitle, IonCardContent, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, flameOutline, starOutline, time, trashOutline } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from 'src/app/services/habit.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HabitLog } from 'src/app/.models/HabitLog.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonIcon, IonCheckbox,
    IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton,
    IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList,
    IonSelect, IonSelectOption, FormsModule, IonInput]
})
export class TaskCardComponent implements OnInit {
  @Input() loadMoreHabits!: EventEmitter<void>;
  @Input() set habitlogsDate(value: string | null) {
    this._habitlogsDate = value;
    this.onDateChange(); // Trigger logic when the date changes
  }
  get habitlogsDate(): string | null {
    return this._habitlogsDate;
  }
  @Output() hasMoreHabitsChange = new EventEmitter<boolean>();
  habits: Habit[] = [];
  habitLogs: HabitLog[] = [];
  

  private habitService = inject(HabitService);
  private router = inject(Router);
  private _habitlogsDate: string | null = null;
  private pageNumber = 1; // Set initial page number
  private pageSize = 10; // Set page size
  public hasMoreHabits: boolean = true;
  public checked = false;

  weekDays = [
    { label: 'M', value: 'Mon' },
    { label: 'T', value: 'Tue' },
    { label: 'W', value: 'Wed' },
    { label: 'T', value: 'Thu' },
    { label: 'F', value: 'Fri' },
    { label: 'S', value: 'Sat' },
    { label: 'S', value: 'Sun' }
  ];

  async ngOnInit() {
    const loading = await this.presentLoading();
    if (!this.habitlogsDate) {
      await this.loadHabits(); // Await for better flow control
      loading.dismiss();

      this.loadMoreHabits.subscribe(async () => {
        await this.loadMore(); // Await loadMore
        console.log(this.hasMoreHabits);
      });
    } else {
      loading.dismiss();
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    return loading;
  }

  async onDateChange() {
    if (this.habitlogsDate) {
      const loading = await this.presentLoading();
      console.log(`Date changed to: ${this.habitlogsDate}`);
      this.pageNumber = 1; // Reset pagination
      this.habits = []; // Clear current habits
      await this.loadHabitLogs(); // Await loadHabitLogs
      loading.dismiss();
    } else {
      console.log('Date cleared, loading all habits');
      this.pageNumber = 1; // Reset pagination
      this.habits = []; // Clear current habits
      await this.loadHabits(); // Await loadHabits
    }
  }


  constructor(private loadingController: LoadingController) {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline });
  }

  async loadHabits() {

    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (userId) {
      this.habitService.getHabits(userId, this.pageNumber, this.pageSize).subscribe(
        (newHabits) => {
          if (newHabits.length === 0) {
            this.hasMoreHabits = false;
            console.log('No more habits to load');
            this.hasMoreHabitsChange.emit(this.hasMoreHabits);
          }
          if (this.pageNumber === 1) {
            this.habits = newHabits;
            console.log('Habits loaded successfully');
          } else {
            this.habits = [...this.habits, ...newHabits];
          }
          this.habits.forEach((habit) => {
            console.log(habit);
            if (!habit.color.startsWith('#')) {
              habit.color = '#' + habit.color;
            }
          });
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.hasMoreHabits = false;
            this.hasMoreHabitsChange.emit(this.hasMoreHabits);
            console.log('No more habits to load');
          } else {
            console.error('Error loading habits:', error);
          }
        }
      );
    } else {
      console.warn('User ID not found in localStorage.');
    }
  }

  async loadMore() {
    this.pageNumber++;
    if (this.habitlogsDate != null) {
      await this.loadHabitLogs(); // Await loadHabitLogs
    }
    else {

      await this.loadHabits(); // Await loadHabits
    }
  }

  async loadHabitLogs() {
    const userId = localStorage.getItem('userId');
    if (userId && this.habitlogsDate) {
      try {
        const response = await this.habitService.getTodaysHabitlogs(this.habitlogsDate).toPromise();
        this.habitLogs = response as HabitLog[];
        for (const habitLog of this.habitLogs) {
          await this.getHabitByID(habitLog.habitId); // Await getHabitByID
        }
      } catch (error) {
        console.error('Error loading habit logs:', error);
      }
    }
  }

  async getHabitByID(habitId: string) {
    try {
      const response = await this.habitService.getHabitByID(habitId).toPromise();
      const habit = response as Habit;
      console.log(habitId)
      if (!habit.color.startsWith('#')) {
        habit.color = '#' + habit.color;
      }
      this.habits.push(habit);
    } catch (error) {
      console.error('Error fetching habit by ID:', error);
    }
  }

  toggleDay(habit: Habit, dayIndex: number) {

    if (habit.customFrequency == null) {
      console.log('customFrequency is null or undefined');
      habit.customFrequency = 0; // Initialize to 0 if null or undefined
    }

    let binaryString = habit.customFrequency.toString(2).padStart(7, '0');
    let binaryArray = binaryString.split('');
    binaryArray[dayIndex] = binaryArray[dayIndex] === '1' ? '0' : '1';
    habit.customFrequency = parseInt(binaryArray.join(''), 2);

    // Update the habit in the habits array
    const index = this.habits.findIndex(h => h.id === habit.id);
    if (index !== -1) {
      this.habits[index] = { ...habit }; // Create a new object
    }

    // Save the updated habit to the backend
    this.editHabit(habit);

    console.log(habit.customFrequency);
    console.log(habit);
  }

  isSelectedDay(customFrequency: number, dayIndex: number): boolean {
    if (customFrequency != null) {
      const binaryString = customFrequency.toString(2).padStart(7, '0');
      return binaryString.charAt(dayIndex) === '1';
    }
    else {
      return false;
    }
  }



  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  trackById(index: number, habit: Habit): string {
    return habit.id;
  }


  async deleteHabit(habit: Habit) {
    this.habits = this.habits.filter((h) => h.id !== habit.id);
    try {
      await this.habitService.deleteHabit(habit.id).toPromise();
      console.log('Habit deleted successfully');
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }

  onDescriptionBlur(habit: Habit) {
    console.log('Description:', habit.description);
    this.editHabit(habit);
  }

  onFrequencyChange(habit: Habit, event: any) {
    console.log('Frequency:', event.detail.value);
    this.editHabit(habit);
  }

  onColorChange(habit: Habit, event: any) {
    console.log('Color:', event.detail.value);
    if (!event.detail.value.startsWith('#')) {
      habit.color = '#' + event.detail.value;
    }
    this.editHabit(habit);
  }

  onPositiveChange(habit: Habit, event: any) {
    console.log('Is Positive:', event.detail.checked);
    this.editHabit(habit);
  }
  async editHabit(habit: Habit) {
    try {
      const response = await this.habitService.editHabit(habit).toPromise();
      console.log('Habit edited successfully');
      habit.color = '#' + habit.color;
      console.log(response);
    } catch (error) {
      console.error('Error editing habit:', error);
    }
  }
}