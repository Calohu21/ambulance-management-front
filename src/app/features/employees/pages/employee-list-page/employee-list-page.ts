import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeeService } from '@features/employees/services/employee.service';
import { DataTable } from '@shared/components/data-table/data-table';

@Component({
  selector: 'app-employee-list-page',
  imports: [DataTable],
  templateUrl: './employee-list-page.html',
  styles: ``,
})
export class EmployeeListPage implements OnInit {
  protected employeeService = inject(EmployeeService);
  protected employees = this.employeeService.employees;
  protected isLoading = signal(false);
  protected error = signal('');

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading.set(true);
    this.error.set('');

    this.employeeService.getAllEmployees().subscribe({
      next: () => {
        this.isLoading.set(false);
        console.log(this.employees());
      },
      error: (err) => {
        console.error('Error loading employees in componente:', err);
        this.error.set('No se pueden cargar los empleados. Inténtelo nuevamente.');
        this.isLoading.set(false);
      },
    });
  }
}
