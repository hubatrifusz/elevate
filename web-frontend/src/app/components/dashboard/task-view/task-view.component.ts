import { Component } from '@angular/core';
import { TaskComponent } from "../task/task.component";

@Component({
  selector: 'app-task-view',
  imports: [TaskComponent],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {

}
