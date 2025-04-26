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
                path: 'calendar',
                loadComponent: () => import('../../pages/calendar/calendar.page').then(m => m.CalendarPage)
            },
            {
                path: 'friendFeed',
                loadComponent: () => import('../../pages/friends-feed/friends-feed.page').then(m => m.FriendsFeedPage)
            },
            {
                path:"friends",
                loadComponent: () => import('../../pages/friends/friends.page').then(m => m.FriendsPage)
            },
            {
                path: 'negative-habits',
                loadComponent: () => import('../../pages/negative-habits/negative-habits.page').then(m => m.NegativeHabitsPage)
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
    },
];