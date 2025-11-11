import { Role } from '@core/models/auth.model';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
