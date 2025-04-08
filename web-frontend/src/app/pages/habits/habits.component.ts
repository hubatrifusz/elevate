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
import { Challenge } from '../../models/challenge.model';
import { AuthService } from '../../services/auth.service';

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
  challengeInvites: Challenge[] = [];

  friendChallengeStatus: Map<string, boolean> = new Map();

  showChallengeModal = false;
  selectedHabit: Habit | null = null;
  isLoading = false;

  constructor(
    private habitService: HabitService,
    private friendsService: FriendsService,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadHabits();
    this.loadChallengeInvites();
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

  loadChallengeInvites(): void {
    this.habitService.getChallengeInvites().subscribe({
      next: (response) => {
        this.challengeInvites = response as Challenge[];
      },
      error: (error) => {
        console.error('Error loading challenge invites:', error);
        this.alertService.showAlert('Failed to load challenge invites');
      }
    });
  }

  openChallengeModal(habit: Habit): void {
    this.selectedHabit = habit;
    this.isLoading = true;
    this.showChallengeModal = true;

    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response as User[];
        if (this.selectedHabit) {
          this.habitService.getChallengesByHabitId(this.selectedHabit.id).subscribe({
            next: (challenges) => {
              this.friendChallengeStatus.clear();

              this.friends.forEach(friend => {
                const isAlreadyChallenged = challenges.some(challenge =>
                  challenge.friendId === friend.id
                );
                this.friendChallengeStatus.set(friend.id, isAlreadyChallenged);
              });
              this.isLoading = false;
            },
            error: () => {
              this.friends.forEach(friend => {
                this.friendChallengeStatus.set(friend.id, false);
              });
              this.isLoading = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.alertService.showAlert('Failed to load friends');
        this.isLoading = false;
      }
    });
  }

  closeChallengeModal(): void {
    this.showChallengeModal = false;
    this.selectedHabit = null;
  }

  challengeFriend(friendId: string): void {
    if (!this.selectedHabit) return;

    this.habitService.sendChallenge(this.selectedHabit, friendId).subscribe({
      next: () => {
        this.alertService.showAlert('Challenge sent successfully!');
        this.friendChallengeStatus.set(friendId, true);
      },
      error: (error) => {
        console.error('Error sending challenge:', error);
        this.alertService.showAlert('Failed to send challenge');
      }
    });
  }

  acceptChallenge(challenge: Challenge): void {
    this.habitService.acceptChallenge(challenge).subscribe({
      next: (response) => {
        this.alertService.showAlert('Challenge accepted!');
        this.loadChallengeInvites();
      },
      error: (error) => {
        console.error('Error accepting challenge:', error);
        this.alertService.showAlert('Failed to accept challenge');
      }
    });
    this.loadHabits();
  }

  isFriendAlreadyChallenged(friendId: string): Observable<boolean> {
    if (!this.selectedHabit) {
      return of(false);
    }

    return this.habitService.getChallengesByHabitId(this.selectedHabit.id).pipe(
      map(challenges => {
        console.log(challenges);
        return challenges.some(challenge => challenge.friendId === friendId);
      }),
      catchError(error => {
        console.error('Error fetching challenges:', error);
        return of(false);
      })
    );
  }

  isHabitOwner(habit: Habit): boolean {
    const currentUserId = this.authService.getUserId();
    return habit.userId === currentUserId;
  }
}
