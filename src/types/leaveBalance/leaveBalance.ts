export interface LeaveBalance {
  id?: string;
  external_id?: string;
  employee: string;
  leave_type: string;
  balance?: number;
}

export interface LeaveBalanceCreate {
  employee: string;
  leave_type: string;
  balance?: number;
}

export interface LeaveBalanceUpdate {
  employee?: string;
  leave_type?: string;
  balance?: number;
}

export interface LeaveBalanceList extends LeaveBalance {
  leave_type: string;
  employee: string;
  leave_type_id: string;
}