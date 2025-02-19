import { Routes } from '@angular/router';
import { FootertabsComponent } from './components/footertabs/footertabs.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-page',
    pathMatch: 'full',
  },
  {
    path: "footertabs",
    component: FootertabsComponent,
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.page').then(m => m.FeedPage)
      },
      {
        path: 'create-account-page',
        loadComponent: () => import('./pages/create-account-page/create-account-page.page').then(m => m.CreateAccountPagePage)
      }
    ]
  },
  {
    path: 'login-page',
    loadComponent: () => import('./pages/login-page/login-page.page').then(m => m.LoginPagePage)
  },
  {
    path: 'create-account-page',
    loadComponent: () => import('./pages/create-account-page/create-account-page.page').then(m => m.CreateAccountPagePage)
  }



];
