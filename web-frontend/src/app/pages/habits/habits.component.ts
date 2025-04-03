import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Habit } from '../../models/habit.model';
import { User } from '../../models/user.model';
import { HabitService } from '../../services/habit.service';
import { FriendsService } from '../../services/friends.service';
import { AlertService } from '../../services/alert.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.scss'
})
export class HabitsComponent implements OnInit {
  habits: Habit[] = [];
  friends: User[] = [];
  showChallengeModal = false;
  selectedHabit: Habit | null = null;

  constructor(
    private habitService: HabitService,
    private friendsService: FriendsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadHabits();
  }

  loadHabits(): void {
    this.habitService.getHabits().subscribe({
      next: (response) => this.habits = response as Habit[],
      error: (error) => {
        console.error(error);
        this.alertService.showAlert('Failed to load habits');
      }
    });
  }

  openChallengeModal(habit: Habit): void {
    this.selectedHabit = habit;
    this.loadFriends();
    this.showChallengeModal = true;
  }

  closeChallengeModal(): void {
    this.showChallengeModal = false;
    this.selectedHabit = null;
  }

  loadFriends(): void {
    this.friendsService.getFriends().subscribe({
      next: (response) => this.friends = response as User[],
      error: (error) => {
        console.error('Error loading friends:', error);
        this.alertService.showAlert('Failed to load friends');
      }
    });
  }

  challengeFriend(friendId: string): void {
    if (!this.selectedHabit) return;

    this.habitService.sendChallenge(this.selectedHabit, friendId).subscribe({
      next: () => {
        this.alertService.showAlert('Challenge sent successfully!');
        this.closeChallengeModal();
      },
      error: (error) => {
        console.error('Error sending challenge:', error);
        this.alertService.showAlert('Failed to send challenge');
      }
    });
  }

  isFriendAlreadyChallenged(friendId: string): Observable<boolean> {
    if (!this.selectedHabit) {
      return of(false);
    }

    return this.habitService.getChallengeByHabitId(this.selectedHabit.id).pipe(
      map(challenge => {
        if (challenge && challenge.friendId === friendId) {
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error fetching challenge:', error);
        return of(false);
      })
    );
  }
}
