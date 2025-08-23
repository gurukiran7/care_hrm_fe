import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import leaveTypeApi from "../../types/leaveTypes/leaveTypeApi";
import holidaysApi from "../../types/holidays/holidaysApi";
import mutate from "../../Utils/request/mutate";
import query from "../../Utils/request/query";
import type { Holiday } from "../../types/holidays/holidays";
import type { LeaveTypeFormValues } from "./components/leavetype-dialog";
import type { HolidayFormValues } from "./components/holiday-dialog";
import { HolidayDialog } from "./components/holiday-dialog";
import { LeaveTypeDialog } from "./components/leavetype-dialog";
import { Table, TableHead, TableRow, TableCell, TableBody } from "../../components/ui/table";

export function LeaveTypesSettings() {
  const [activeTab, setActiveTab] = useState<"holidays" | "leave_types">("holidays");
  const [editId, setEditId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  // Leave Types
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

  // Holidays
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r px-6 py-8">
        <nav className="flex flex-col gap-2">
          <Button
            variant={activeTab === "holidays" ? "secondary" : "ghost"}
            className="justify-start w-full"
            onClick={() => setActiveTab("holidays")}
          >
            Holidays
          </Button>
          <Button
            variant={activeTab === "leave_types" ? "secondary" : "ghost"}
            className="justify-start w-full"
            onClick={() => setActiveTab("leave_types")}
          >
            Leave Types
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-8">
        {activeTab === "holidays" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Holidays</h2>
              <Button onClick={() => setShowHolidayDialog(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Holiday
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Holiday</TableCell>
                  <TableCell className="font-bold">Date</TableCell>
                  <TableCell className="font-bold">Description</TableCell>
                  <TableCell className="font-bold text-right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holidaysLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading holidays...</TableCell>
                  </TableRow>
                ) : holidaysData.results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No holidays found.</TableCell>
                  </TableRow>
                ) : (
                  holidaysData.results.map((h: Holiday) => (
                    <TableRow key={h.id}>
                      <TableCell>{h.name}</TableCell>
                      <TableCell>{h.date}</TableCell>
                      <TableCell>{h.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setEditHolidayId(h.id)}>
                          <PencilIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteHolidayMutation.mutate(h.id)}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "leave_types" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Leave Types</h2>
              <Button onClick={() => setShowCreate(true)}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Leave Type
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold">Name</TableCell>
                  <TableCell className="font-bold">Default Days</TableCell>
                  <TableCell className="font-bold text-right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3}>Loading...</TableCell>
                  </TableRow>
                ) : leaveTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No leave types found.</TableCell>
                  </TableRow>
                ) : (
                  leaveTypes.map((lt: any) => (
                    <TableRow key={lt.id}>
                      <TableCell>{lt.name}</TableCell>
                      <TableCell>{lt.default_days}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="mr-2" onClick={() => setEditId(lt.id)}>
                          <PencilIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(lt.id)}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialogs */}
        <LeaveTypeDialog
          open={showCreate || !!editId}
          onOpenChange={(v: boolean) => {
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
          onOpenChange={(v: boolean) => {
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
      </main>
    </div>
  );
}