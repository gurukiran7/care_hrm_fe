import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../types/employee/employee";
import query from "../Utils/request/query";
import employeeApi from "../types/employee/employeeApi";
import { LocalStorageKeys } from "../common/constants";


type EmployeeContextType = {
  employee: Employee | undefined;
  isLoading: boolean;
  error: Error | null;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentEmployee"],
    queryFn: query(employeeApi.getCurrentEmployee),
    retry: false,
    enabled: !!localStorage.getItem(LocalStorageKeys.accessToken),
  });

  const employee =
    data && Object.keys(data).length > 0 ? (data as Employee) : undefined;


  return (
    <EmployeeContext.Provider value={{ employee, isLoading, error }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useCurrentEmployee() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useCurrentEmployee must be used within EmployeeProvider");
  return ctx;
}