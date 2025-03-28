import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/.models/post.model';
import { IonCard, IonItem, IonAvatar, IonLabel, IonCardContent, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { flameOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss'],
  imports: [IonIcon, IonCardContent, IonLabel, IonAvatar, IonCard, IonItem, CommonModule]
})
export class FeedCardComponent implements OnInit {
  @Input() post!: Post;
  private router = inject(Router);

  constructor() {
    addIcons({ flameOutline });

  }


  ngOnInit() {
   }
  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }
}
