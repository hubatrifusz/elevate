import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonRow, IonDatetime, IonIcon, IonButtons, IonButton, IonMenuToggle, IonModal, IonList, IonItem, IonAvatar, IonImg, IonLabel, ModalController, IonText, IonInfiniteScrollContent, IonInfiniteScroll, InfiniteScrollCustomEvent, IonFab, IonFabButton, GestureController, Gesture } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { HabitService } from 'src/app/services/habit.service';
import { HabitLog } from 'src/app/.models/HabitLog.model';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, personCircleOutline, add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab, IonText,
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
      console.error('swipeArea is not initialized');
      return;
    }

    const gesture: Gesture = this.gestureCtrl.create({
      el: this.swipeArea.nativeElement,
      gestureName: 'swipe',
      onEnd: (ev) => {
        console.log('Gesture detected with deltaX:', ev.deltaX);
        this.zone.run(() => { // Ensure Angular detects changes
          if (ev.deltaX > 50) {
            console.log('Swiped right');
            this.previousDay();
          } else if (ev.deltaX < -50) {
            console.log('Swiped left');
            this.nextDay();
          }
        });
      },
    });
    gesture.enable();
    console.log('Gesture enabled');
  }
  previousDay() {
    console.log('previousDay called');
    this.date.setDate(this.date.getDate() - 1);
    this.updateDateDisplay();
    this.cdr.detectChanges();
  }

  nextDay() {
    console.log('nextDay called');
    this.date.setDate(this.date.getDate() + 1);
    this.updateDateDisplay();
  }
  updateDateDisplay() {
    this.weekday = this.date.toLocaleDateString('en-US', { weekday: 'short' });
    this.dayAndMonth = this.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    this.datestring = this.date.toISOString();
  }


  newHabit() {
    this.router.navigate(['/create-habit']);
  }
}
