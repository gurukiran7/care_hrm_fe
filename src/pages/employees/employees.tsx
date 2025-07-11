import * as React from "react";
import { useNavigate } from "raviger";

import { columns, type Employee } from "./components/columns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../components/ui/card";
import { DataTable } from "../../components/data-table";
import { Calendar } from "lucide-react";
// Mock data
const employees = [
  {
    id: "1",
    name: "Alice Johnson",
    hireDate: "2022/0/15",
    jobrole: "Accountant",
    employementStatus: "full-time",
  },
  {
    id: "2",
    name: "Bob Smith",
    hireDate: "2021/08/23",
    jobrole: "Doctor",
    employementStatus: "full-time",
  },
  {
    id: "3",
    name: "Carol Lee",
    hireDate: "2023/03/10",
    jobrole: "Nurse",
    employementStatus: "intern",
  },
];

const employeeStatuses = Array.from(
	new Set(employees.map(emp => emp.employementStatus))
  ).map(status => ({
	value: status,
	label: status,
  }));

export function Employees() {
  const navigate = useNavigate();

  return (
    <div className="p-4 container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees as Employee[]}
            useFilter={true}
            statusColumn="employementStatus"
            statuses={employeeStatuses}
          />
          <Calendar/>
        </CardContent>
      </Card>
    </div>
  );
}
