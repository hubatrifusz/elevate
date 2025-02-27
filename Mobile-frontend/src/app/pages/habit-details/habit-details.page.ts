import { Component, Input, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonMenuToggle, IonTitle, IonToolbar, IonTabButton, IonButton, IonIcon, IonButtons, IonCardHeader, IonCard, IonCardSubtitle, IonCardTitle, IonCardContent, IonBackButton } from '@ionic/angular/standalone';
import { Frequency, Habit } from 'src/app/.models/Habit.model';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { caretBack, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-habit-details',
  templateUrl: './habit-details.page.html',
  styleUrls: ['./habit-details.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonCardContent, IonCardTitle, IonCardSubtitle, IonCard, IonCardHeader, IonButtons, IonIcon, IonButton, IonTabButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuToggle]
})
export class HabitDetailsPage implements OnInit {
  habit: Habit | undefined;
  constructor(private route: ActivatedRoute) {
    addIcons({ personCircleOutline, caretBack });
  }

  ngOnInit() {
    const habitId = this.route.snapshot.paramMap.get('id');
    if (habitId) {
      this.fetchHabitDetails(habitId);
    }
  }
  fetchHabitDetails(id: string) {
    // Fetch the habit details using the id
    // This is just a placeholder. Replace it with actual data fetching logic.
    this.habit = {
      id: id,
      created_at: new Date(),
      title: 'Sample Habit',
      description: 'This is a sample habit description',
      frequency: Frequency.Daily,
      custom_frequency: 1,
      color: 'primary',
      is_positive: true,
      streak: 0,
      streak_start: new Date()
    };
  }

}
