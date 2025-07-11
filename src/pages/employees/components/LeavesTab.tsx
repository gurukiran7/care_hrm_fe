import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";
import { BriefcaseMedical, Palmtree } from "lucide-react";
import { LeaveRequest } from "../../../components/leave/leave-request";
import { LeaveActivity } from "../../../components/employee/leave-activity";

const years = ["2025", "2024"];
const leaveTypes = [
  {
    id: "vacation",
    title: "Vacation Leave",
    daysAvailable: 20,
    icon: <Palmtree />,
  },
  {
    id: "sick",
    title: "Sick Leave",
    daysAvailable: 10,
    icon: <BriefcaseMedical />,
  },
];

const leaveActivities = [
  {
    id: "1",
    submitted: "2025/07/01",
    description: "PTO - Family event",
    date: "2025/07/10 - 2025/07/12",
    status: "approved",
  },
  {
    id: "2",
    submitted: "2025/07/02",
    description: "Sick Leave - Flu",
    date: "2025/07/05 - 2025/07/07",
    status: "pending",
  },
];

export function EmployeeLeaves() {
  // Handler stubs for HR actions
  const handleAdjust = (leaveId: string) => {
    // Implement adjust logic here
    alert(`Adjust balance for ${leaveId}`);
  };
  const handleRemove = (leaveId: string) => {
    // Implement remove logic here
    alert(`Remove leave type ${leaveId}`);
  };

  return (
    <div className="mt-6">
      <h2 className="!text-xl font-semibold mb-4 text-left">Leave</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaveTypes.map((leave) => (
          <LeaveRequest
            key={leave.id}
            leave={leave}
            role="HR"
            onAdjust={() => handleAdjust(leave.id)}
            onRemove={() => handleRemove(leave.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <LeaveActivity leaveRequest={leaveActivities} title="Leave Activity" />
      </div>
    </div>
  );
}
