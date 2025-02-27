import { Component, OnInit } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { time } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonIcon, IonCheckbox, IonLabel]
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
      color: 'success',
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
      color: 'warning',
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
      color: 'danger',
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
      color: 'primary',
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
      color: 'tertiary',
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
      color: 'secondary',
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
      color: 'dark',
      is_positive: false,
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
      color: 'dark',
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
      color: 'dark',
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
      color: 'dark',
      is_positive: true,
      streak: 0,
      streak_start: new Date()
    });
  }

  constructor(private router: Router) {
    addIcons({ time });
  }

  openHabitDetails(habit: Habit) {
    this.router.navigate(['/habit-details', habit.id]);
  }

}
