import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonRow, IonDatetime, IonIcon, IonButtons, IonButton, IonMenuToggle, IonModal, IonList, IonItem, IonAvatar, IonImg, IonLabel, ModalController, IonText, IonInfiniteScrollContent, IonInfiniteScroll, InfiniteScrollCustomEvent, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { HabitService } from 'src/app/services/habit.service';
import { HabitLog } from 'src/app/.models/HabitLog.model';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, personCircleOutline, add } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonInfiniteScroll, IonInfiniteScrollContent, IonText, IonAvatar,
    IonButton,
    IonContent,
    IonHeader,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonTitle,
    IonToolbar,
    IonMenuToggle, IonButtons, IonIcon, IonDatetime, TaskCardComponent]
})
export class CalendarPage implements OnInit {

  selectedDate: IonDatetime | null = null;
  private habitService = inject(HabitService);
  private modalController = inject(ModalController);
  private router = inject(Router);
  habitLogs: HabitLog[] = [];

  @Output() loadMoreHabits = new EventEmitter<void>();
  @Output() refreshHabits = new EventEmitter<void>();
  public hasMoreHabits: boolean = true;

  date = new Date();
  datestring = this.date.toISOString()
  weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
  dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  constructor(private menuCtrl: MenuController) {
    addIcons({ personCircleOutline, chevronBackOutline, chevronForwardOutline, add });
  }

  async ngOnInit() {
    console.log(this.date.toString());
  }

  previousDay() {
    this.date.setDate(this.date.getDate() - 1);
    this.updateDateDisplay();
  }

  nextDay() {
    this.date.setDate(this.date.getDate() + 1);
    this.updateDateDisplay();
  }
  updateDateDisplay() {
    this.weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
    this.dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    this.datestring = this.date.toISOString();


    // this.getTodaysHabitlogs(this.date.toISOString());
    // this.habitService.getTodaysHabitlogs(this.date.toISOString());
  }
  async onIonInfinite(event: InfiniteScrollCustomEvent) {
    // console.log('Infinite scroll triggered');
    await this.loadMoreHabits.emit();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      window.location.reload();
      (event.target as HTMLIonRefresherElement).complete();
    }, 200);
  }
  newHabit() {
    this.router.navigate(['/create-habit']);
  }
}
