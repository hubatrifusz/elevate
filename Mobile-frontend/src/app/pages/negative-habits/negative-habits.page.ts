import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, RefresherEventDetail, IonList, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../components/header/header.component";
import { NegativeHabit } from 'src/app/.models/NegativeHabit.model';
import { NegativeHabitService } from 'src/app/services/negative-habit.service';
import { IonRefresherCustomEvent } from '@ionic/core';
import { NegativeHabitCardComponent } from "../../components/negative-habit-card/negative-habit-card.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-negative-habits',
  templateUrl: './negative-habits.page.html',
  styleUrls: ['./negative-habits.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonList, IonRefresherContent, IonRefresher, IonContent, CommonModule, FormsModule, HeaderComponent, NegativeHabitCardComponent]
})
export class NegativeHabitsPage {


  negativeHabits: NegativeHabit[] = [];
  NegativeHabitSertive = inject(NegativeHabitService);
  router = inject(Router);
  pageSize = 10;
  pageNumber = 1;


  constructor() { }

  ionViewWillEnter() {
    this.getNegativeHabits();
  }

  getNegativeHabits() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.NegativeHabitSertive.getHabits(this.pageNumber, this.pageSize).subscribe({
        next: (response) => {
          this.negativeHabits = response;
          console.log('Negative habits loaded:', this.negativeHabits);
        },
        error: (error) => {
          console.error('Error loading negative habits:', error);
        }
      });
    }
  }

  handleRefresh($event: IonRefresherCustomEvent<RefresherEventDetail>) {
    window.location.reload();
  }

  newNegativeHabit() {
    this.router.navigate(['create-negative-habit'])
  }
  updateHabit($event: Event) {
    throw new Error('Method not implemented.');
  }
  deleteHabit($event: Event) {
    throw new Error('Method not implemented.');
  }
}
