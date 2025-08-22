import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";
import { CalendarDaysIcon } from "lucide-react";
import { Calendar } from "../../../components/ui/calender";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const holidaySchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});
export type HolidayFormValues = z.infer<typeof holidaySchema>;

export function HolidayDialog({ open, onOpenChange, onSubmit, isPending, initialValues }: any) {
  const form = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema) as any,
    defaultValues: initialValues || { name: "", date: "", description: "" },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              name="name"
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? (initialValues ? "Updating..." : "Creating...") : (initialValues ? "Update" : "Create")}
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