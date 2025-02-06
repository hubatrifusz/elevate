import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "./pages/calendar/calendar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { WeekComponent } from "./components/calendars/week/week.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalendarComponent, SidebarComponent, WeekComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'web-frontend';
}
