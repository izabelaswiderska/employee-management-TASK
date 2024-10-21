import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartData, Chart } from 'chart.js';
import {
  BarController,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

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

  public departmentChartData!: ChartData<'bar'>;
  public genderChartData!: ChartData<'pie'>;

  constructor(private fb: FormBuilder) {
    // Registering Chart.js components
    Chart.register(
      PieController,
      ArcElement,
      BarController,
      CategoryScale,
      LinearScale,
      BarElement
    );

    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      gender: ['', Validators.required],
    });

    this.departmentChartData = {
      labels: ['IT', 'Environmental Engineering', 'Marketing', 'Sales'],
      datasets: [
        {
          label: 'Employees per Department',
          data: [0, 0, 0, 0],
          backgroundColor: ['rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1,
        },
      ],
    };

    this.genderChartData = {
      labels: ['Male', 'Female', 'Other'],
      datasets: [
        {
          label: 'Employees by Gender',
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  onAddEmployee() {
    if (this.employeeForm.valid) {
      this.employees.push(this.employeeForm.value);
      this.employeeForm.reset();
      this.updateCharts();
      console.log('added employee');
    }
  }

  onDeleteEmployee(index: number) {
    this.employees.splice(index, 1);
    this.updateCharts();
    console.log('deleted employee');
  }

  updateCharts() {
    const departmentCounts = {
      IT: 0,
      'Environmental Engineering': 0,
      Marketing: 0,
      Sales: 0,
    };

    const genderCounts: { Male: number; Female: number; Other: number } = {
      Male: 0,
      Female: 0,
      Other: 0,
    };

    this.employees.forEach((emp) => {
      departmentCounts[emp.department as keyof typeof departmentCounts]++;
      genderCounts[emp.gender as keyof typeof genderCounts]++;
    });

    this.departmentChartData.datasets[0].data = Object.values(departmentCounts);
    this.departmentChartData.labels = Object.keys(departmentCounts);

    this.genderChartData.datasets[0].data = Object.values(genderCounts);
    this.genderChartData.labels = Object.keys(genderCounts);

    this.departmentChartData = { ...this.departmentChartData };
    this.genderChartData = { ...this.genderChartData };

    console.log(departmentCounts);
    console.log(genderCounts);
  }
}
