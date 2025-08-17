import { Type } from "../../Utils/request/api";
import type { LeaveBalance, LeaveBalanceCreate, LeaveBalanceUpdate } from "./leaveBalance";

export default {
  addLeaveBalance: {
    path: "/api/hrm/leave-balances/",
    method: "POST" as const,
    TBody: Type<LeaveBalanceCreate>(),
    TRes: Type<LeaveBalance>(),
  },

  updateLeaveBalance: {
    path: "/api/hrm/leave-balances/{id}/",
    method: "PUT" as const,
    TBody: Type<LeaveBalanceUpdate>(),
    TRes: Type<LeaveBalance>(),
  },

  listLeaveBalances: {
    path: "/api/hrm/leave-balances/",
    method: "GET" as const,
    TRes: Type<LeaveBalance>,
  },
  
  getLeaveBalance: {
    path: "/api/hrm/leave-balances/{id}/",
    method: "GET" as const,
    TRes: Type<LeaveBalance>(),
  },
};