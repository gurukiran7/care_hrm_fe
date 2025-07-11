import * as React from "react";
import { useForm } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calender";
import { format } from 'date-fns';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
  } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CalendarHeart } from "lucide-react";
import { cn } from "../../lib/utils";

type LeaveRequestFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    from: Date | undefined;
    to: Date[] | undefined;
    category: string;
    description: string;
  }) => void;
};

type LeaveFormValues = {
  from: Date | undefined;
  to: Date[] | undefined;
  category: string;
  description: string;
};

const leaveCategories = [
  { label: "PTO", value: "pto" },
  { label: "Sick", value: "sick" },
];

export function LeaveRequestForm({ open, onClose, onSubmit }: LeaveRequestFormProps) {
  const form = useForm({
    defaultValues: {
      from: undefined,
      to: undefined,
      category: leaveCategories[0].value,
      description: "",
    },
  });

  function handleSubmit(values: LeaveFormValues) {
    onSubmit(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
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
                rules={{ required: "from date is required" }}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "font-normal w-full flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarHeart className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}

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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "font-normal w-full flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarHeart className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="category"
              control={form.control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Category</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {leaveCategories.find(
                            (opt) => opt.value === field.value
                          )?.label || "Select category"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {leaveCategories.map((opt) => (
                          <DropdownMenuItem
                            key={opt.value}
                            onSelect={() => field.onChange(opt.value)}
                          >
                            {opt.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="form-input w-full rounded-md border border-gray-300 p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
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
