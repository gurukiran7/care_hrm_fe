import { ChevronRight, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { t } from "i18next";

export type LeaveTypeItem = {
  icon: React.ReactNode;
  days: number;
  label: string;
  subLabel?: string;
  type: string;
  onAdjust?: () => void;
  onRemove?: () => void;
};

interface LeaveTypeProps {
  leaveTypes: LeaveTypeItem[];
}

export function LeaveType({ leaveTypes }: LeaveTypeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {leaveTypes.map((leave, idx) => (
        <Card key={idx} className="relative flex flex-col h-72">
          <CardHeader>
            <CardTitle className="flex flex-row gap-2">
              <Calendar /> {t("leave_type__card_title", { defaultValue: "Leave" })}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold">{leave.label}</div>
              {leave.subLabel && (
                <div className="text-xs text-gray-500">{leave.subLabel}</div>
              )}
              <div className="text-center">
                <CardTitle className="flex items-center gap-2 text-6xl font-bold">
                  {leave.icon} {leave.days}
                </CardTitle>
                <div className="text-base text-gray-500">{leave.type}</div>
              </div>
            </div>
            <Button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
              variant="outline"
              size="sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-1"
                onClick={leave.onAdjust}
              >
                {t("leave_type__adjust_balance", { defaultValue: "+/- Adjust balance" })}
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-1"
                onClick={leave.onRemove}
              >
                {t("common__remove", { defaultValue: "Remove" })}
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
