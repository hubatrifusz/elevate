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
import { UserService } from '../../services/user.service';
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [NavbarComponent, CommonModule, LoadingSpinnerComponent],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.scss'
})
export class HabitsComponent implements OnInit {
  currentUserId: string | null = null;

  habits: Habit[] = [];
  friends: User[] = [];
  challengeInvites: Challenge[] = [];

  friendChallengeStatus: Map<string, boolean> = new Map();
  challengeSenders: Map<string, User> = new Map();

  showChallengeModal = false;
  selectedHabit: Habit | null = null;
  isLoading = true;
  isChallengeInvitesLoading = true;

  constructor(
    private habitService: HabitService,
    private friendsService: FriendsService,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadHabits();
    this.loadChallengeInvites();
    this.currentUserId = this.authService.getUserId();
  }

  loadHabits(): void {
    this.isLoading = true;
    this.habitService.getHabits().subscribe({
      next: (response) => {
        this.habits = response as Habit[];

        if (this.habits.length > 0) {
          let loadedUsers = 0;
          this.habits.forEach(habit => {
            if (habit.userId !== this.currentUserId) {
              this.userService.getUserData(habit.userId).subscribe({
                next: (user) => {
                  this.challengeSenders.set(habit.userId, user);
                  loadedUsers++;
                  if (loadedUsers >= this.habits.filter(h => h.userId !== this.currentUserId).length) {
                    this.isLoading = false;
                  }
                },
                error: (error) => {
                  console.error(`Error fetching user info for habit ${habit.id}:`, error);
                  loadedUsers++;
                  if (loadedUsers >= this.habits.filter(h => h.userId !== this.currentUserId).length) {
                    this.isLoading = false;
                  }
                }
              });
            }
          });

          if (this.habits.every(habit => habit.userId === this.currentUserId)) {
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.alertService.showAlert('Failed to load habits');
        this.isLoading = false;
      }
    });
  }

  loadChallengeInvites(): void {
    this.habitService.getChallengeInvites().subscribe({
      next: (response) => {
        this.challengeInvites = response as Challenge[];

        if (this.challengeInvites.length > 0) {
          let loadedSenders = 0;
          this.challengeInvites.forEach(challenge => {
            this.userService.getUserData(challenge.userId).subscribe({
              next: (user) => {
                this.challengeSenders.set(challenge.userId, user);
                loadedSenders++;
              },
              error: (error) => {
                console.error(`Error fetching sender info for challenge:`, error);
                loadedSenders++;
              }
            });
          });
        }
      },
      error: (error) => {
        console.error('Error loading challenge invites:', error);
        this.alertService.showAlert('Failed to load challenge invites');
        this.isChallengeInvitesLoading = false;
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
                  challenge.friendId === friend.id && challenge.status !== 'Declined'
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
    this.challengeInvites = this.challengeInvites.filter(c => c.id !== challenge.id);

    this.habitService.acceptChallenge(challenge).subscribe({
      next: (response) => {
        this.alertService.showAlert('Challenge accepted!');

        setTimeout(() => {
          this.loadChallengeInvites();
          this.loadHabits();
        }, 300);
      },
      error: (error) => {
        this.loadChallengeInvites();
        console.error('Error accepting challenge:', error);
        this.alertService.showAlert('Failed to accept challenge');
      }
    });
  }

  declineChallenge(challenge: Challenge): void {
    this.habitService.declineChallenge(challenge).subscribe({
      next: (response) => {
        this.alertService.showAlert('Challenge declined!');
        this.loadChallengeInvites();
      },
      error: (error) => {
        console.error('Error declining challenge:', error);
        this.alertService.showAlert('Failed to decline challenge');
      }
    });
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
