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
import { navigate } from "raviger";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();
  let statusBadge = null;
  if (request.status === "approved") {
    statusBadge = (
      <Badge variant="green" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <CheckCircle2 className="w-4 h-4" /> {t("leave_request__approved", { defaultValue: "Approved" })}
      </Badge>
    );
  } else if (request.status === "rejected") {
    statusBadge = (
      <Badge variant="danger" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <XCircle className="w-4 h-4" /> {t("leave_request__rejected", { defaultValue: "Rejected" })}
      </Badge>
    );
  } else if (request.status === "cancellation_requested") {
    statusBadge = (
      <Badge variant="yellow" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        <Clock className="w-4 h-4" /> {t("leave_request__cancellation_requested", { defaultValue: "Cancellation Requested" })}
      </Badge>
    );
  } else if (request.status === "pending") {
    statusBadge = (
      <Badge variant="secondary" className="font-semibold flex items-center gap-1 px-2 py-1 whitespace-nowrap">
        {t("leave_request__pending", { defaultValue: "Pending" })}
      </Badge>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border border-gray-200 rounded-xl w-full max-w-3xl ">
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
              {t("leave_request__details_title", { defaultValue: "Leave Request Details" })}
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
        <div
          className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded transition"
          onClick={() => navigate(`/hrm/employees/${request.employee}`)}
          title="View Employee Profile"
        >
          <Avatar
            className="size-12 font-semibold text-secondary-800 shadow flex-shrink-0"
            name={request.employee_name || "Unknown"}
            imageUrl="/profile.png"
          />
          <div>
            <CardTitle className="text-base font-semibold text-primary-800">
              {request.employee_name || t("employee__employee_not_found", { defaultValue: "Unknown" })}
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


        <div className="bg-slate-50 border rounded-lg p-3 flex items-center gap-2 text-gray-700">
          <MessageCircleMore className="w-4 h-4" />
          <span>{request.reason || t("leave_request__no_message", { defaultValue: "No message" })}</span>
        </div>

        <div className="flex flex-row gap-3 justify-end pt-2">
          {request.status === "pending" && (
            <>
              <Button
                size="sm"
                variant="primary"
                className="rounded-full"
                onClick={() => onApprove?.(request.id)}
              >
                {t("leave_request__approve", { defaultValue: "Approve" })}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                onClick={() => onReject?.(request.id)}
              >
                {t("leave_request__reject", { defaultValue: "Reject" })}
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
              {t("leave_request__reject", { defaultValue: "Reject" })}
            </Button>
          )}
          {request.status === "rejected" && (
            <Button
              size="sm"
              variant="primary"
              className="rounded-full"
              onClick={() => onApprove?.(request.id)}
            >
              {t("leave_request__approve", { defaultValue: "Approve" })}
            </Button>
          )}
          {request.status === "cancellation_requested" && (
            <Button
              size="sm"
              variant="warning"
              className="rounded-full"
              onClick={() => onCancel?.(request.id)}
            >
              {t("leave_request__approve_cancellation", { defaultValue: "Approve Cancellation" })}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
