export type EmployeeType = 'DOCTOR' | 'NURSE' | 'TECHNICIAN' | 'DRIVER' | 'ASSISTANT';

export type ContractType = 'PERMANENT' | 'TEMPORARY' | 'INTERNSHIP' | 'TRAINING';

export interface EmployeeModel {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  documentId: string;
  email: string;
  phone: string;
  employeeType: EmployeeType;
  contractType: ContractType;
  hireDate: string;
  salary: number;
  workingDaysPerYear: number;
  vacationDaysPerYear: number;
  daysWorked: number;
  availableVacationDays: number;
  remainingWorkDays: number;
  overtimeHours: number;
  active: boolean;
  terminationDate?: string;
  notes?: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}
