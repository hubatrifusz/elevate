import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskViewComponent } from "../../components/dashboard/task-view/task-view.component";
import { NegativeHabitsComponent } from "../../components/dashboard/negative-habits/negative-habits.component";

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, ToolbarComponent, TaskViewComponent, NegativeHabitsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
