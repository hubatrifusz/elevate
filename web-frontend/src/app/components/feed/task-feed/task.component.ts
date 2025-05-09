import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-task-feed',
  imports: [CommonModule],
  templateUrl: './task-feed.component.html',
  styleUrl: './task-feed.component.scss',
})
export class TaskFeedComponent {
  @Input() post!: Post;
}
