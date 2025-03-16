import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption, IonContent, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, flameOutline, starOutline, time, trashOutline } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from 'src/app/services/habit.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonIcon, IonCheckbox,
    IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton,
    IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList,
    IonSelect, IonSelectOption, FormsModule, IonInput]
})
export class TaskCardComponent implements OnInit {

  @Input() loadMoreHabits!: EventEmitter<void>; 
  @Output() hasMoreHabitsChange = new EventEmitter<boolean>();
  habits: Habit[] = [];

  private habitService = inject(HabitService);
  private router = inject(Router);

  private pageNumber = 1; // Set initial page number
  private pageSize = 10; // Set page size
  public hasMoreHabits: boolean = true;

  weekDays = [
    { label: 'M', value: 'Mon' },
    { label: 'T', value: 'Tue' },
    { label: 'W', value: 'Wed' },
    { label: 'T', value: 'Thu' },
    { label: 'F', value: 'Fri' },
    { label: 'S', value: 'Sat' },
    { label: 'S', value: 'Sun' }
  ];

  ngOnInit() {
    this.loadHabits();
    this.loadMoreHabits.subscribe(() => {
      this.loadMore();
      console.log(this.hasMoreHabits)
    });
  }

  constructor() {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline });
  }

  loadHabits() {
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

  loadMore() {
    this.pageNumber++;
    this.loadHabits();
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


  deleteHabit(habit: Habit) {
    this.habits = this.habits.filter((h) => h.id !== habit.id);
    this.habitService.deleteHabit(habit.id).subscribe(
      () => {
        console.log('Habit deleted successfully');
      },
      (error) => {
        console.error('Error deleting habit:', error);
      }
    );
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
  editHabit(habit: Habit) {
    this.habitService.editHabit(habit).subscribe(
      (response) => {
        console.log('Habit edited successfully');
        habit.color = "#" + habit.color;
        console.log(response);
      },
      (error) => {
        console.error('Error editing habit:', error);
      }
    );
  }
}