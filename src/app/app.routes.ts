import { Routes } from '@angular/router';
import { DashboardPage } from '@features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from '@features/auth/pages/login-page/login-page';
import { MainLayout } from '@core/layout/main-layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'dashboard',
        component: DashboardPage,
      },
    ],
  },
];
