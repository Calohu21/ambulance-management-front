import { Component, input } from '@angular/core';
import { EmployeeModel } from '@features/employees/models/employee.model';

@Component({
  selector: 'app-data-table',
  imports: [],
  templateUrl: './data-table.html',
  styles: ``,
})
export class DataTable {
  employees = input<EmployeeModel[]>();
}
