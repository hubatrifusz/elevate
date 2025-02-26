import { Routes } from '@angular/router';
import { FootertabsComponent } from './footertabs.component';

export const routes: Routes = [
    {
        path: "footertabs",
        component: FootertabsComponent,
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
