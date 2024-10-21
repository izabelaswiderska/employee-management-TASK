import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Employee {
  fullName: string;
  email: string;
  department: string;
  gender: string;
}

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css'],
})
export class EmployeeManagementComponent {
  employeeForm: FormGroup;
  employees: Employee[] = [];

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  onAddEmployee() {
    if (this.employeeForm.valid) {
      this.employees.push(this.employeeForm.value);
      this.employeeForm.reset();
    }
  }

  onDeleteEmployee(index: number) {
    this.employees.splice(index, 1);
  }
}
