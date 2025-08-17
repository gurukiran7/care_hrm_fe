import { Button } from "../../components/ui/button";
import { Dot, Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export type LeaveActivityRow = {
  id: string;
  submitted: string;
  description: string;
  date: string;
  status: string;
  can_edit?: boolean;
  can_cancel?: boolean;
  raw?: any;
};

type GetLeaveActivityColumnsProps = {
  onEdit: (row: LeaveActivityRow) => void;
  onCancel: (row: LeaveActivityRow) => void;
  isCancelling?: boolean;
};

export function getLeaveActivityColumns({ onEdit, onCancel, isCancelling }: GetLeaveActivityColumnsProps): ColumnDef<LeaveActivityRow>[] {
  return [
    {
      accessorKey: "submitted",
      header: "Submitted",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: (row: any, columnId: string, filterValue: any) => {
        if (!filterValue || filterValue.length === 0) return true;
        return filterValue.includes(row.getValue(columnId));
      },
      cell: ({ row }: { row: { original: LeaveActivityRow } }) => {
        let badgeVariant: any = "secondary";
        if (row.original.status === "approved") badgeVariant = "green";
        else if (row.original.status === "pending") badgeVariant = "yellow";
        else if (row.original.status === "rejected") badgeVariant = "danger";
        else if (row.original.status === "cancellation_requested") badgeVariant = "orange";

        return (
          <Badge
            variant={badgeVariant}
            className="cursor-pointer capitalize"
          >
            <Dot className="ml-[-9px] mr-[-4px]" />
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: { original: LeaveActivityRow } }) => (
        <div className="flex gap-2">
          {row.original.can_edit && (
            <Button
              variant="secondary"
              size="sm"
              className="gap-1 flex"
              onClick={() => onEdit(row.original)}
            >
              Edit <Pencil className="h-3 w-3" />
            </Button>
          )}
          {row.original.can_cancel && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-1 flex"
              onClick={() => onCancel(row.original)}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel"}
            </Button>
          )}
        </div>
      ),
    },
  ];
}
