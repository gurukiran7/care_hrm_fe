import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Dot, MoveUpRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Avatar } from "../../../components/avatar";


export interface Employee {
  id: string;
  ProfilePicture: string;
  name: string;
  hireDate: string;
  jobrole: string;
  employementStatus: string;
}

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "ProfilePicture",
    header: "Profile Photo",
    cell: ({ row }) => (
      <div className="w-28 h-28">
      <Avatar
        className=""
        name={row.original.name}
        imageUrl={row.original.ProfilePicture}
      />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="max-w-60 truncate">
            {row.original.name}
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-96">
              <p className="text-sm">{row.original.name}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "hireDate",
    header: "Hire Date",
    cell: ({ row }) => <span>{row.original.hireDate}</span>,
  },
  {
    accessorKey: "jobrole",
    header: "Job Role",
    cell: ({ row }) => <span>{row.original.jobrole}</span>,
  },
  {
    accessorKey: "employementStatus",
    header: "Employment Status",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className=
          "bg-green-400 cursor-pointer dark:text-black"
      >
        <Dot className="ml-[-9px] mr-[-4px]" />
        {row.original.employementStatus}
      </Badge>
    ),
  },

  {
    id: "more",
    header: "",
    cell: ({ row }) => (
      <Badge variant="secondary">
        <a
          className="cursor-pointer p-1 flex gap-1"
          href={`/employees/${row.original.id}`}
        >
          More
          <MoveUpRight className="h-4 w-4" />
        </a>
      </Badge>
    ),
  },
];
