import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskFeedComponent } from "../../components/feed/task/task.component";
import { HabitLog } from '../../models/habitlog.model';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-feed',
  imports: [NavbarComponent, ToolbarComponent, TaskFeedComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  posts: HabitLog[] | undefined;

  constructor(private feedService: FeedService) {
    this.feedService.getFeed(1, 20).subscribe({
      next: (response) => this.posts = response,
      error: (error) => console.log(error),
    });
  }
}
