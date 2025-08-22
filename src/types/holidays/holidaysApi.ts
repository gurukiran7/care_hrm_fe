import { Type } from "../../Utils/request/api";
import type { Holiday, Leave } from "./holidays";

export default {
  listHolidays: {
    path: "/api/hrm/holidays/",
    method: "GET" as const,
    TRes: Type<{ results: Holiday[]; count: number }>(),
  },
  addHoliday: {
    path: "/api/hrm/holidays/",
    method: "POST" as const,
    TBody: Type<{ name: string; date: string; description?: string }>(),
    TRes: Type<Holiday>(),
  },
  updateHoliday: {
    path: "/api/hrm/holidays/{id}/",
    method: "PUT" as const,
    TBody: Type<{ name: string; date: string; description?: string }>(),
    TRes: Type<Holiday>(),
  },
  deleteHoliday: {
    path: "/api/hrm/holidays/{id}/",
    method: "DELETE" as const,
    TRes: Type<void>(),
  },
  employeeHolidays: {
    path: "/api/hrm/employees/{id}/holidays/",
    method: "GET" as const,
    TRes: Type<{ results: (Holiday | Leave)[] }>(),
  },
};