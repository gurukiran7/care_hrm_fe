import { useState } from "react";
import { RequestsList } from "./components/request";
import { OnLeaveList } from "./components/on-leave-list";
import { CelebrationsList } from "./components/celebrations-list";
import { HolidaysList } from "./components/holidays-list";
import { RequestDetailCard } from "./components/request-detail";
import { type Request } from "./components/request-detail";
import { BriefcaseMedical, Palmtree } from "lucide-react";
import { LeaveRequest } from "../../components/leave/leave-request";
import { LeaveActivity } from "../../components/employee/leave-activity";
import { LeaveRequestForm } from "../../components/leave/leave-request-form";
import { getHRMPermissions, hasPermission } from "../../common/Permissions";
import { useCurrentEmployee } from "../../hooks/useEmployee";

// mock data
const onLeave = [
  {
    name: "Dorothy Chao",
    avatar: "/avatar.jpg",
    date: "2025-07-6",
    endDate: "2025-07-9",
  },
  {
    name: "John jue",
    avatar: "/avatar.jpg",
    date: "2025-07-28",
  },
  {
    name: "Gurukiran",
    avatar: "/avatar.jpg",
    date: "2025-07-07",
    endDate: "2025-07-9",
  },
  {
    name: "kiran",
    avatar: "/avatar.jpg",
    date: "2025-07-08",
  },
  {
    name: "karan",
    avatar: "/avatar.jpg",
    date: "2025-07-06",
  },
];

const requests: Request[] = [
  {
    id: 1,
    name: "Samuel",
    avatar: "/vacatio.svg",
    text: "requested May 28 - May30 off - 24 hours of vacation",
    time: "Yesterday",
  },
  {
    id: 2,
    name: "Samuel",
    avatar: "/avatar-samuel.png",
    text: "made a request: Personal Info Change request",
    time: "Yesterday",
  },
  {
    id: 3,
    name: "Joseph",
    avatar: "/avatar.jpg",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
  {
    id: 4,
    name: "Karan",
    avatar: "/avatar-joseph.png",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
  {
    id: 5,
    name: "Joseph",
    avatar: "/avatar-joseph.png",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
  {
    id: 6,
    name: "Joseph",
    avatar: "/avatar-joseph.png",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
  {
    id: 7,
    name: "Joseph",
    avatar: "/avatar-joseph.png",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
  {
    id: 8,
    name: "Joseph",
    avatar: "/avatar-joseph.png",
    text: "requested June 1- June 5 off - 40 hours of vacation",
    time: "Just now",
  },
];

const celebrations = [
  {
    id: 1,
    name: "Dr. Samuel",
    avatar: "/avatar.jpg",
    date: "May 31 - Happy Birthday !",
  },
  {
    id: 2,
    name: "Dr. Samuel",
    avatar: "/avatar.jpg",
    date: "May 31 - Happy Birthday !",
  },
  {
    id: 3,
    name: "Dr. Samuel",
    avatar: "/avatar.jpg",
    date: "May 31 - Happy Birthday !",
  },
  {
    id: 4,
    name: "Dr. Samuel",
    avatar: "/avatar.jpg",
    date: "May 31 - Happy Birthday !",
  },
];

const holidays = [
  { id: 1, name: "Memorial Day", date: "Monday, May 26" },
  { id: 2, name: "Juneteenth", date: "Thursday, June 19" },
  {
    id: 3,
    name: "PTO - Family event",
    date: "Thursday, June 2",
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
type LeaveType = {
  id: string;
  title: string;
  daysAvailable: number;
  icon: React.ReactNode;
};

const leaveTypes: LeaveType[] = [
  {
    id: "pto",
    title: "PTO",
    daysAvailable: 8,
    icon: <Palmtree />,
  },
  {
    id: "sick",
    title: "Sick Leave",
    daysAvailable: 4,
    icon: <BriefcaseMedical />,
  },
];

export function Dashboard() {
  const { employee, isLoading, error } = useCurrentEmployee();
  const permissions = employee?.permissions ?? [];
  const hrmPermissions = getHRMPermissions(hasPermission, permissions);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleRequestLeave = () => {
    setShowForm(true);
  };
  function handleFormSubmit() {
    setShowForm(false);
  }
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading employee profile</div>;
  if (!employee) return <div>No employee profile found</div>;


  return (
    <div className="p-8 container mx-auto ">
      {hrmPermissions.canViewHRDashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {selectedRequest ? (
              <RequestDetailCard
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
              />
            ) : (
              <RequestsList requests={requests} onSelect={setSelectedRequest} />
            )}
          </div>
          <div className="flex flex-col gap-6">
            <OnLeaveList onLeave={onLeave} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            {hrmPermissions.canCreateLeaveRequest && (
              <LeaveRequest
                leave={leaveTypes[current]}
                onRequest={handleRequestLeave}
                onNext={() => setCurrent((c) => (c + 1) % leaveTypes.length)}
                role="employee"
              />
            )}
            {hrmPermissions.canCreateLeaveRequest && (
              <LeaveRequestForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleFormSubmit}
              />
            )}
          </div>

        <div className="col-span-1">
          <CelebrationsList celebrations={celebrations} />
        </div>
        <div className="col-span-1">
          <HolidaysList holidays={holidays} />
        </div>
      </div>
        <div className="mt-6">
          <LeaveActivity leaveRequest={leaveActivities} />
        </div>
    </div>
  );
}

export default Dashboard;
