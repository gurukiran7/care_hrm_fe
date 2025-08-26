// src/features/employee/tabs/LeavesTab.tsx
import { BriefcaseMedical, Palmtree } from "lucide-react";
import { LeaveRequest } from "../leave/leave-request";
import { LeaveActivity } from "../leave/leave-activity";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import leaveBalanceApi from "../../types/leaveBalance/leaveBalanceApi";
import query from "../../Utils/request/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import mutate from "../../Utils/request/mutate";
import { useTranslation } from "react-i18next";

const leaveTypeIcons: Record<string, React.ReactNode> = {
  "Vacation Leave": <Palmtree />,
  "Sick Leave": <BriefcaseMedical />,
};

export function LeavesTab({
  employeeData,
  canEdit,
}: {
  employeeData: any;
  canEdit?: boolean;
}) {
  const { t } = useTranslation();
  const { employee } = useCurrentEmployee();
  const canAdjustLeave = !!canEdit;
  const isOwnProfile = employee?.id === employeeData?.id;
  const queryClient = useQueryClient();

  const {
    data: leaveBalances = [],
    isLoading,
  } = useQuery({
    queryKey: ["leaveBalances", employeeData.id],
    queryFn: query(leaveBalanceApi.listLeaveBalances, {
      queryParams: { employee: employeeData.id },
    }),
    select: (res: any) => res.results || [],
  });

  const updateBalanceMutation = useMutation({
    mutationFn: ({ id, balance }: { id: string | number; balance: number }) =>
      mutate(leaveBalanceApi.updateLeaveBalance, { pathParams: { id } })({
        balance,
      }),
    onSuccess: () => {
      toast.success(
        t("leave_balance__update_success", { defaultValue: "Leave balance updated successfully" })
      );
      queryClient.invalidateQueries({
        queryKey: ["leaveBalances", employeeData.id],
      });
    },
    onError: () => {
      toast.error(
        t("leave_balance__update_failed", { defaultValue: "Failed to update leave balance" })
      );
    },
  });

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isLoading ? (
          <div className="text-center col-span-3 py-8 text-gray-500">
            {t("leave_balance__loading", { defaultValue: "Loading leave balances..." })}
          </div>
        ) : leaveBalances.length === 0 ? (
          <div className="text-center col-span-3 py-8 text-gray-400">
            {t("leave_balance__none_found", { defaultValue: "No leave balances found" })}
          </div>
        ) : (
          leaveBalances.map((balance: any) => (
            <LeaveRequest
              key={balance.id}
              leave={{
                id: balance.external_id,
                title:
                  balance?.leave_type ?? t("leave__title_fallback", { defaultValue: "Leave" }),
                daysAvailable: balance.balance,
                icon: leaveTypeIcons[balance?.leave_type?.name as string] ?? null,
              }}
              role={canAdjustLeave ? "HR" : isOwnProfile ? "employee" : "view"}
              onAdjust={
                canAdjustLeave
                  ? (newBalance: number) =>
                      updateBalanceMutation.mutate({
                        id: balance.external_id, 
                        balance: newBalance, 
                      })
                  : undefined
              }
            />
          ))
        )}
      </div>

      <div className="mt-8">
        <LeaveActivity
          employeeId={employeeData.id}
          showActions={isOwnProfile}
        />
      </div>
    </div>
  );
}
