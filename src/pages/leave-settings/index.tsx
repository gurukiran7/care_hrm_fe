import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "../../components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import leaveTypeApi from "../../types/leaveTypes/leaveTypeApi";
import mutate from "../../Utils/request/mutate";
import query from "../../Utils/request/query";
import { PlusIcon, CalendarDaysIcon } from "lucide-react";
import holidaysApi from "../../types/holidays/holidaysApi";
import type { Holiday } from "../../types/holidays/holidays";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import { Calendar } from "../../components/ui/calender"; // adjust import path if needed

const leaveTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  default_days: z.coerce.number().min(0, "Default days is required"),
});

type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>;

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

  const createForm = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema) as any,
    defaultValues: { name: "", default_days: 0 },
  });

  const editForm = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema) as any,
    defaultValues: { name: "", default_days: 0 },
  });

  const currentEdit = leaveTypes.find((lt: any) => lt.id === editId);
  if (editId && currentEdit) {
    editForm.setValue("name", currentEdit.name || "");
    editForm.setValue("default_days", currentEdit.default_days ?? 0);
  }

  // Holidays state
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

  // Holiday form
  const holidaySchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().min(1, "Date is required"),
    description: z.string().optional(),
  });
  type HolidayFormValues = z.infer<typeof holidaySchema>;

  const holidayForm = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema) as any,
    defaultValues: { name: "", date: "", description: "" },
  });

  // Fill edit form
  const currentHoliday = holidaysData.results.find((h: Holiday) => h.id === editHolidayId);
  if (editHolidayId && currentHoliday) {
    holidayForm.setValue("name", currentHoliday.name || "");
    holidayForm.setValue("date", currentHoliday.date || "");
    holidayForm.setValue("description", currentHoliday.description || "");
  }

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
            <Card key={lt.id} className="flex flex-col justify-between h-full shadow-md border border-gray-200 rounded-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{lt.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-600">
                  Default Days: <span className="font-semibold">{lt.default_days ?? 0}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditId(lt.id)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(lt.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Holidays Management Section */}
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
              <Card key={h.id} className="flex flex-col justify-between h-full shadow-md border border-gray-200 rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{h.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600">
                    Date: <span className="font-semibold">{h.date}</span>
                  </div>
                  {h.description && (
                    <div className="text-gray-500 mt-2">{h.description}</div>
                  )}
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditHolidayId(h.id)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteHolidayMutation.mutate(h.id)}
                    disabled={deleteHolidayMutation.isPending}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Leave Type</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit((values) => createMutation.mutate(values))}
              className="space-y-4"
            >
              <FormField
                name="name"
                control={createForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input {...field} className="form-input w-full rounded-md border border-gray-300 p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="default_days"
                control={createForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Days</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min={0}
                        {...field}
                        className="form-input w-full rounded-md border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editId} onOpenChange={() => setEditId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Leave Type</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit((values) => {
                if (editId) updateMutation.mutate({ id: editId, ...values });
              })}
              className="space-y-4"
            >
              <FormField
                name="name"
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input {...field} className="form-input w-full rounded-md border border-gray-300 p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="default_days"
                control={editForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Days</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min={0}
                        {...field}
                        className="form-input w-full rounded-md border border-gray-300 p-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showHolidayDialog || !!editHolidayId} onOpenChange={v => { setShowHolidayDialog(v); if (!v) setEditHolidayId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editHolidayId ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
          </DialogHeader>
          <Form {...holidayForm}>
            <form
              onSubmit={holidayForm.handleSubmit((values) => {
                if (editHolidayId) {
                  updateHolidayMutation.mutate({ id: editHolidayId, ...values });
                } else {
                  addHolidayMutation.mutate(values);
                }
              })}
              className="space-y-4"
            >
              <FormField
                name="name"
                control={holidayForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <input {...field} className="form-input w-full rounded-md border border-gray-300 p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="date"
                control={holidayForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full flex justify-between items-center"
                          >
                            {field.value ? field.value : <span>Pick a date</span>}
                            <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString().slice(0, 10));
                            // Optionally close popover here if you use controlled open state
                          }}
                          disabled={() => false}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={holidayForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea {...field} className="form-input w-full rounded-md border border-gray-300 p-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addHolidayMutation.isPending || updateHolidayMutation.isPending}>
                  {editHolidayId
                    ? updateHolidayMutation.isPending
                      ? "Updating..."
                      : "Update"
                    : addHolidayMutation.isPending
                    ? "Creating..."
                    : "Create"}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}