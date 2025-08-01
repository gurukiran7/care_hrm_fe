export const PERMISSION_VIEW_EMPLOYEE_LIST = "view_employee_list";
export const PERMISSION_CREATE_EMPLOYEE = "create_employee";
export const PERMISSION_EDIT_EMPLOYEE = "edit_employee";
export const PERMISSION_DELETE_EMPLOYEE = "delete_employee";
export const PERMISSION_VIEW_HR_DASHBOARD = "view_hr_dashboard";
export const PERMISSION_VIEW_EMPLOYEE_DASHBOARD = "view_employee_dashboard";

export const PERMISSION_CREATE_LEAVE_REQUEST = "can_create_leave_request";
export const PERMISSION_LIST_LEAVE_REQUESTS = "can_list_leave_requests";
export const PERMISSION_UPDATE_LEAVE_REQUEST = "can_update_leave_request";
export const PERMISSION_DELETE_LEAVE_REQUEST = "can_delete_leave_request";
export const PERMISSION_APPROVE_LEAVE_REQUEST = "can_approve_leave_request";
export const PERMISSION_REJECT_LEAVE_REQUEST = "can_reject_leave_request";
export const PERMISSION_LIST_LEAVE_TYPES = "can_list_leave_types";
export const PERMISSION_CREATE_LEAVE_TYPE = "can_create_leave_type";
export const PERMISSION_UPDATE_LEAVE_TYPE = "can_update_leave_type";
export const PERMISSION_DELETE_LEAVE_TYPE = "can_delete_leave_type";
export const PERMISSION_LIST_LEAVE_BALANCES = "can_list_leave_balances";
export const PERMISSION_UPDATE_LEAVE_BALANCE = "can_update_leave_balance";


export interface HRMPermissions {
  /** Permission slug: "hrm.view_employee_list" */
  canViewEmployeeList: boolean;
  /** Permission slug: "hrm.create_employee" */
  canCreateEmployee: boolean;
  /** Permission slug: "hrm.edit_employee" */
  canEditEmployee: boolean;
  /** Permission slug: "hrm.delete_employee" */
  canDeleteEmployee: boolean;
  /** Permission slug: "hrm.view_hr_dashboard" */
  canViewHRDashboard: boolean;
  /** Permission slug: "hrm.view_employee_dashboard" */
  canViewEmployeeDashboard: boolean;
  /** Permission slug: "leave.can_create_leave_request" */
  canCreateLeaveRequest: boolean;
  /** Permission slug: "leave.can_list_leave_requests" */
  canListLeaveRequests: boolean;
  /** Permission slug: "leave.can_update_leave_request" */
  canUpdateLeaveRequest: boolean;
  /** Permission slug: "leave.can_delete_leave_request" */
  canDeleteLeaveRequest: boolean;
  /** Permission slug: "leave.can_approve_leave_request" */
  canApproveLeaveRequest: boolean;
  /** Permission slug: "leave.can_reject_leave_request" */
  canRejectLeaveRequest: boolean;
  /** Permission slug: "leave.can_list_leave_types" */
  canListLeaveTypes: boolean;
  /** Permission slug: "leave.can_create_leave_type" */
  canCreateLeaveType: boolean;
  /** Permission slug: "leave.can_update_leave_type" */
  canUpdateLeaveType: boolean;
  /** Permission slug: "leave.can_delete_leave_type" */
  canDeleteLeaveType: boolean;
  /** Permission slug: "leave.can_list_leave_balances" */
  canListLeaveBalances: boolean;
  /** Permission slug: "leave.can_update_leave_balance" */
  canUpdateLeaveBalance: boolean;
}

export type HasPermissionFn = (
  permission: string,
  permissions: string[],
) => boolean;

export const hasPermission: HasPermissionFn = (permission, permissions) => {
  return permissions.includes(permission);
};
export function getHRMPermissions(
  hasPermission: HasPermissionFn,
  permissions: string[],
): HRMPermissions {
  return {
    canViewEmployeeList: hasPermission(PERMISSION_VIEW_EMPLOYEE_LIST, permissions),
    canCreateEmployee: hasPermission(PERMISSION_CREATE_EMPLOYEE, permissions),
    canEditEmployee: hasPermission(PERMISSION_EDIT_EMPLOYEE, permissions),
    canDeleteEmployee: hasPermission(PERMISSION_DELETE_EMPLOYEE, permissions),
    canViewHRDashboard: hasPermission(PERMISSION_VIEW_HR_DASHBOARD, permissions),
    canViewEmployeeDashboard: hasPermission(PERMISSION_VIEW_EMPLOYEE_DASHBOARD, permissions),
    canCreateLeaveRequest: hasPermission(PERMISSION_CREATE_LEAVE_REQUEST, permissions),
    canListLeaveRequests: hasPermission(PERMISSION_LIST_LEAVE_REQUESTS, permissions),
    canUpdateLeaveRequest: hasPermission(PERMISSION_UPDATE_LEAVE_REQUEST, permissions),
    canDeleteLeaveRequest: hasPermission(PERMISSION_DELETE_LEAVE_REQUEST, permissions),
    canApproveLeaveRequest: hasPermission(PERMISSION_APPROVE_LEAVE_REQUEST, permissions),
    canRejectLeaveRequest: hasPermission(PERMISSION_REJECT_LEAVE_REQUEST, permissions),
    canListLeaveTypes: hasPermission(PERMISSION_LIST_LEAVE_TYPES, permissions),
    canCreateLeaveType: hasPermission(PERMISSION_CREATE_LEAVE_TYPE, permissions),
    canUpdateLeaveType: hasPermission(PERMISSION_UPDATE_LEAVE_TYPE, permissions),
    canDeleteLeaveType: hasPermission(PERMISSION_DELETE_LEAVE_TYPE, permissions),
    canListLeaveBalances: hasPermission(PERMISSION_LIST_LEAVE_BALANCES, permissions),
    canUpdateLeaveBalance: hasPermission(PERMISSION_UPDATE_LEAVE_BALANCE, permissions),
  };
}