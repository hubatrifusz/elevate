import { Component, OnInit } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, flameOutline, starOutline, time, trashOutline } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList, IonSelect, IonSelectOption, FormsModule]
})
export class TaskCardComponent implements OnInit {

  habits: Habit[] = [];

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
    this.habits.push({
      id: '1',
      created_at: new Date(),
      title: 'Casino edzés',
      description: 'Do a workout and break a sweat. Be active!',
      frequency: Frequency.Daily,
      custom_frequency: '1000001', // Monday and Sunday
      color: '#28a745', // success (green)
      is_positive: true,
      streak: 30,
      streak_start: new Date()
    });
    this.habits.push({
      id: '2',
      created_at: new Date(),
      title: 'Read',
      description: 'Read a book',
      frequency: Frequency.Daily,
      custom_frequency: '1111111', // Every day
      color: '#ffc107', // warning (yellow)
      is_positive: false,
      streak: 0,
      streak_start: new Date()
    });
    this.habits.push({
      id: '3',
      created_at: new Date(),
      title: 'Meditate',
      description: 'Meditate for 10 minutes',
      frequency: Frequency.Daily,
      custom_frequency: '0111110', // Tuesday to Saturday
      color: '#dc3545', // danger (red)
      is_positive: true,
      streak: 2,
      streak_start: new Date()
    });
    this.habits.push({
      id: '4',
      created_at: new Date(),
      title: 'Drink Water',
      description: 'Drink 8 glasses of water',
      frequency: Frequency.Daily,
      custom_frequency: '1111111', // Every day
      color: '#007bff', // primary (blue)
      is_positive: false,
      streak: 0,
      streak_start: new Date()
    });
    this.habits.push({
      id: '5',
      created_at: new Date(),
      title: 'Journal',
      description: 'Write in your journal',
      frequency: Frequency.Weekly,
      custom_frequency: '1000000', // Monday
      color: '#6f42c1', // tertiary (purple)
      is_positive: true,
      streak: 0,
      streak_start: new Date()
    });
    this.habits.push({
      id: '6',
      created_at: new Date(),
      title: 'Yoga',
      description: 'Practice yoga',
      frequency: Frequency.Weekly,
      custom_frequency: '0000010', // Saturday
      color: '#6c757d', // secondary (gray)
      is_positive: true,
      streak: 0,
      streak_start: new Date()
    });
    this.habits.push({
      id: '7',
      created_at: new Date(),
      title: 'Sleep Early',
      description: 'Go to bed by 10 PM',
      frequency: Frequency.Daily,
      custom_frequency: '1111110', // Every day except Sunday
      color: '#343a40', // dark (dark gray)
      is_positive: false,
      streak: 0,
      streak_start: new Date()
    });
  }

  constructor(private router: Router) {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline });
  }



  isSelectedDay(customFrequency: string, dayIndex: number): boolean {
    return customFrequency.charAt(dayIndex) === '1';
  }

  toggleDay(habit: Habit, dayIndex: number) {
    let customFrequencyArray = habit.custom_frequency.split('');
    customFrequencyArray[dayIndex] = customFrequencyArray[dayIndex] === '1' ? '0' : '1';
    habit.custom_frequency = customFrequencyArray.join('');
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