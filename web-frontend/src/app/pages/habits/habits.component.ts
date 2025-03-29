import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToolbarComponent } from '../../components/dashboard/toolbar/toolbar.component';
import { Habit } from '../../models/habit.model';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ToolbarComponent],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.scss'
})
export class HabitsComponent implements OnInit {
  habits: Habit[] = [];

  constructor(
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadHabits();
  }

  loadHabits(): void {
    this.userService.getHabits().subscribe({
      next: (response) => this.habits = response as Habit[],
      error: (error) => {
        console.error(error);
        this.alertService.showAlert('Failed to load habits');
      }
    });
  }
}
