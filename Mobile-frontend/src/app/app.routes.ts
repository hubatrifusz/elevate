import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
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
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.page').then( m => m.FeedPage)
  }
];
