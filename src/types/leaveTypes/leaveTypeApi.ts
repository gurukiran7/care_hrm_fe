
import { Type } from "../../Utils/request/api";
import type { LeaveType, LeaveTypeCreate, LeaveTypeList, LeaveTypeUpdate } from "./leaveType";

export default {
    addLeaveType: {
      path: "/api/hrm/leave-types/",
      method: "POST" as const,
      TBody: Type<LeaveTypeCreate>(),
      TRes: Type<LeaveType>(),
    },
  
    updateLeaveType: {
      path: "/api/hrm/leave-types/{id}/",
      method: "PUT" as const,
      TBody: Type<LeaveTypeUpdate>(),
      TRes: Type<LeaveType>(),
    },
  
    listLeaveTypes: {
      path: "/api/hrm/leave-types/",
      method: "GET" as const,
      TRes: Type<LeaveTypeList>(),
    },
  
    getLeaveType: {
      path: "/api/hrm/leave-types/{id}/",
      method: "GET" as const,
      TRes: Type<LeaveType>(),
    },
    deleteLeaveType: {
        path: "/api/hrm/leave-types/{id}/",
        method: "DELETE" as const,
        TRes: Type<void>(),
      },
  };