import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';
import { HorseshoeVisualizationComponent } from '../../components/horseshoe-visualization/horseshoe-visualization.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-negative-habits',
  templateUrl: './negative-habits.component.html',
  styleUrls: ['./negative-habits.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HorseshoeVisualizationComponent,
    NavbarComponent,
    LoadingSpinnerComponent
  ]
})
export class NegativeHabitsComponent implements OnInit {
  negativeHabits: Habit[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.loadNegativeHabits();
  }

  loadNegativeHabits(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.habitService.getNegativeHabits().subscribe({
      next: (habits) => {
        this.negativeHabits = habits;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading negative habits:', error);
        this.errorMessage = 'Failed to load negative habits. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
