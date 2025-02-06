import { Component } from '@angular/core';
import { WeekComponent } from "../../components/calendars/week/week.component";

@Component({
  selector: 'app-calendar',
  imports: [WeekComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {

}
