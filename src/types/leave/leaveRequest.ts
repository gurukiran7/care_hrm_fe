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
  }
  
  export interface LeaveRequestUpdate {
    startDate?: string;
    endDate?: string;
    description?: string;
    leaveType?: string;
  }