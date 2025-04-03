import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IonCard, IonCardHeader, IonItem, IonAvatar, IonLabel, IonCardContent, IonFooter, IonButton, IonIcon, IonText } from "@ionic/angular/standalone";
import { Challenge } from 'src/app/.models/challenge.model';
import { ChallengeService } from 'src/app/services/challenge.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-challenge-request',
  templateUrl: './challenge-request.component.html',
  styleUrls: ['./challenge-request.component.scss'],
  imports: [IonText, IonIcon, IonButton, IonFooter, IonCardContent, IonLabel, IonAvatar, IonItem, IonCardHeader, IonCard,],
})
export class ChallengeRequestComponent implements OnInit {
  service = inject(ChallengeService);
  toast = inject(ToastService);
  @Input() challenge: Challenge | null = null;
  @Output() profileClick = new EventEmitter<string>();
  @Output() acceptChallenge = new EventEmitter<string>();
  @Output() rejectChallenge = new EventEmitter<string>();


  constructor() { }

  goToProfile(arg0: string) {
    this.profileClick.emit(this.challenge?.friendId);
  }

  //need work
  acceptChallengeRequest(arg0: Challenge | null) {
    if (this.challenge) {
      this.service.statusChallenge(this.challenge, 'accepted').subscribe({
        next: () => {
          console.log('Challenge accepted successfully');
          this.toast.presentToast('Challenge accepted successfully');
          this.acceptChallenge.emit(); // Emit the accepted challenge
        },
        error: (error) => {
          console.error('Error accepting challenge:', error);
          this.toast.presentToast('Error accepting challenge');
        }
      });
    }
  }
  rejectChallengeRequest(arg0: Challenge | null) {
    if(this.challenge){
      this.service.statusChallenge(this.challenge, 'declined').subscribe({
        next: () => {
          console.log('Challenge rejected successfully');
          this.toast.presentToast('Challenge rejected successfully');
          this.rejectChallenge.emit(); // Emit the rejected challenge
        },
        error: (error) => {
          console.error('Error rejecting challenge:', error);
          this.toast.presentToast('Error rejecting challenge');
        }
      });
    }

  }



  ngOnInit() { }

}
