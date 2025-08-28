import { useState } from "react";
import { HolidaysList } from "./components/holidays-list";
import { LeaveRequest } from "../../components/leave/leave-request";
import { LeaveActivity } from "../../components/leave/leave-activity";
import { LeaveRequestForm } from "../../components/leave/leave-request-form";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import { useQuery } from "@tanstack/react-query";
import query from "../../Utils/request/query";
import leaveBalanceApi from "../../types/leaveBalance/leaveBalanceApi";
import holidaysApi from "../../types/holidays/holidaysApi";
import { RequestsList } from "./components/request";
import { navigate } from "raviger";
import { Button } from "../../components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/user-atom";
import { HRRoles } from "../../common/constants";
import { OnLeaveList } from "./components/on-leave-list";
import Page from "../../common/Page";
import {
  TableSkeleton,
  CardListSkeleton,
  FormSkeleton,
} from "../../components/Common/SkeletonLoading";

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

  const { data: holidaysData = { results: [] }, isLoading: holidaysLoading } =
    useQuery({
      queryKey: ["employeeHolidays", employee?.id],
      queryFn: employee?.id
        ? query(holidaysApi.employeeHolidays, {
            pathParams: { id: employee.id },
          })
        : undefined,
      enabled: !!employee?.id,
      select: (res: any) => (Array.isArray(res) ? res : res.results || []),
    });

  const handleRequestLeave = () => setShowForm(true);
  const handleFormSubmit = () => setShowForm(false);

  return (
    <Page className="md:p-8 container mx-auto" title="">
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
          {showHRContent &&
            (isLoading ? <TableSkeleton count={5} /> : <RequestsList />)}
        </div>
        <div className="flex flex-col gap-6">
          {showHRContent &&
            (isLoading ? <CardListSkeleton count={4} /> : <OnLeaveList />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div>
          {isLeaveBalancesLoading ? (
            <FormSkeleton rows={3} />
          ) : (
            employee && (
              <>
                <LeaveRequest
                  leave={{
                    id: leaveBalances[current]?.external_id,
                    title: leaveBalances[current]?.leave_type,
                    daysAvailable: leaveBalances[current]?.balance,
                    icon: null,
                  }}
                  onRequest={handleRequestLeave}
                  onNext={() =>
                    setCurrent((c) => (c + 1) % leaveBalances.length)
                  }
                  onBack={() =>
                    setCurrent(
                      (c) =>
                        (c - 1 + leaveBalances.length) % leaveBalances.length
                    )
                  }
                  hasPrevLeaveType={current > 0}
                  hasNextLeaveType={current < leaveBalances.length - 1}
                  role="employee"
                />

                <LeaveRequestForm
                  open={showForm}
                  onClose={() => setShowForm(false)}
                  onSubmit={handleFormSubmit}
                  leaveBalances={leaveBalances}
                />
              </>
            )
          )}
        </div>

        {employee && (
          <div className="col-span-1">
            {holidaysLoading ? (
              <CardListSkeleton count={1} />
            ) : (
              <HolidaysList
                holidays={Array.isArray(holidaysData) ? holidaysData : []}
              />
            )}
          </div>
        )}
      </div>

      {employee && (
        <div className="mt-6">
          {isLoading ? <TableSkeleton count={4} /> : <LeaveActivity />}
        </div>
      )}
    </Page>
  );
}

export default Dashboard;
