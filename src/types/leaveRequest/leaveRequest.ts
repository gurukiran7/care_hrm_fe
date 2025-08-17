export interface LeaveRequest {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    description: string;
    leaveType: string;
    status: "pending" | "approved" | "rejected";
  }
  
  export interface LeaveRequestCreate {
    employee: string;
    start_date: string;
    end_date: string;
    reason: string;
    leave_type: string;
    days_requested?: number; 
  }
  
  export interface LeaveRequestUpdate {
    employee: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    reason: string;
  }