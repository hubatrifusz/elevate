import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonRow, IonDatetime, IonIcon, IonButtons, IonButton, IonMenuToggle, IonModal, IonList, IonItem, IonAvatar, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { HabitService } from 'src/app/services/habit.service';
import { HabitLog } from 'src/app/.models/HabitLog.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonAvatar,
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
   habitLogs: HabitLog[] = [];
  
  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
  }

  onDateChange(event: any) {

    this.selectedDate = event.detail.value;
    console.log('Selected Date:', this.selectedDate);
    const userId = localStorage.getItem('userId');
    if (this.selectedDate && userId) {

      this.habitService.getHabitLogs(userId, this.selectedDate).subscribe((habits) => {
        console.log(habits);
      });
    }

  }
}
