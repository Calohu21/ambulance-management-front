import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPage } from '../../auth/pages/login-page/login-page';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styles: ``,
})
export class AuthLayout {}
