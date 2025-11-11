import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { AuthLayout } from '../layout/auth-layout/auth-layout';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage,
      },
    ],
  },
];

export default authRoutes;
