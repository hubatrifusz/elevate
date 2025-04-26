import { Routes } from '@angular/router';
import { FootertabsComponent } from './components/footertabs/footertabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: 'login-page',
    loadComponent: () => import('./pages/login-page/login-page.page').then(m => m.LoginPagePage)
  },
  {
    path: 'create-account-page',
    loadComponent: () => import('./pages/create-account-page/create-account-page.page').then(m => m.CreateAccountPagePage)
  },
  {
    path: '',
    loadChildren: () => import('../app/components/footertabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'create-habit',
    loadComponent: () => import('./pages/create-habit/create-habit.page').then(m => m.CreateHabitPage)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  },  {
    path: 'create-negative-habit',
    loadComponent: () => import('./pages/create-negative-habit/create-negative-habit.page').then( m => m.CreateNegativeHabitPage)
  }









];
