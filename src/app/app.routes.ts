import { Routes } from '@angular/router';
import { DashboardPage } from '@features/dashboard/dashboard-page/dashboard-page';
import { LoginPage } from '@features/auth/pages/login-page/login-page';
import { MainLayout } from '@core/layout/main-layout/main-layout/main-layout';
import { EmployeeListPage } from '@features/employees/pages/employee-list-page/employee-list-page';

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
        path: 'employee-list',
        component: EmployeeListPage,
      },
    ],
  },
];
