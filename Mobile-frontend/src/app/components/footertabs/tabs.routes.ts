import { Routes } from '@angular/router';
import { FootertabsComponent } from './footertabs.component';
import { AuthGuard } from 'src/app/services/auth-guard.guard';

export const routes: Routes = [
    {
        path: "footertabs",
        component: FootertabsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'feed',
                loadComponent: () => import('../../pages/feed/feed.page').then(m => m.FeedPage)
            },
            {
                path: 'create-account-page',
                loadComponent: () => import('../../pages/create-account-page/create-account-page.page').then(m => m.CreateAccountPagePage)
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
    },
];