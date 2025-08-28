import React, { useState } from "react";
import { ChevronRight, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
  role: "HR" | "employee" | "view";
  onAdjust?: (newBalance: number) => void;
  onBack?: () => void;
  hasPrevLeaveType?: boolean;
  hasNextLeaveType?: boolean;
}

export function LeaveRequest({
  leave,
  onRequest,
  onNext,
  role,
  onAdjust,
  onBack,
  hasPrevLeaveType,
  hasNextLeaveType,
}: LeaveRequestCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editBalance, setEditBalance] = useState<number>(leave.daysAvailable);

  const handleStartEdit = () => {
    setEditBalance(leave.daysAvailable);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditBalance(leave.daysAvailable);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (onAdjust && editBalance !== leave.daysAvailable &&  typeof editBalance === "number" &&
      !isNaN(editBalance)) {
      onAdjust(editBalance);
    }
    setIsEditing(false);
  };

  return (
    <Card className="flex flex-col justify-between h-full shadow-md border border-gray-200 rounded-lg p-0">
      <CardHeader className="flex flex-row items-center gap-3 bg-gray-50 rounded-t-lg px-6 py-4">
        {onBack && hasPrevLeaveType && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary-100"
            onClick={onBack}
            aria-label="Back"
          >
            <ChevronRight className="h-5 w-5 text-primary-600 rotate-180" />
          </Button>
        )}
        <div className="flex items-center justify-center bg-primary-100 rounded-full h-10 w-10">
          {leave.icon || <Calendar className="h-6 w-6 text-primary-600" />}
        </div>
        <CardTitle className="text-lg font-semibold text-primary-700 flex-1">
          {leave.title}
        </CardTitle>
        {onNext && hasNextLeaveType &&  (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary-100"
            onClick={onNext}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-primary-600" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center py-8">
        {isEditing ? (
          <Input
            type="number"
            min={0}
            value={editBalance}
            onChange={(e) => setEditBalance(Number(e.target.value))}
            className="text-5xl font-bold text-primary-800 text-center w-24"
          />
        ) : (
          <div className="text-5xl font-bold text-primary-800 flex items-center gap-2">
            {leave.daysAvailable}
          </div>
        )}
        <div className="text-base text-gray-500 mt-2">Days Available</div>
      </CardContent>

      <CardFooter className="bg-gray-50 rounded-b-lg px-6 py-4">
        {role === "HR" && onAdjust ? (
          isEditing ? (
            <div className="flex gap-2 w-full">
              <Button
                className="flex-1 bg-primary-600 text-white font-semibold hover:bg-primary-700"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={handleStartEdit}
            >
              <span className="font-medium text-primary-700">Adjust</span>
            </Button>
          )
        ) : role === "employee" && onRequest ? (
          <Button
            className="w-full flex items-center gap-2 bg-primary-600 text-white font-semibold hover:bg-primary-700"
            onClick={() => onRequest && onRequest(leave)}
          >
            <Calendar className="h-4 w-4" />
            Request Leave
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
