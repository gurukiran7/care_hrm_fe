import { Type } from "../../Utils/request/api";
import type {
  LeaveRequest,
  LeaveRequestCreate,
  LeaveRequestUpdate,
} from "./leaveRequest";

export default {
  addLeaveRequest: {
    path: "/api/hrm/leaves/",
    method: "POST" as const,
    TBody: Type<LeaveRequestCreate>(),
    TRes: Type<LeaveRequest>(),
  },

  updateLeaveRequest: {
    path: "/api/hrm/leaves/{id}/",
    method: "PUT" as const,
    TBody: Type<LeaveRequestUpdate>(),
    TRes: Type<LeaveRequest>(),
  },

  listLeaveRequests: {
    path: "/api/hrm/leaves/",
    method: "GET" as const,
    TRes: Type<LeaveRequest>,
  },

  getLeaveRequest: {
    path: "/api/hrm/leaves/{id}/",
    method: "GET" as const,
    TRes: Type<LeaveRequest>(),
  },
  cancelLeaveRequest: {
    path: "/api/hrm/leaves/{id}/cancel/",
    method: "POST" as const,
    TRes: Type<LeaveRequest>(),
  },
  approveLeaveRequest: {
    path: "/api/hrm/leaves/{id}/approve/",
    method: "POST" as const,
    TRes: Type<LeaveRequest>(),
  },

  rejectLeaveRequest: {
    path: "/api/hrm/leaves/{id}/reject/",
    method: "POST" as const,
    TRes: Type<LeaveRequest>(),
  },
  approveCancelLeaveRequest:{
    path: "/api/hrm/leaves/{id}/approve_cancellation/",
    method: "POST" as const,
    TRes: Type<LeaveRequest>(),

  }
};
