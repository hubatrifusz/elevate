import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskFeedComponent } from "../../components/feed/task-feed/task.component";
import { FeedService } from '../../services/feed.service';
import { Post } from '../../models/post.model';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  imports: [NavbarComponent, ToolbarComponent, TaskFeedComponent, LoadingSpinnerComponent, CommonModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  posts: Post[] | undefined;
  isLoading = true;

  constructor(private feedService: FeedService) {
    this.loadFeed();
  }

  loadFeed() {
    this.isLoading = true;
    this.feedService.getFeed(1, 20).subscribe({
      next: (response) => {
        this.posts = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this.posts = [];
        }
        this.isLoading = false;
      }
    });
  }
}