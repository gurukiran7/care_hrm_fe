import { ChevronRight, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export type LeaveType = {
  id: string;
  title: string;
  daysAvailable: number;
  icon: React.ReactNode;
};

interface LeaveRequestCardProps {
  leave: LeaveType;
  onRequest?: (leave: LeaveType) => void;
  onNext?: () => void;
  role: "HR" | "employee";
  onAdjust?: () => void;
  onRemove?: () => void;
}

export function LeaveRequest({
  leave,
  onRequest,
  onNext,
  role,
  onAdjust,
  onRemove,
}: LeaveRequestCardProps) {
  return (
    <Card className="relative flex flex-col h-72">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <Calendar /> Leave
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex flex-col items-center">
          <div className="text-base font-semibold">{leave.title}</div>
          <div className="text-center">
            <CardTitle className="flex items-center gap-2 text-6xl font-bold">
              {leave.icon} {leave.daysAvailable}
            </CardTitle>
            <div className="text-base text-gray-500">Days available</div>
          </div>
        </div>
        {onNext && (
          <Button
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
            onClick={onNext}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </CardContent>
      <CardFooter>
        {role === "HR" ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-1"
              onClick={onAdjust}
            >
              +/- Adjust balance
            </Button>
            <Button
              variant="outline"
              className="flex-1 flex items-center gap-1"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        ) : (
          <Button
            className="mt-4 w-full flex items-center gap-2 "
            onClick={() => onRequest && onRequest(leave)}
          >
            <Calendar className="h-4 w-4" />
            Request Leave
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
