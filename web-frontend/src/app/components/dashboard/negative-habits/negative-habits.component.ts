import { Component } from '@angular/core';
import { HabitService } from '../../../services/habit.service';
import { Habit, NegativeHabit } from '../../../models/habit.model';
import { NegativeHabitComponent } from "../negative-habit/negative-habit.component";

@Component({
  selector: 'app-negative-habits',
  imports: [NegativeHabitComponent],
  templateUrl: './negative-habits.component.html',
  styleUrl: './negative-habits.component.scss',
})
export class NegativeHabitsComponent {
  constructor(private habitService: HabitService) {}

  negativeHabits: NegativeHabit[] = [];

  ngOnInit() {
    this.habitService.getNegativeHabits().subscribe((habits) => {
      this.negativeHabits = habits;
    });
  }
}
