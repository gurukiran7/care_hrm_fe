import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const leaveTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  default_days: z.coerce.number().min(0, "Default days is required"),
});
export type LeaveTypeFormValues = z.infer<typeof leaveTypeSchema>;

export function LeaveTypeDialog({ open, onOpenChange, onSubmit, isPending, initialValues }: any) {
  const form = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(leaveTypeSchema) as any,
    defaultValues: initialValues || { name: "", default_days: 0 },
  });
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset({ name: "", default_days: 0 });
    }
  }, [initialValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialValues ? "Edit Leave Type" : "Add Leave Type"}</DialogTitle>
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
              name="default_days"
              control={form.control}
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