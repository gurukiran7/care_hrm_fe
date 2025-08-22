import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";


export function LeaveTypeCard({ leaveType, onEdit, onDelete, isDeleting }: any) {
  return (
    <Card className="flex flex-col justify-between h-full shadow-md border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{leaveType.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600">
          Default Days: <span className="font-semibold">{leaveType.default_days ?? 0}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(leaveType.id)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(leaveType.id)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}