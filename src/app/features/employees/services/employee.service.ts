import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '@core/constants/api.constants';
import { EmployeeModel } from '@features/employees/models/employee.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);

  private readonly employeesCache = signal<EmployeeModel[]>([]);
  readonly employees = this.employeesCache.asReadonly();

  getAllEmployees(): Observable<EmployeeModel[]> {
    return this.http.get<EmployeeModel[]>(`${API_BASE_URL}/employees`).pipe(
      tap((employees) => this.employeesCache.set(employees)),
      catchError((error) => {
        console.error('Get employees error:', error);
        return throwError(() => error);
      }),
    );
  }
}
