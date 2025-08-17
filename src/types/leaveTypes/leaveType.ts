export interface LeaveType {
    id?: string;
    external_id?: string;
    name: string;
    default_days?: number;
  }
  
  export interface LeaveTypeCreate {
    name: string;
    default_days?: number;
  }
  
  export interface LeaveTypeUpdate {
    name?: string;
    default_days?: number;
  }
  export interface LeaveTypeList extends LeaveType {}
  