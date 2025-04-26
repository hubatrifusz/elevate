import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonButton, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NegativeHabitService } from 'src/app/services/negative-habit.service';
import { ToastService } from 'src/app/services/toast.service';
import { NegativeHabit } from 'src/app/.models/NegativeHabit.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-negative-habit',
  templateUrl: './create-negative-habit.page.html',
  styleUrls: ['./create-negative-habit.page.scss'],
  standalone: true,
  imports: [
    IonButton, IonLabel, IonItem, IonCardContent, IonCardTitle, IonCardHeader,
    IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle,
    IonToolbar, CommonModule, FormsModule, IonInput, IonTextarea
  ]
})
export class CreateNegativeHabitPage implements OnInit {

  habit: NegativeHabit = {
    id: '',
    title: '',
    description: '',
    color: '#000000',
    userId: localStorage.getItem('userId') || '',
  };

  constructor(private router: Router, private negativeHabitService: NegativeHabitService, private toastService: ToastService) { }

  ngOnInit() {
  }
  createHabit() {
    const userId = localStorage.getItem('userId');
      if (this.habit.color.startsWith('#')) {
        this.habit.color = this.habit.color.slice(1);
      }

      // Simplified payload for negative habit
      const habitData = {
        title: this.habit.title,
        userID: userId,
        description: this.habit.description,
        color: this.habit.color,
      };

      console.log('Creating negative habit:', habitData);
      this.negativeHabitService.createHabit(this.habit).subscribe(
        (response) => {
          console.log('Negative habit created successfully:', response);
          this.toastService.presentToast('Negative habit created successfully');
          this.router.navigate(['/footertabs/negative-habits']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error creating negative habit:', error);
          this.toastService.presentToast('Please enter your habit title');
        }
      );
    } 
  }


