import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonMenuToggle, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, IonInfiniteScroll, IonSpinner, LoadingController, IonCardHeader, IonCard, IonCardTitle, IonCardContent, IonCardSubtitle } from '@ionic/angular/standalone';
import { FriendsFeedService } from 'src/app/services/friends-feed.service';
import { Post } from 'src/app/.models/post.model';
import { FeedCardComponent } from "../../components/feed-card/feed-card.component";
import { HeaderComponent } from "../../components/header/header.component";
import { addIcons } from 'ionicons';
import { happyOutline } from 'ionicons/icons';

@Component({
  selector: 'app-friends-feed',
  templateUrl: './friends-feed.page.html',
  styleUrls: ['./friends-feed.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle,IonIcon, IonCardContent, IonCardTitle, IonCard, IonCardHeader,  IonInfiniteScroll, IonInfiniteScrollContent, IonContent, CommonModule, FormsModule, FeedCardComponent, HeaderComponent, IonRefresher, IonRefresherContent]
})
export class FriendsFeedPage {
  friendFeedService = inject(FriendsFeedService);
  posts: Post[] = []; // Initialize as an empty array
  private page = 1;
  private pageSize = 15;
  hasMorePosts = true; // Flag to track if more posts are available

  constructor(private loadingController: LoadingController) {
    addIcons({happyOutline});
   }
  
  async ionViewWillEnter() {
    this.posts = [];
    this.page = 1;
    const loading = await this.presentLoading();

    await this.getFeed(this.page, this.pageSize);
    loading.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    return loading;
  }

  async getFeed(page: number, pageSize: number, event?: any) {
    this.friendFeedService.getFeed(page, pageSize).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.posts = [...this.posts, ...response]; // Append new posts to the existing list
          this.page++; // Increment the page number
        } else {
          this.hasMorePosts = false; // No more posts available
        }

        if (event) {
          event.target.complete(); // Complete the infinite scroll event
        }
      },
      error: (error) => {
        this.hasMorePosts = false; // No more posts available on error
        console.error('Error loading feed:', error);
        if (event) {
          event.target.complete(); // Complete the infinite scroll event even on error
        }
      },
    });
  }

  onIonInfinite(event: any) {
    if (this.hasMorePosts) {
      this.getFeed(this.page, this.pageSize, event);
    } else {
      event.target.complete(); // Complete the event if no more posts are available
      event.target.disabled = true; // Disable infinite scroll
    }
  }
  handleRefresh(event: any) {
    window.location.reload();

  }
}

