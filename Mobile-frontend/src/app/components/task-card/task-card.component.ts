import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonIcon, IonCheckbox, IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonList, IonSelect, IonSelectOption, IonContent, IonInput, IonCardHeader, IonCard, IonCardTitle, IonCardContent, LoadingController, IonAlert, IonTabButton, AlertController, ModalController, IonModal, IonHeader, IonButtons, IonToolbar, IonTitle, IonBadge, IonAvatar, IonCardSubtitle, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, flameOutline, happyOutline, peopleOutline, starOutline, time, trashOutline, trophyOutline, trophySharp } from 'ionicons/icons';
import { Habit, Frequency } from '../../.models/Habit.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from 'src/app/services/habit.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HabitLog } from 'src/app/.models/HabitLog.model';
import { FriendComponent } from '../friend/friend.component';
import { FriendshipService } from 'src/app/services/friendship.service';
import { User } from 'src/app/.models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ChallengeService } from 'src/app/services/challenge.service';
import { Challenge } from 'src/app/.models/challenge.model';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [IonProgressBar, IonCardSubtitle, IonAvatar, IonBadge, IonCardContent, IonCardTitle, IonCard, IonCardHeader, IonIcon, IonCheckbox,
    IonLabel, IonAccordionGroup, IonAccordion, IonItem, IonButton,
    IonGrid, IonRow, IonCol, CommonModule, IonTextarea, IonList,
    IonSelect, IonSelectOption, FormsModule, IonInput, IonModal, IonHeader, IonContent, IonButtons, IonToolbar, IonTitle]
})
export class TaskCardComponent implements OnInit {

  @Input() loadMoreHabits?: EventEmitter<void>;
  @Input() set habitlogsDate(value: string | null) {
    this._habitlogsDate = value;
    this.onDateChange(); // Trigger logic when the date changes
  }
  get habitlogsDate(): string | null {
    return this._habitlogsDate;
  }
  @Output() hasMoreHabitsChange = new EventEmitter<boolean>();
  habits: Habit[] = [];
  habitLogs: HabitLog[] = [];

  @ViewChild(IonAccordionGroup, { static: false }) accordionGroup!: IonAccordionGroup;
  private habitService = inject(HabitService);
  private router = inject(Router);
  private friendShipService = inject(FriendshipService);
  private userService = inject(UserService);
  private challengeService = inject(ChallengeService);
  private toast = inject(ToastService);
  private _habitlogsDate: string | null = null;
  private pageNumber = 1; // Set initial page number
  private pageSize = 10; // Set page size
  public hasMoreHabits: boolean = true;
  public checked = false;
  public friends: User[] = [];
  isModalOpen = false;
  public currentUserId = localStorage.getItem('userId') || '';
  public inviter: User | null = null;
  public sentChallengeInvites: Challenge[] = [];
  public selectedHabit: Habit | null = null; // Track the selected habit for challenge
  public Disabled: boolean = false;


  weekDays = [
    { label: 'M', value: 'Mon' },
    { label: 'T', value: 'Tue' },
    { label: 'W', value: 'Wed' },
    { label: 'T', value: 'Thu' },
    { label: 'F', value: 'Fri' },
    { label: 'S', value: 'Sat' },
    { label: 'S', value: 'Sun' }
  ];


  constructor(private loadingController: LoadingController, private alertController: AlertController, private modalController: ModalController) {
    addIcons({ time, chevronDownOutline, flameOutline, trashOutline, peopleOutline, trophySharp, happyOutline });

  }
  ngOnInit() {
    // Subscribe to loadMoreHabits events
    if (this.loadMoreHabits) {
      this.loadMoreHabits.subscribe(() => {
        console.log("loadMore event received");
        this.loadMore();
      });
    }
  }


  async ionViewWillEnter() {
    const loading = await this.presentLoading();
    await this.loadMoreHabits?.subscribe(() => {
      console.log("sdfffffffffffffffff");
      this.loadMore(); // Call loadMore when the event is emitted
    });
    if (!this.habitlogsDate) {
      await this.loadHabits();
      // Await for better flow control
      loading.dismiss();


    } else {
      loading.dismiss();
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
    });
    await loading.present();
    return loading;
  }

  async onDateChange() {
    if (this.habitlogsDate) {
      const selectedDate = new Date(this.habitlogsDate);
      const today = new Date();

      this.Disabled = selectedDate > today;
      const loading = await this.presentLoading();
      console.log(`Date changed to: ${this.habitlogsDate}`);
      this.pageNumber = 1; // Reset pagination
      this.habits = []; // Clear current habits
      await this.loadHabitLogs(); // Await loadHabitLogs
      loading.dismiss();
    } else {
      console.log('Date cleared, loading all habits');
      this.pageNumber = 1; // Reset pagination
      this.habits = []; // Clear current habits
      await this.loadHabits(); // Await loadHabits
    }
  }




  async loadHabits() {

    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (userId) {
      this.habitService.getHabits(userId, this.pageNumber, this.pageSize).subscribe(
        (newHabits) => {
          if (newHabits.length === 0) {
            this.hasMoreHabits = false;
            console.log('No more habits to load');
            this.hasMoreHabitsChange.emit(this.hasMoreHabits);
          }
          if (this.pageNumber === 1) {
            this.habits = newHabits;
            console.log('Habits loaded successfully');
          } else {
            this.habits = [...this.habits, ...newHabits];
          }
          this.habits.forEach((habit) => {
            console.log(habit);
            if (habit.userId !== this.currentUserId) {
              this.getUsersData(habit.userId!);
            }
            if (!habit.color.startsWith('#')) {
              habit.color = '#' + habit.color;
            }
          });
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.hasMoreHabits = false;
            this.hasMoreHabitsChange.emit(this.hasMoreHabits);
            console.log('No more habits to load');
          } else {
            console.error('Error loading habits:', error);
          }
        }
      );
    } else {
      console.warn('User ID not found in localStorage.');
    }
  }

  async loadMore() {
    this.pageNumber++;
    console.log('Loading more habits...');
    if (this.habitlogsDate == null) {
      await this.loadHabits(); // Await loadHabitLogs
    }
  }

  async loadHabitLogs() {
    const userId = localStorage.getItem('userId');
    if (userId && this.habitlogsDate) {
      try {
        const response = await this.habitService.getTodaysHabitlogs(this.habitlogsDate).toPromise();
        this.habitLogs = response as HabitLog[];
        for (const habitLog of this.habitLogs) {
          await this.getHabitByID(habitLog.habitId); // Await getHabitByID
        }
      } catch (error) {
        console.error('Error loading habit logs:', error);
      }
    }
  }

  async getHabitByID(habitId: string) {
    try {
      const response = await this.habitService.getHabitByID(habitId).toPromise();
      const habit = response as Habit;
      if (habit.userId !== this.currentUserId) {
        this.getUsersData(habit.userId!);
      }
      if (!habit.color.startsWith('#')) {
        habit.color = '#' + habit.color;
      }
      this.habits.push(habit);
    } catch (error) {
      console.error('Error fetching habit by ID:', error);
    }
  }

  toggleDay(habit: Habit, dayIndex: number) {

    if (habit.customFrequency == null) {
      console.log('customFrequency is null or undefined');
      habit.customFrequency = 0; // Initialize to 0 if null or undefined
    }

    let binaryString = habit.customFrequency.toString(2).padStart(7, '0');
    let binaryArray = binaryString.split('');
    binaryArray[dayIndex] = binaryArray[dayIndex] === '1' ? '0' : '1';
    habit.customFrequency = parseInt(binaryArray.join(''), 2);

    // Update the habit in the habits array
    const index = this.habits.findIndex(h => h.id === habit.id);
    if (index !== -1) {
      this.habits[index] = { ...habit }; // Create a new object
    }

    // Save the updated habit to the backend
    this.editHabit(habit);

    console.log(habit.customFrequency);
    console.log(habit);
  }

  getUsersData(id: string) {
    this.userService.getUserById(id).subscribe(
      (response) => {
        // console.log('User data:', response);
        this.inviter = response;
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }

  isSelectedDay(customFrequency: number, dayIndex: number): boolean {
    if (customFrequency != null) {
      const binaryString = customFrequency.toString(2).padStart(7, '0');
      return binaryString.charAt(dayIndex) === '1';
    }
    else {
      return false;
    }
  }

  isHabitCompleted(habitId: string): boolean {
    const habitLog = this.habitLogs.find((log) => log.habitId === habitId);
    return habitLog ? habitLog.completed : false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  trackById(index: number, habit: Habit): string {
    return habit.id;
  }


  async deleteHabit(habit: Habit) {
    this.habits = this.habits.filter((h) => h.id !== habit.id);
    try {
      await this.habitService.deleteHabit(habit.id).toPromise();
      console.log('Habit deleted successfully');
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  }

  onDescriptionBlur(habit: Habit) {
    console.log('Description:', habit.description);
    this.editHabit(habit);
  }

  onFrequencyChange(habit: Habit, event: any) {
    console.log('Frequency:', event.detail.value);
    this.editHabit(habit);
  }

  onColorChange(habit: Habit, event: any) {
    console.log('Color:', event.detail.value);
    if (!event.detail.value.startsWith('#')) {
      habit.color = '#' + event.detail.value;
    }
    this.editHabit(habit);
  }

  onPositiveChange(habit: Habit, event: any) {
    console.log('Is Positive:', event.detail.checked);
    this.editHabit(habit);
  }
  async editHabit(habit: Habit) {
    try {
      const response = await this.habitService.editHabit(habit).toPromise();
      console.log('Habit edited successfully');
      habit.color = '#' + habit.color;
      console.log(response);
    } catch (error) {
      console.error('Error editing habit:', error);
    }
  }
  completed(habitId: string, Ispublic: boolean) {
    const habitLog = this.habitLogs.find(habitLog => habitLog.habitId === habitId);
    if (habitLog) {
      const habitLogId = habitLog.id;

      this.habitService.completeHabit(habitLogId, Ispublic).subscribe(
        (response) => {
          console.log('Habit completed successfully:', response);

          // Update the habitLog locally instead of reloading all habit logs
          habitLog.completed = true;

          if (this.accordionGroup) {
            this.accordionGroup.value = null; // Collapse all accordions
          }

          // Optionally, update the UI if needed
          console.log('Updated habitLog:', habitLog);
        },
        (error) => {
          console.error('Error completing habit:', error);
        }
      );
    }
  }

  async presentAlert(habitID: string) {
    const alert = await this.alertController.create({
      header: 'You made it!',
      subHeader: 'You are one step closer to your goal! 🎉',
      message: 'Do you want to share your progress?',
      buttons: [
        {
          text: 'No, thanks',
          role: '',
          handler: () => {
            console.log('Alert canceled');
            this.completed(habitID, false);
          },
        },
        {
          text: 'Yes, share',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            this.completed(habitID, true);
          },
        }
      ],
    });

    await alert.present();
  }

  async getFriends(habit: Habit) {
    this.selectedHabit = habit
    await this.friendShipService.getFriends().subscribe(
      (response) => {
        console.log('Friends:', response);
        this.friends = response;
        this.setOpen(true);
      },
      (error) => {
        console.error('Error loading friends:', error);
        if(error.status === 404) {
          this.toast.presentToast("No friends found.");
        }
      }
    );
  }
  async getSentInvites(habitId: string) {
    this.sentChallengeInvites = [];
    await this.challengeService.getSentChallengeInvites().subscribe(
      (response) => {
        console.log('Sent Invites:', response);
        this.sentChallengeInvites = response.filter((invite) => invite.habit.id === habitId);
        console.log('Filtered Sent Invites:', this.sentChallengeInvites);
      },
      (error) => {
        console.error('Error loading sent invites:', error);
      }
    );
  }
  onChallengeFriend(friendId: string) {
    const habit = this.selectedHabit;
    console.log(habit?.id)
    if (this.sentChallengeInvites.some(invite => invite.friendId === friendId)) {
      console.log('Invite already sent to this friend.');
      return;
    }

    if (habit?.color.includes('#')) {
      habit.color = habit.color.slice(1);
    }

    this.challengeService.sendChallenge(habit!, friendId).subscribe({
      next: () => {
        console.log('Challenge sent successfully');
        console.log(habit)
        this.toast.presentToast('Challenge sent successfully');


        // Add the friend to the sentChallengeInvites array
        this.sentChallengeInvites.push({
          id: '', // You can set a unique ID if available
          userId: this.currentUserId,
          friendId: friendId,
          habit: habit,
          status: 'sent',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Challenge);
      },
      error: (error) => {
        console.error('Error sending challenge:', error);
        console.log(habit)
        this.toast.presentToast(error.error);
      },
    });
  }


  hasSentInvite(friendId: string): boolean {
    return this.sentChallengeInvites?.some(invite => invite.friendId === friendId) ?? false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }

  darkenColor(color: string, amount: number = 0.7): string {
    if (!color) return '';
    if (!color.startsWith('#')) return color;

    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.floor(r * amount);
    g = Math.floor(g * amount);
    b = Math.floor(b * amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  calculateProgressValue(streakProgression?: string): number {
    if (!streakProgression) {
      return 0;
      console.log("SFSDF")
    }

    try {
      const [completed, total] = streakProgression.split('/').map(num => parseInt(num.trim(), 10));

      // Validate that we have valid numbers
      if (isNaN(completed) || isNaN(total) || total === 0) {
        return 0;
        console.log("sdf")
      }

      // Ensure value is between 0 and 1
      const progress = completed / total;
      return Math.min(Math.max(progress, 0), 1);
      console.log(progress)
    } catch (error) {
      console.error('Error parsing streak progression:', error);
      return 0;
    }
  }
}