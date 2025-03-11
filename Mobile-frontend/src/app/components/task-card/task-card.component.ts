import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, flameOutline, starOutline, time, trashOutline } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from 'src/app/services/habit.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonIcon, IonCheckbox,
    IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton,
    IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList,
    IonSelect, IonSelectOption, FormsModule]
})
export class TaskCardComponent implements OnInit {
  @Input() loadMoreHabits!: EventEmitter<void>; // Remove initialization
  @Output() hasMoreHabitsChange = new EventEmitter<boolean>();
  habits: Habit[] = [];
  private habitService = inject(HabitService);
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
    });
  }

  constructor(private router: Router) {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline });
  }

  loadHabits() {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (userId) {
      this.habitService.getHabits(userId, this.pageNumber, this.pageSize).subscribe(
        (newHabits) => {
          if (newHabits.length === 0) {
            this.hasMoreHabits = false;
            this.hasMoreHabitsChange.emit(this.hasMoreHabits);
          }
          if (this.pageNumber === 1) {
            this.habits = newHabits; // Initial load
          } else {
            this.habits = [...this.habits, ...newHabits]; // Append new habits
          }
          this.habits.forEach((habit) => {
            if (!habit.color.startsWith('#')) {
              habit.color = '#' + habit.color;
            }
          });
        },
        (error) => {
          console.error('Error loading habits:', error);
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


}