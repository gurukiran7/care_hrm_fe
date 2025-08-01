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
};

export const columns: ColumnDef<LeaveActivityRow>[] = [
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
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`${
          row.original.status === "approved"
            ? "bg-green-400"
            : row.original.status === "pending"
            ? "bg-yellow-400"
            : "bg-red-600"
        } " cursor-pointer dark:text-black"`}
      >
        <Dot className="ml-[-9px] mr-[-4px]" />
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="secondary" className="p-2 gap-1 flex bg-[#F1F5F9]">
        Edit <Pencil className="h-3 w-3" />
      </Button>
    ),
  },
];
