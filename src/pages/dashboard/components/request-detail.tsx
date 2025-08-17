import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { MessageCircleMore, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Avatar } from "../../../components/Common/avatar";

export function RequestDetailCard({
  request,
  onClose,
  onApprove,
  onReject,
  onCancel,
}: {
  request: any;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";
  const createdAt = request.requested_at
    ? new Date(request.requested_at).toLocaleString()
    : "";

  // Status badge
  let statusBadge = null;
  if (request.status === "approved") {
    statusBadge = (
      <Badge variant="green" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <CheckCircle2 className="w-4 h-4" /> Approved
      </Badge>
    );
  } else if (request.status === "rejected") {
    statusBadge = (
      <Badge variant="danger" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <XCircle className="w-4 h-4" /> Rejected
      </Badge>
    );
  } else if (request.status === "cancellation_requested") {
    statusBadge = (
      <Badge variant="yellow" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <Clock className="w-4 h-4" /> Cancellation Requested
      </Badge>
    );
  } else if (request.status === "pending") {
    statusBadge = (
      <Badge variant="secondary" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        Pending
      </Badge>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border border-gray-200 rounded-xl w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gray-50 flex flex-row items-center justify-between px-4 sm:px-6 py-4 rounded-t-xl border-b">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Back"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <div>
            <CardTitle className="text-lg font-semibold text-primary-700">
              Leave Request Details
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              {request.employee_name || "Unknown"} &middot; {createdAt}
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge}
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4">
          <Avatar
            className="size-12 font-semibold text-secondary-800 shadow flex-shrink-0"
            name={request.employee_name || "Unknown"}
            imageUrl="/profile.png"
          />
          <div>
            <CardTitle className="text-base font-semibold text-primary-800">
              {request.employee_name || "Unknown"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {request.leave_balance} days of{" "}
              {request.leave_type?.name || "leave"} balance
            </CardDescription>
          </div>
        </div>

        {/* Dates & Days */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            {formatDate(request.start_date)} - {formatDate(request.end_date)}
          </span>
          <span className="font-semibold text-primary-700">
            {request.days_requested} days
          </span>
        </div>

        {/* Reason */}
        <div className="bg-slate-50 border rounded-lg p-3 flex items-center gap-2 text-gray-700">
          <MessageCircleMore className="w-4 h-4" />
          <span>{request.reason || "No message"}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-row gap-3 justify-end pt-2">
          {request.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="primary"
                className="rounded-full"
                onClick={() => onApprove?.(request.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => onReject?.(request.id)}
              >
                Reject
              </Button>
            </>
          )}
          {request.status === "approved" && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => onReject?.(request.id)}
            >
              Reject
            </Button>
          )}
          {request.status === "rejected" && (
            <Button
              size="sm"
              variant="primary"
              className="rounded-full"
              onClick={() => onApprove?.(request.id)}
            >
              Approve
            </Button>
          )}
          {request.status === "cancellation_requested" && (
            <Button
              size="sm"
              variant="warning"
              className="rounded-full"
              onClick={() => onCancel?.(request.id)}
            >
              Approve Cancellation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
