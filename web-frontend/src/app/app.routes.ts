import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { CreateAccountComponent } from './pages/auth/create-account/create-account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './pages/user/user.component';
import { FeedComponent } from './pages/feed/feed.component';
import { FriendsComponent } from './pages/friends/friends.component';
import { HabitsComponent } from './pages/habits/habits.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Authentication
  { path: 'login', component: LoginComponent }, // Login Page
  { path: 'create-account', component: CreateAccountComponent }, // Create Account Page

  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // Dashboard Page

  // Habits
  { path: 'habits', component: HabitsComponent, canActivate: [authGuard] }, // Habits Page

  // User
  { path: 'user/:id', component: UserComponent, canActivate: [authGuard] }, // User controls

  // Feed
  { path: 'feed', component: FeedComponent, canActivate: [authGuard] }, // Feed Page

  // Friends
  { path: 'friends', component: FriendsComponent, canActivate: [authGuard] }, // Friends Page
];
