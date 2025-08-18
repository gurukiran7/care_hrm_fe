import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { useState } from "react";
import query from "../../../Utils/request/query";
import leaveRequestApi from "../../../types/leaveRequest/leaveRequestApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RequestDetailCard } from "./request-detail";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import mutate from "../../../Utils/request/mutate";
import { toast } from "sonner";
import { Avatar } from "../../../components/Common/avatar";

interface Request {
  id: string;
  can_cancel: boolean;
  can_edit: boolean;
  days_requested: number;
  employee_name: any;
  end_date: string;
  start_date: string;
  requested_at?: string;
  leave_balance: number;
  leave_type: {
    id: string;
    name: string;
    default_days: number;
    is_active: boolean;
  };
  reason?: string;
  status: string;
}

export function RequestsList() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["hrLeaveRequests"],
    queryFn: query.debounced(leaveRequestApi.listLeaveRequests, {
      queryParams: {
        status: "pending,cancellation_requested,approved,rejected",
        start_date: new Date().toISOString().slice(0, 10),
      },
    }),
    select: (res: any) => res.results || [],
    refetchOnWindowFocus: false,
  });

  const { data: selectedRequest } = useQuery({
    queryKey: ["hrLeaveRequest", selectedId],
    queryFn: selectedId
      ? query.debounced(leaveRequestApi.getLeaveRequest, { pathParams: { id: selectedId } })
      : undefined,
    enabled: !!selectedId,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      mutate(leaveRequestApi.approveLeaveRequest, { pathParams: { id } })(),
    onSuccess: (_data, id) => {
      toast.success("Request approved");
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequest", id] });
    },
    onError: () => toast.error("Failed to approve request"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) =>
      mutate(leaveRequestApi.rejectLeaveRequest, { pathParams: { id } })(),
    onSuccess: (_data, id) => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequest", id] });
    },
    onError: () => toast.error("Failed to reject request"),
  });

  const approveCancelMutation = useMutation({
    mutationFn: (id: string) =>
      mutate(leaveRequestApi.approveCancelLeaveRequest, { pathParams: { id } })(),
    onSuccess: (_data, id) => {
      toast.success("Cancellation approved");
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequests"] });
      queryClient.invalidateQueries({ queryKey: ["hrLeaveRequest", id] });
    },
    onError: () => toast.error("Failed to approve cancellation"),
  });

  const handleApprove = (id: string) => approveMutation.mutate(id);
  const handleReject = (id: string) => rejectMutation.mutate(id);
  const handleCancel = (id: string) => approveCancelMutation.mutate(id);

  if (isLoading) return <div>Loading requests...</div>;

  if (selectedId && selectedRequest) {
    return (
      <RequestDetailCard
        request={selectedRequest}
        onClose={() => setSelectedId(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <Card className="flex flex-col h-84 shadow-lg border border-gray-200 rounded-xl w-full max-w-3xl  ">
      <CardHeader className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-primary-700">Leave Requests ( {requests.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-72 pr-2">
          <div className="flex flex-col gap-4 px-2 sm:px-4 py-3">
            {requests.length === 0 && (
              <div className="text-center text-gray-500 py-8">No requests found.</div>
            )}
            {requests.map((req: Request) => {
              const startDate = req.start_date
                ? new Date(req.start_date).toLocaleDateString()
                : "N/A";
              const endDate = req.end_date
                ? new Date(req.end_date).toLocaleDateString()
                : "N/A";
              const createdAt = req.requested_at
                ? new Date(req.requested_at).toLocaleString()
                : "";

              let statusBadge = null;
              if (req.status === "approved") {
                statusBadge = (
                  <Badge variant="green" className="font-medium flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" /> Approved
                  </Badge>
                );
              } else if (req.status === "rejected") {
                statusBadge = (
                  <Badge variant="danger" className="font-medium flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap">
                    <XCircle className="w-3 h-3" /> Rejected
                  </Badge>
                );
              } else if (req.status === "cancellation_requested") {
                statusBadge = (
                  <Badge variant="yellow" className="font-medium flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap">
                    <Clock className="w-3 h-3" /> Cancellation Requested
                  </Badge>
                );
              } else if (req.status === "pending") {
                statusBadge = (
                  <Badge variant="secondary" className="font-medium flex items-center gap-1 px-1.5 py-0.5 text-xs whitespace-nowrap">
                    Pending
                  </Badge>
                );
              }

              return (
                <div
                  key={req.id}
                  className="flex items-center gap-2 sm:gap-4 bg-white rounded-lg px-2 sm:px-4 py-3 cursor-pointer border hover:shadow transition w-full"
                  onClick={() => setSelectedId(req.id.toString())}
                  style={{ minWidth: 0 }}
                >
                  <Avatar
                    className="size-12 font-semibold text-secondary-800 shadow flex-shrink-0"
                    name={req.employee_name || "Unknown"}
                    imageUrl="/profile.png"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="font-medium block truncate text-primary-800 text-base">
                      {req.employee_name || "Unknown"}
                    </span>
                    <span className="text-gray-700 truncate text-sm md:block hidden">
                      {`requested ${startDate} - ${endDate} off • ${req.days_requested * 8} hours`}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">
                      {createdAt}
                    </span>
                  </div>

                  <div className="ml-2 flex-shrink-0">{statusBadge}</div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
