import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonRow, IonDatetime, IonIcon, IonButtons, IonButton, IonMenuToggle, IonModal, IonList, IonItem, IonAvatar, IonImg, IonLabel, ModalController, IonText, IonInfiniteScrollContent, IonInfiniteScroll, InfiniteScrollCustomEvent, IonFab, IonFabButton, GestureController, Gesture, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { HabitService } from 'src/app/services/habit.service';
import { HabitLog } from 'src/app/.models/HabitLog.model';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, personCircleOutline, add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { IonRefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonFabButton, IonFab, IonText,
    IonButton,
    IonContent,
    IonIcon, TaskCardComponent, HeaderComponent]
})
export class CalendarPage {

  selectedDate: IonDatetime | null = null;
  private habitService = inject(HabitService);
  private modalController = inject(ModalController);
  private router = inject(Router);
  habitLogs: HabitLog[] = [];

  @ViewChild('swipeArea', { static: true }) swipeArea!: ElementRef;
  @Output() refreshHabits = new EventEmitter<void>();
  public hasMoreHabits: boolean = true;

  date = new Date();
  datestring = this.date.toISOString()
  weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
  dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  constructor(private menuCtrl: MenuController, private zone: NgZone,
    private cdr: ChangeDetectorRef, private gestureCtrl: GestureController) {
    addIcons({ personCircleOutline, chevronBackOutline, chevronForwardOutline, add });

  }
  ngOnInit() {
    this.initializeSwipeGesture();
  }


  initializeSwipeGesture() {
    if (!this.swipeArea) {
      return;
    }

    const gesture: Gesture = this.gestureCtrl.create({
      el: this.swipeArea.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => {
        this.zone.run(() => {
          if (ev.deltaX > 50) {
            this.previousDay();
          } else if (ev.deltaX < -50) {
            this.nextDay();
          }
        });
      },
    });
    gesture.enable();
  }
  previousDay() {
    if (this.isToday()) {

      this.date.setDate(this.date.getDate() - 1);
      this.updateDateDisplay();
      this.cdr.detectChanges();
    }
  }

  nextDay() {
    this.date.setDate(this.date.getDate() + 1);
    this.updateDateDisplay();
  }
  updateDateDisplay() {
    this.weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
    this.dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    this.datestring = this.date.toISOString();
  }

  handleRefresh($event: IonRefresherCustomEvent<RefresherEventDetail>) {
    window.location.reload();
  }

  newHabit() {
    this.router.navigate(['/create-habit']);
  }
  isToday(): boolean {
    const today = new Date();
    return this.date.getDate() === today.getDate() &&
      this.date.getMonth() === today.getMonth() &&
      this.date.getFullYear() === today.getFullYear();
  }

  isOneMonthAhead(): boolean {
    const today = new Date();

    // Create a date that's one month ahead of today
    const oneMonthAhead = new Date(today);
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    // Check if current date is at or beyond the one month limit
    return this.date >= oneMonthAhead;
  }
}
