import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonAvatar, IonLabel, IonButton } from "@ionic/angular/standalone";
import { User } from 'src/app/.models/user.model';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
  imports: [IonItem, IonAvatar, IonLabel, IonButton]
})
export class FriendComponent implements OnInit {
  @Input() friend!: User;
  @Output() deleteFriend = new EventEmitter<string>();
  @Output() profileClick = new EventEmitter<string>();
  constructor() { }

  ngOnInit() { }

  onDeleteFriend() {
    this.deleteFriend.emit(this.friend.id); // Emit the friend's ID to the parent component
  }
  goToProfile(friendId: string) {
    this.profileClick.emit(friendId); // Emit the friend's ID to the parent component
  }

}
