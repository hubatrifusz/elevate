import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar, IonRefresher, IonRefresherContent, RefresherEventDetail, IonList, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../components/header/header.component";
import { NegativeHabit } from 'src/app/.models/NegativeHabit.model';
import { NegativeHabitService } from 'src/app/services/negative-habit.service';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent } from '@ionic/core';
import { NegativeHabitCardComponent } from "../../components/negative-habit-card/negative-habit-card.component";
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { addIcons } from 'ionicons';
import { happyOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-negative-habits',
  templateUrl: './negative-habits.page.html',
  styleUrls: ['./negative-habits.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonInfiniteScrollContent, IonInfiniteScroll, IonIcon, IonFabButton, IonFab, IonList, IonRefresherContent, IonRefresher, IonContent, CommonModule, FormsModule, HeaderComponent, NegativeHabitCardComponent]
})
export class NegativeHabitsPage {

  negativeHabits: NegativeHabit[] = [];
  NegativeHabitSertive = inject(NegativeHabitService);
  router = inject(Router);
  toast = inject(ToastService);
  loadingController = inject(LoadingController);
  pageSize = 10;
  pageNumber = 1;
  noMoreData = false;
  noData = false;


  constructor() {
    addIcons({ add, happyOutline });
  }

  async presentLoading(message: string = 'Loading...') {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'bubbles'
    });
    await loading.present();
    return loading;
  }

  async ionViewWillEnter() {
    await this.getNegativeHabits();
  }

  async getNegativeHabits() {
    const loading = await this.presentLoading();
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.NegativeHabitSertive.getHabits(this.pageNumber, this.pageSize).subscribe({
        next: (response) => {
          this.negativeHabits = response;
          console.log('Negative habits loaded:', this.negativeHabits);
          loading.dismiss();
        },
        error: (error) => {
          console.error('Error loading negative habits:', error);
          loading.dismiss();
          if (error.status === 404) {
            this.noData = true;
          }
        }
      });
    } else {
      loading.dismiss();
    }
  }

  handleRefresh($event: IonRefresherCustomEvent<RefresherEventDetail>) {
    window.location.reload();
  }

  newNegativeHabit() {
    this.router.navigate(['create-negative-habit'])
  }
  async deleteHabit(habitId: string) {
    const loading = await this.presentLoading('Deleting habit...');

    this.NegativeHabitSertive.deleteHabit(habitId).subscribe({
      next: () => {
        console.log('Habit deleted successfully');
        this.toast.presentToast('Habit deleted successfully');
        this.negativeHabits = this.negativeHabits.filter(h => h.id !== habitId);
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error deleting habit:', error);
        this.toast.presentToast('Error deleting habit');
        loading.dismiss();
      }
    });
  }
  async resetHabit(habitId: string) {
    const loading = await this.presentLoading('Resetting habit...');

    this.NegativeHabitSertive.resetHabit(habitId).subscribe({
      next: () => {
        console.log('Habit reset successfully');
        this.toast.presentToast('Habit reset successfully');
        loading.dismiss();
        this.getNegativeHabits();
      },
      error: (error) => {
        console.error('Error resetting habit:', error);
        this.toast.presentToast('Error resetting habit');
        loading.dismiss();
      }
    });
  }
  loadData($event: IonInfiniteScrollCustomEvent<void>) {
    this.pageNumber++;
    this.NegativeHabitSertive.getHabits(this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.negativeHabits = [...this.negativeHabits, ...response];
        console.log('Negative habits loaded:', this.negativeHabits);
        $event.target.complete();
      },
      error: (error) => {
        console.error('Error loading negative habits:', error);
        $event.target.complete();
        this.noMoreData = true;
      }
    });
  }
}
