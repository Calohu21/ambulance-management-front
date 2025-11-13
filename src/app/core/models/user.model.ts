export enum Role {
  ADMIN = 'ADMIN',
  EMPLEADO = 'EMPLEADO',
  CONTABLE = 'CONTABLE',
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
