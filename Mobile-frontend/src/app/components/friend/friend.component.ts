import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonAvatar, IonLabel, IonButton } from "@ionic/angular/standalone";
import { Habit } from 'src/app/.models/Habit.model';
import { User } from 'src/app/.models/user.model';
import { HabitService } from 'src/app/services/habit.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
  imports: [IonItem, IonAvatar, IonLabel, IonButton]
})
export class FriendComponent implements OnInit {
  habitService = inject(HabitService);

  @Input() friend!: User;
  @Input() isChallenge = false;
  @Input() Habit: Habit | null = null;
  @Output() deleteFriend = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
   }

  onDeleteFriend() {
    this.deleteFriend.emit(this.friend.id); // Emit the friend's ID to the parent component
  }
  goToProfile(friendId: string) {
    this.profileClick.emit(friendId); // Emit the friend's ID to the parent component
  }
  onChallengeFriend(friendId: string) {
    if (this.Habit?.color.includes('#')) {
      this.Habit.color = this.Habit.color.slice(1);
      this.habitService.sendChallenge(this.Habit, friendId).subscribe({
        next: () => {
          console.log('Challenge sent successfully');
        },
        error: (error) => {
          console.error('Error sending challenge:', error);
        }
      })
    }

  }
}
