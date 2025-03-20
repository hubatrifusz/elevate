import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskFeedComponent } from "../../components/feed/task/task.component";
import { HabitLog } from '../../models/habitlog.model';
import { FrequencyEnum } from '../../models/habit.model';

@Component({
  selector: 'app-feed',
  imports: [NavbarComponent, ToolbarComponent, TaskFeedComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  habitLogData = {
    habitLog: {
      "id": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "userId": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "habitId": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "dueDate": "2025-04-01T00:00:00.000Z",
      "notes": 'Drink 2 liters of water every day',
      "completed": false,
      "isPublic": true,
      "createdAt": new Date(),
      "updatedAt": new Date(),
      "deleted": false,
      "completedAt": new Date(),
    },
    habit: {
      "id": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "userId": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "createdAt": new Date(),
      "title": "Drink Water",
      "description": "Drink 2 liters of water every day",
      "frequencyType": FrequencyEnum.Weekly,
      "customFrequency": 0,
      "color": "#00FF00",
      "isPositive": true,
      "streak": 0,
      "streakStart": new Date(),
      "deleted": false,
    },
    user: {
      "id": "b55560d3-d665-4b09-af7b-f83164a0ad69",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@doe.com",
      "longestStreak": 0
    }
  }
}