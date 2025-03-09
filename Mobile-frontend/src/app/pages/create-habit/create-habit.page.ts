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
    frequencyType: Frequency.Daily,
    customFrequency: 0,
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

      // Prepare the habit data for the backend
      const habitData = {
        title: this.habit.title,
        userID: userId, // Map userId to userID
        description: this.habit.description,
        frequencyType: this.habit.frequencyType, // Map frequency to frequencyType
        customFrequency: this.habit.customFrequency,
        color: this.habit.color,
        isPositive: this.habit.is_positive // Map is_positive to isPositive
      };
      console.log('Creating habit:', habitData);
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
    // const index = this.habits.findIndex(h => h.id === habit.id);
    // if (index !== -1) {
    //   this.habits[index] = { ...habit }; // Create a new object
    // }

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


  updateCustomFrequency() {
    let binaryString = '';
    for (let i = 0; i < this.selectedDays.length; i++) {
      binaryString += this.selectedDays[i] ? '1' : '0';
    }
    this.habit.customFrequency = parseInt(binaryString, 2);
  }
}