import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskFeedComponent } from "../../components/feed/task/task.component";
import { HabitLog } from '../../models/habitlog.model';

@Component({
  selector: 'app-feed',
  imports: [NavbarComponent, ToolbarComponent, TaskFeedComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  habitLog: HabitLog = {
    "id": "b55560d3-d665-4b09-af7b-f83164a0ad69",
    "userId": "b55560d3-d665-4b09-af7b-f83164a0ad69",
    "habitId": "b55560d3-d665-4b09-af7b-f83164a0ad69",
    "dueDate": "2025-04-01T00:00:00.000Z",
    "notes": 'Drink 2 liters of water every day',
    "completed": false,
    "isPublic": true
  }
}
