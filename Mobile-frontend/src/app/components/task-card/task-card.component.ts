import { Component, inject, OnInit } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
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
  imports: [IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList, IonSelect, IonSelectOption, FormsModule]
})
export class TaskCardComponent implements OnInit {

  habits: Habit[] = [];
  private habitService = inject(HabitService);
  private pageNumber = 1; // Set initial page number
  private pageSize = 10; // Set page size

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
  }

  constructor(private router: Router) {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline });
  }

  loadHabits() {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage


    if (userId) {
      this.habitService.getHabits(userId, this.pageNumber, this.pageSize).subscribe(
        (habits) => {
          this.habits = habits;
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
      // Handle the case where the user ID is not available (e.g., redirect to login)
    }
  }

  toggleDay(habit: Habit, dayIndex: number) {
    if (habit.custom_frequency == null) {
      console.log('custom_frequency is null or undefined');
      habit.custom_frequency = 0; // Initialize to 0 if null or undefined
    }

    let binaryString = habit.custom_frequency.toString(2).padStart(7, '0');
    let binaryArray = binaryString.split('');
    binaryArray[dayIndex] = binaryArray[dayIndex] === '1' ? '0' : '1';
    habit.custom_frequency = parseInt(binaryArray.join(''), 2);

    // Update the habit in the habits array
    const index = this.habits.findIndex(h => h.id === habit.id);
    if (index !== -1) {
      this.habits[index] = { ...habit }; // Create a new object
    }

    console.log(habit.custom_frequency);
    console.log(habit);
  }

   isSelectedDay(custom_frequency: number, dayIndex: number): boolean {
    
    if (custom_frequency != null) {
      const binaryString = custom_frequency.toString(2).padStart(7, '0');
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
  }


}