import { useState } from "react";
import { CelebrationsList } from "./components/celebrations-list";
import { HolidaysList } from "./components/holidays-list";
import { LeaveRequest } from "../../components/leave/leave-request";
import { LeaveActivity } from "../../components/leave/leave-activity";
import { LeaveRequestForm } from "../../components/leave/leave-request-form";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import { useQuery } from "@tanstack/react-query";
import query from "../../Utils/request/query";
import leaveBalanceApi from "../../types/leaveBalance/leaveBalanceApi";
import { RequestsList } from "./components/request";
import { navigate } from "raviger";
import { Button } from "../../components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/user-atom";
import { HRRoles } from "../../common/constants";
import { OnLeaveList } from "./components/on-leave-list";
import Page from "../../common/Page";

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

export function Dashboard() {
  const { employee, isLoading } = useCurrentEmployee();
  const authUser = useAtomValue(authUserAtom);
  const user = employee?.user || authUser;

  const showHRContent =
    user &&
    (("user_type" in user &&
      HRRoles.includes((user.user_type || "").toLowerCase())) ||
      ("is_superuser" in user && user.is_superuser));

  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const { data: leaveBalances = [], isLoading: isLeaveBalancesLoading } =
    useQuery({
      queryKey: ["leaveBalances", employee?.id],
      queryFn: query(leaveBalanceApi.listLeaveBalances, {
        queryParams: { employee: employee?.id },
      }),
      enabled: !!employee?.id,
      select: (res: any) => res.results || [],
    });

  const handleRequestLeave = () => {
    setShowForm(true);
  };
  function handleFormSubmit() {
    setShowForm(false);
  }
  if (isLoading) return <div>Loading...</div>;

  if (isLeaveBalancesLoading) return <div>Loading leave balances...</div>;

  return (
    <Page className="md:p-8 container mx-auto " title="">
      {" "}
      {showHRContent && (
        <div className="flex justify-start mb-6">
          <Button onClick={() => navigate("hrm/employees/create")}>
            <PlusIcon className="size-4" />
            Create Employee
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {showHRContent && <RequestsList />}
        </div>
        <div className="flex flex-col gap-6">
          {showHRContent && <OnLeaveList />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          {employee && (
            <LeaveRequest
              leave={{
                id: leaveBalances[current].external_id,
                title: leaveBalances[current].leave_type,
                daysAvailable: leaveBalances[current].balance,
                icon: null,
              }}
              onRequest={handleRequestLeave}
              onNext={() => setCurrent((c) => (c + 1) % leaveBalances.length)}
              onBack={() =>
                setCurrent(
                  (c) => (c - 1 + leaveBalances.length) % leaveBalances.length
                )
              }
              role="employee"
            />
          )}

          {employee && (
            <LeaveRequestForm
              open={showForm}
              onClose={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
              leaveBalances={leaveBalances}
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
      {employee && (
        <div className="mt-6">
          <LeaveActivity />
        </div>
      )}
    </Page>
  );
}

export default Dashboard;
