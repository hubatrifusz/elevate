import { Component, OnInit } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, time } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import {  } from '@ionic/angular';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton]
})
export class TaskCardComponent implements OnInit {

  habits: Habit[] = [];

  ngOnInit() {
    this.habits.push({
      id: '1',
      created_at: new Date(),
      title: 'Workout',
      description: 'Do a workout',
      frequency: Frequency.Daily,
      custom_frequency: 1,
      color: '#28a745', // success (green)
      is_positive: true,
      streak: 0,
      streak_start: new Date()
    });
    this.habits.push({
      id: '2',
      created_at: new Date(),
      title: 'Read',
      description: 'Read a book',
      frequency: Frequency.Daily,
      custom_frequency: 1,
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
      custom_frequency: 1,
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
      custom_frequency: 1,
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
      custom_frequency: 1,
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
      custom_frequency: 1,
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
      custom_frequency: 1,
      color: '#343a40', // dark (dark gray)
      is_positive: false,
      streak: 0,
      streak_start: new Date()
    });
  }

  constructor(private router: Router) {
    addIcons({ time, chevronDownOutline });
  }

  openHabitDetails(habit: Habit) {
    this.router.navigate(['/habit-details', habit.id]);
  }

}