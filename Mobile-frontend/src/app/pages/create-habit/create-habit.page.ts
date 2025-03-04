import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitService } from 'src/app/services/habit.service';
import { Frequency, Habit } from 'src/app/.models/Habit.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-create-habit',
  templateUrl: './create-habit.page.html',
  styleUrls: ['./create-habit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreateHabitPage implements OnInit {

  habit: Habit = {
    id: '',
    created_at: new Date(),
    title: '',
    description: '',
    frequency: Frequency.Custom,
    custom_frequency: 0,
    color: '#000000',
    is_positive: true,
    streak: 0,
    streak_start: new Date()
  };

  weekDays = [
    { label: 'M', value: 'Mon' },
    { label: 'T', value: 'Tue' },
    { label: 'W', value: 'Wed' },
    { label: 'T', value: 'Thu' },
    { label: 'F', value: 'Fri' },
    { label: 'S', value: 'Sat' },
    { label: 'S', value: 'Sun' }
  ];

  selectedDays: boolean[] = [false, false, false, false, false, false, false];

  constructor(private router: Router, private habitService: HabitService) { }

  ngOnInit() {
  }

  createHabit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Remove '#' if it exists before sending to the backend
      if (this.habit.color.startsWith('#')) {
        this.habit.color = this.habit.color.slice(1);
      }

      // Convert frequency to number
      // let frequencyNumber: number;
      // switch (this.habit.frequency) {
      //   case "Daily":
      //     frequencyNumber = 0;
      //     break;
      //   case "Weekly":
      //     frequencyNumber = 1;
      //     break;
      //   case "Monthly":
      //     frequencyNumber = 2;
      //     break;
      //   case "Custom":
      //     frequencyNumber = 3;
      //     break;
      //   default:
      //     frequencyNumber = 0; // Default to Daily
      // }

      // Prepare the habit data for the backend
      const habitData = {
        title: this.habit.title,
        userID: userId, // Map userId to userID
        description: this.habit.description,
        frequencyType: 1, // Map frequency to frequencyType
        customFrequency: this.habit.custom_frequency,
        color: this.habit.color,
        isPositive: this.habit.is_positive // Map is_positive to isPositive
      };

      this.habitService.createHabit(habitData).subscribe(
        (response) => {
          console.log('Habit created successfully:', response);
          this.router.navigate(['/footertabs/feed']); // Navigate back to the feed
        },
        (error) => {
          console.error('Error creating habit:', error);
        }
      );
    } else {
      console.warn('User ID not found in localStorage.');
      // Handle the case where the user ID is not available (e.g., redirect to login)
    }
  }

  toggleDay(index: number) {
    this.selectedDays[index] = !this.selectedDays[index];
    this.updateCustomFrequency();
  }

  isSelectedDay(index: number): boolean {
    return this.selectedDays[index];
  }

  updateCustomFrequency() {
    let binaryString = '';
    for (let i = 0; i < this.selectedDays.length; i++) {
      binaryString += this.selectedDays[i] ? '1' : '0';
    }
    this.habit.custom_frequency = parseInt(binaryString, 2);
  }
}