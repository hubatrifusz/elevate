import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit, NegativeHabit } from '../../models/habit.model';
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
  negativeHabits: NegativeHabit[] = [];
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

  convertToDate(dateValue: string | Date): Date {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    return new Date(dateValue);
  }

  getElapsedTime(updatedAt: Date | string): string {
    if (!updatedAt) return 'N/A';

    const updatedDate = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);

    // Check if the date is the default '0001-01-01T00:00:00Z'
    if (updatedDate.getFullYear() <= 1) {
      return 'Not updated yet';
    }

    const now = new Date();
    const diffMs = now.getTime() - updatedDate.getTime();

    // Calculate the time differences
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    // Format the elapsed time
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}
