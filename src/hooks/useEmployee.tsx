import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../types/employee/employee";
import query from "../Utils/request/query";
import employeeApi from "../types/employee/employeeApi";


type EmployeeContextType = {
  employee: Employee | undefined;
  isLoading: boolean;
  error: Error | null;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {

  const mockEmployee = {
    id: "85b6f6b6-a4b6-464c-9b4a-03c28927812c",
    name: "Test Employee",
    permissions: [
      "create_employee",
      "can_create_leave_request"
    ],
  };
 const useMock = true;
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ["currentEmployee"],
    queryFn: query(employeeApi.getCurrentEmployee),
  });

  return (
    <EmployeeContext.Provider value={useMock ? {employee:mockEmployee, isLoading: false, error: null}: { employee, isLoading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useCurrentEmployee() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useCurrentEmployee must be used within EmployeeProvider");
  return ctx;
}