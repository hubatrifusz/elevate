import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { CreateAccountComponent } from './pages/auth/create-account/create-account.component';
import { PasswordRecoveryComponent } from './pages/auth/password-recovery/password-recovery.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //TODO: Simple redirect to Login Page, later use Auth Guard

  // Authentication
  { path: 'login', component: LoginComponent }, // Login Page
  { path: 'create-account', component: CreateAccountComponent }, // Create Account Page
  { path: 'password-recovery', component: PasswordRecoveryComponent }, // Password Recovery Page

  // Daashboard
  { path: 'dashboard', component: DashboardComponent }, // Dashboard Page
];
