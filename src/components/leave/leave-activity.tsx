import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../ui/card";
import { DataTable } from "../data-table";
import { getLeaveActivityColumns } from "../employee/columns";
import { statuses } from "./constants";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import { useMutation, useQuery } from "@tanstack/react-query";
import query from "../../Utils/request/query";
import leaveRequestApi from "../../types/leaveRequest/leaveRequestApi";
import leaveBalanceApi from "../../types/leaveBalance/leaveBalanceApi";

import { useState } from "react";
import type { LeaveActivityRow } from "../employee/columns";
import { LeaveRequestForm } from "./leave-request-form";
import mutate from "../../Utils/request/mutate";
import { toast } from "sonner";

export function LeaveActivity({ title, employeeId, showActions = true }: { title?: string, employeeId?: string, showActions?: boolean }) {
  const { employee } = useCurrentEmployee();
  const effectiveEmployeeId = employeeId ?? employee?.id;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveActivityRow | null>(null);

  const {
    data: leaveRequests = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["leaveActivities", effectiveEmployeeId],
    queryFn: query.debounced(leaveRequestApi.listLeaveRequests, {
      queryParams: { employee: effectiveEmployeeId },
    }),
    enabled: !!effectiveEmployeeId,
    select: (res: any) => res.results || [],
  });

  const { data: leaveBalances = [], isLoading: isLeaveBalancesLoading } =
    useQuery({
      queryKey: ["leaveBalances", employee?.id],
      queryFn: query.debounced(leaveBalanceApi.listLeaveBalances, {
        queryParams: { employee: employee?.id },
      }),
      enabled: !!employee?.id,
      select: (res: any) => res.results || [],
    });

  const { mutate: cancelLeaveRequest, isPending: isCancelling } = useMutation({
    mutationFn: (variables: { id: string }) =>
      mutate(leaveRequestApi.cancelLeaveRequest, {
        pathParams: { id: variables.id },
      })(variables),
    onSuccess: () => {
      toast.success("Leave request cancelled successfully");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to cancel leave request");
    },
  });

  const tableData = leaveRequests.map((req: any) => ({
    id: req.id,
    submitted: req.start_date,
    description: req.reason,
    date: `${req.start_date} to ${req.end_date}`,
    status: req.status,
    can_edit: showActions ? req.can_edit : false,
    can_cancel: showActions ? req.can_cancel : false,
    leave_type: req.leave_type,
    raw: req,
  }));

  const handleEdit = (row: LeaveActivityRow) => {
    setSelectedLeaveRequest(row);
    setIsFormOpen(true);
  };

  const handleCancel = (row: LeaveActivityRow) => {
    if (confirm("Are you sure you want to cancel this leave request?")) {
      cancelLeaveRequest(
        { id: row.id },
      );
    }
  };
  const handleFormSubmit = () => {
    refetch();
    
  }

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedLeaveRequest(null);
  };

  if (isLoading || isLeaveBalancesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {title ?? "Recent Leaves"}
          </CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {title ?? "Recent Leaves"}
          </CardTitle>
        </CardHeader>
        <CardContent>Error loading leave activities.</CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle  className="text-2xl font-bold text-primary-700">
            {title ?? "Recent Leaves"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={getLeaveActivityColumns({
              onEdit: handleEdit,
              onCancel: handleCancel,
              isCancelling,
            })}
            data={tableData}
            useFilter={true}
            statusColumn="status"
            statuses={statuses}
            filterColumn="description"
          />
        </CardContent>
      </Card>

      <LeaveRequestForm
        open={isFormOpen}
        onClose={handleFormClose}
        leaveBalances={leaveBalances}
        mode={selectedLeaveRequest ? "edit" : "create"}
        leaveRequestId={selectedLeaveRequest?.id}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
