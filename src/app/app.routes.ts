import { Routes } from '@angular/router';
import { DashboardPage } from '@features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from '@features/auth/pages/login-page/login-page';
import { MainLayout } from '@core/layout/main-layout/main-layout/main-layout';
import { DataTable } from '@shared/components/data-table/data-table';

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
      {
        path: 'table',
        component: DataTable,
      },
    ],
  },
];
