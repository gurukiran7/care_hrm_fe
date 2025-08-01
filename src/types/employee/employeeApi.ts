import { Type } from "../../Utils/request/api";
import type { Employee, EmployeeCreate, EmployeeUpdate } from "./employee";

export default {
  addEmployee: {
    path: "/api/hrm/employees/",
    method: "POST" as const,
    TBody: Type<EmployeeCreate>(),
    TRes: Type<Employee>(),
  },

  updateEmployee: {
    path: "/api/hrm/employees/{id}/",
    method: "PUT" as const,
    TBody: Type<EmployeeUpdate>(),
    TRes: Type<Employee>(),
  },

  listEmployees: {
    path: "/api/hrm/employees/",
    method: "GET" as const,
    TRes: Type<Employee>,
  },

  getEmployee: {
    path: "/api/hrm/employees/{id}/",
    method: "GET" as const,
    TRes: Type<Employee>(),
  },

  exportEmployees: {
    path: "/api/hrm/employees/export/",
    method: "GET" as const,
  },

  getCurrentEmployee: {
    path: "/api/hrm/employees/current/",
    method: "GET" as const,
    TRes: Type<Employee>(),
  },
};