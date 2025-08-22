import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { PlusIcon } from "lucide-react";
import leaveTypeApi from "../../types/leaveTypes/leaveTypeApi";
import holidaysApi from "../../types/holidays/holidaysApi";
import mutate from "../../Utils/request/mutate";
import query from "../../Utils/request/query";
import type { Holiday } from "../../types/holidays/holidays";
import type { LeaveTypeFormValues } from "./components/leavetype-dialog";
import type { HolidayFormValues } from "./components/holiday-dialog";
import { HolidayCard } from "./components/holiday-card";
import { LeaveTypeDialog } from "./components/leavetype-dialog";
import { HolidayDialog } from "./components/holiday-dialog";
import { LeaveTypeCard } from "./components/leavetype-card";

export function LeaveTypesSettings() {
  const [editId, setEditId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  const { data: leaveTypes = [], refetch, isLoading } = useQuery({
    queryKey: ["leaveTypes"],
    queryFn: query(leaveTypeApi.listLeaveTypes),
    select: (res: any) => res.results || [],
  });

  const createMutation = useMutation({
    mutationFn: mutate(leaveTypeApi.addLeaveType),
    onSuccess: () => {
      toast.success("Leave type created");
      setShowCreate(false);
      refetch();
    },
    onError: () => toast.error("Failed to create leave type"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...body }: { id: string; name: string; default_days: number }) =>
      mutate(leaveTypeApi.updateLeaveType, { pathParams: { id } })({ name: body.name, default_days: body.default_days }),
    onSuccess: () => {
      toast.success("Leave type updated");
      setEditId(null);
      refetch();
    },
    onError: () => toast.error("Failed to update leave type"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mutate(leaveTypeApi.deleteLeaveType, { pathParams: { id } })(),
    onSuccess: (_, id) => {
      toast.success("Leave type deleted");
      queryClient.setQueryData(["leaveTypes"], (old: any) => {
        if (!old) return old;
        return old.filter((lt: any) => lt.id !== id);
      });
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
    },
    onError: () => toast.error("Failed to delete leave type"),
  });

  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState<string | null>(null);

  const { data: holidaysData = { results: [] }, refetch: refetchHolidays, isLoading: holidaysLoading } = useQuery({
    queryKey: ["holidays"],
    queryFn: query(holidaysApi.listHolidays),
    select: (res: any) => res,
  });

  const addHolidayMutation = useMutation({
    mutationFn: mutate(holidaysApi.addHoliday),
    onSuccess: () => {
      toast.success("Holiday created");
      setShowHolidayDialog(false);
      refetchHolidays();
    },
    onError: () => toast.error("Failed to create holiday"),
  });

  const updateHolidayMutation = useMutation({
    mutationFn: ({ id, ...body }: { id: string; name: string; date: string; description?: string }) =>
      mutate(holidaysApi.updateHoliday, { pathParams: { id } })(body),
    onSuccess: () => {
      toast.success("Holiday updated");
      setEditHolidayId(null);
      refetchHolidays();
    },
    onError: () => toast.error("Failed to update holiday"),
  });

  const deleteHolidayMutation = useMutation({
    mutationFn: (id: string) => mutate(holidaysApi.deleteHoliday, { pathParams: { id } })(),
    onSuccess: () => {
      toast.success("Holiday deleted");
      refetchHolidays();
    },
    onError: () => toast.error("Failed to delete holiday"),
  });

  const currentEdit = leaveTypes.find((lt: any) => lt.id === editId);
  const currentHoliday = holidaysData.results.find((h: Holiday) => h.id === editHolidayId);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leaves Settings</h2>
        <Button onClick={() => setShowCreate(true)}><PlusIcon className="size-4" /> Add Leave Type</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : leaveTypes.length === 0 ? (
          <div>No leave types found.</div>
        ) : (
          leaveTypes.map((lt: any) => (
            <LeaveTypeCard
              key={lt.id}
              leaveType={lt}
              onEdit={setEditId}
              onDelete={deleteMutation.mutate}
              isDeleting={deleteMutation.isPending}
            />
          ))
        )}
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Holidays</h2>
          <Button onClick={() => setShowHolidayDialog(true)}>
            <PlusIcon className="size-4" /> Add Holiday
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {holidaysLoading ? (
            <div>Loading holidays...</div>
          ) : holidaysData.results.length === 0 ? (
            <div>No holidays found.</div>
          ) : (
            holidaysData.results.map((h: Holiday) => (
              <HolidayCard
                key={h.id}
                holiday={h}
                onEdit={setEditHolidayId}
                onDelete={deleteHolidayMutation.mutate}
                isDeleting={deleteHolidayMutation.isPending}
              />
            ))
          )}
        </div>
      </div>

      <LeaveTypeDialog
        open={showCreate || !!editId}
        onOpenChange={(v:boolean) => {
          setShowCreate(false);
          if (!v) setEditId(null);
        }}
        onSubmit={(values: LeaveTypeFormValues) => {
          if (editId) updateMutation.mutate({ id: editId, ...values });
          else createMutation.mutate(values);
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
        initialValues={editId ? currentEdit : undefined}
      />

      <HolidayDialog
        open={showHolidayDialog || !!editHolidayId}
        onOpenChange={(v:boolean) => {
          setShowHolidayDialog(v);
          if (!v) setEditHolidayId(null);
        }}
        onSubmit={(values: HolidayFormValues) => {
          if (editHolidayId) updateHolidayMutation.mutate({ id: editHolidayId, ...values });
          else addHolidayMutation.mutate(values);
        }}
        isPending={addHolidayMutation.isPending || updateHolidayMutation.isPending}
        initialValues={editHolidayId ? currentHoliday : undefined}
      />
    </div>
  );
}