export enum Role {
  ADMIN = 'ADMIN',
  EMPLEADO = 'EMPLEADO',
  CONTABLE = 'CONTABLE',
}

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
