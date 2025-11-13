import { FormControl } from '@angular/forms';
import { Role } from '@core/models/user.model';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: Role;
  employeeID: number;
}

export interface LoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface HttpError {
  status: number;
  message: string;
}

export const LOGIN_CONFIG = {
  USERNAME_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 50,
  ERROR_DISMISS_DELAY: 3000,
} as const;
