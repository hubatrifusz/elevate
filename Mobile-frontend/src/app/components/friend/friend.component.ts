import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonAvatar, IonLabel, IonButton } from "@ionic/angular/standalone";
import { Habit } from 'src/app/.models/Habit.model';
import { User } from 'src/app/.models/user.model';
import { ChallengeService } from 'src/app/services/challenge.service';
import { HabitService } from 'src/app/services/habit.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
  imports: [IonItem, IonAvatar, IonLabel, IonButton]
})
export class FriendComponent  {
  challengeService = inject(ChallengeService);
  toast = inject(ToastService)

  @Input() friend!: User;
  @Input() isChallenge = false;
  @Input() Habit: Habit | null = null;
  @Output() deleteFriend = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<string>();

  constructor() { }

  ionViewWillEnter() {
   }

  onDeleteFriend() {
    this.deleteFriend.emit(this.friend.id); // Emit the friend's ID to the parent component
  }
  goToProfile(friendId: string) {
    this.profileClick.emit(friendId); // Emit the friend's ID to the parent component
  }
  
}
