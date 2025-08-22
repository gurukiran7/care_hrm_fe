import { useForm } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calender";
import { eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { CalendarHeart } from "lucide-react";
import { cn } from "../../lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import mutate from "../../Utils/request/mutate";
import query from "../../Utils/request/query";
import leaveRequestApi from "../../types/leaveRequest/leaveRequestApi";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import type { LeaveBalanceList } from "../../types/leaveBalance/leaveBalance";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type LeaveRequestFormProps = {
  open: boolean;
  onClose: () => void;
  leaveBalances: LeaveBalanceList[];
  mode?: "create" | "edit";
  leaveRequestId?: string;
  onSubmit?: (data: any) => void;
};

const leaveFormSchema = z.object({
  from: z.date(),
  to: z.date(),
  leaveType: z.string().nonempty("Leave type is required"),
  message: z.string().min(1, "Description is required"),
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export function LeaveRequestForm({
  open,
  onClose,
  leaveBalances,
  mode = "create",
  leaveRequestId,
  onSubmit,
}: LeaveRequestFormProps) {
  const { employee } = useCurrentEmployee();
  const queryClient = useQueryClient();

  const leaveCategories = useMemo(
    () =>
      leaveBalances.map((lb: LeaveBalanceList) => ({
        label: lb.leave_type,
        value: lb.leave_type_id,
        daysAvailable: lb.balance,
      })) || [],
    [leaveBalances]
  );

  const leaveRequestQuery = useQuery({
    queryKey: ["leave-request", leaveRequestId],
    queryFn: query(leaveRequestApi.getLeaveRequest, {
      pathParams: { id: leaveRequestId || "" },
    }),
    enabled: !!leaveRequestId && mode === "edit",
  });

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      from: undefined,
      to: undefined,
      leaveType: "",
      message: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && leaveRequestQuery.data) {
      const data = leaveRequestQuery.data;
      form.reset({
        from: data.start_date ? new Date(data.start_date) : undefined,
        to: data.end_date ? new Date(data.end_date) : undefined,
        leaveType: data.leave_type?.id || "",
        message: data.reason || "",
      });
    } else if (mode === "create") {
      const currentCategory = form.getValues("leaveType");
      const firstCategory = leaveCategories[0]?.value || "";
      if (currentCategory !== firstCategory) {
        form.reset({
          from: undefined,
          to: undefined,
          leaveType: firstCategory,
          message: "",
        });
      }
    }
  }, [mode, leaveRequestQuery.data, leaveCategories]);

  const { mutate: createLeaveRequest, isPending: isCreating } = useMutation({
    mutationFn: mutate(leaveRequestApi.addLeaveRequest),
    onSuccess: (data: any) => {
      toast.success("Leave request submitted successfully");
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["leaveActivities", employee?.id],
      });
      onSubmit?.(data);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to submit leave request");
    },
  });

  const { mutate: updateLeaveRequest, isPending: isUpdating } = useMutation({
    mutationFn: mutate(leaveRequestApi.updateLeaveRequest, {
      pathParams: { id: leaveRequestId || "" },
    }),
    onSuccess: (data: any) => {
      toast.success("Leave request updated successfully");
      form.reset();
      onSubmit?.(data);
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update leave request");
    },
  });

  const leaveBlocksQuery = useQuery({
    queryKey: ["employee-leaves", employee?.id],
    queryFn: query(leaveRequestApi.listLeaveRequests, {
      queryParams: {
        employee: employee?.id,
        status: ["pending", "approved"].join(","),
      },
    }),
    enabled: !!employee?.id,
  });

  const blockedDates = useMemo(() => {
    if (!leaveBlocksQuery.data) return [];
    const leaves: Request[] = leaveBlocksQuery.data.results || [];
    return leaves.flatMap((leave: any) =>
      eachDayOfInterval({
        start: parseISO(leave.start_date),
        end: parseISO(leave.end_date),
      })
    );
  }, [leaveBlocksQuery.data]);

  function isDateBlocked(date: Date) {
    return blockedDates.some((d:Date) => isSameDay(d, date));
  }

  function handleSubmit(values: LeaveFormValues) {
    if (!employee?.id) {
      toast.error("Employee not found");
      return;
    }

    const fromDate = values.from ? new Date(values.from) : undefined;
    const toDate = values.to ? new Date(values.to) : undefined;
    let daysRequested = 0;

    if (fromDate && toDate) {
      daysRequested =
        Math.floor(
          (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;
    }

    const requestData = {
      employee: employee.id,
      leave_type: values.leaveType,
      start_date: values.from ? format(values.from, "yyyy-MM-dd") : "",
      end_date: values.to ? format(values.to, "yyyy-MM-dd") : "",
      days_requested: daysRequested,
      reason: values.message,
    };

    if (mode === "edit" && leaveRequestId) {
      updateLeaveRequest(requestData);
    } else {
      createLeaveRequest(requestData);
    }
  }

  const isPending = isCreating || isUpdating;
  const title = mode === "edit" ? "Update Leave Request" : "Request Leave";

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <FormField
                name="from"
                control={form.control}
                rules={{ required: "From date is required" }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From</FormLabel>
                    <Popover open={fromOpen} onOpenChange={setFromOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "font-normal w-full flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarHeart className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setFromOpen(false); // Close after select
                          }}
                          disabled={(date) => {
                            if (date < new Date()) return true;

                            if (form.watch("to") && date > form.watch("to")!)
                              return true;

                            if (isDateBlocked(date)) return true;

                            return false;
                            
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="to"
                control={form.control}
                rules={{ required: "To date is required" }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To</FormLabel>
                    <Popover open={toOpen} onOpenChange={setToOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "font-normal w-full flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarHeart className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setToOpen(false); // Close after select
                          }}
                          disabled={(date) => {
                            if (
                              form.watch("from") &&
                              date < form.watch("from")!
                            )
                              return true;
                            if (isDateBlocked(date)) return true;

                            return false;
                            
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Leave Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveCategories.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter reason for leave" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? mode === "edit"
                    ? "Updating..."
                    : "Submitting..."
                  : mode === "edit"
                  ? "Update"
                  : "Submit"}
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
  );
}
