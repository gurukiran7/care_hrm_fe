export interface Employee {
  id: string;
  user: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
  phoneNumber: string;
  permissions: string[];
}

export interface EmployeeCreate {
  user: string;
  department: string;
  role: string;
  hireDate: string;
}

export interface EmployeeUpdate {
  department?: string;
  role?: string;
  hireDate?: string;
}