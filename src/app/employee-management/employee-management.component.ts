import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartData, Chart, ChartOptions, Legend, Tooltip } from 'chart.js';
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
  public pieChartOptions!: ChartOptions<'pie'>;
  public barChartOptions!: ChartOptions<'bar'>;

  constructor(private fb: FormBuilder) {
    Chart.register(
      PieController,
      ArcElement,
      BarController,
      CategoryScale,
      LinearScale,
      BarElement,
      Legend,
      Tooltip
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
          backgroundColor: ['#123b68', '#a6dcd9', '#b0b0b0', '#6e6e6e'],
          borderColor: ['#0e2e52', '#89c5c1', '#8e8e8e', '#4c4c4c'],
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
          backgroundColor: ['#123b68', '#a6dcd9', '#808080'],
          borderColor: ['#0e2e52', '#89c5c1', '#666666'],
          borderWidth: 1,
        },
      ],
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom', // Position the legend at the bottom of the chart
          labels: {
            font: {
              size: 14,
            },
            color: '#383838', // Styling for the legend text
          },
        },
      },
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
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
