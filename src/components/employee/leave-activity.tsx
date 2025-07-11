import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../components/ui/card";
import { DataTable } from "../../components/data-table";
import { columns, type LeaveActivityRow } from "./columns";
import { statuses } from "../leave/constants";

export function LeaveActivity({leaveRequest, title}:{leaveRequest:LeaveActivityRow [], title?:string }) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title??"Recent Leaves"}</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={leaveRequest as LeaveActivityRow[]}
            useFilter={true}
            statusColumn="status"
            statuses={statuses}
            filterColumn="description"
          />
        </CardContent>
      </Card>
    </div>
  );
}
