import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { ToolbarComponent } from "../../components/dashboard/toolbar/toolbar.component";
import { TaskViewComponent } from "../../components/dashboard/task-view/task-view.component";

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, ToolbarComponent, TaskViewComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
