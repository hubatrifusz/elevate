import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { CreateAccountComponent } from './pages/auth/create-account/create-account.component';
import { PasswordRecoveryComponent } from './pages/auth/password-recovery/password-recovery.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './pages/user/user.component';
import { FeedComponent } from './pages/feed/feed.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Authentication
  { path: 'login', component: LoginComponent }, // Login Page
  { path: 'create-account', component: CreateAccountComponent }, // Create Account Page
  { path: 'password-recovery', component: PasswordRecoveryComponent }, // Password Recovery Page

  // Dashboard
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }, // Dashboard Page

  // User
  { path: 'user/:id', component: UserComponent, canActivate: [authGuard] }, // User controls

  // Feed
  { path: 'feed', component: FeedComponent } // Feed Page
];
