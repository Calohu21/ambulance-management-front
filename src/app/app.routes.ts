import { Routes } from '@angular/router';
import { DashboardPage } from '@features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from '@features/auth/pages/login-page/login-page';

export const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
  {
    path: 'dashboard',
    component: DashboardPage,
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
];
