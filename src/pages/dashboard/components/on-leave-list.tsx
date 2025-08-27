import { useQuery } from "@tanstack/react-query";
import query from "../../../Utils/request/query";
import leaveRequestApi from "../../../types/leaveRequest/leaveRequestApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Avatar } from "../../../components/Common/avatar";
import { CardListSkeleton } from "../../../components/Common/SkeletonLoading";

interface OnLeaveItem {
  name: string;
  avatar: string;
  date: string;
  rangeStart: string;
  endDate?: string;
}

function getDayLabel(dateStr: string) {
  const today = new Date();
  const leaveDate = new Date(dateStr);
  today.setHours(0, 0, 0, 0);
  leaveDate.setHours(0, 0, 0, 0);

  const diff = Math.round(
    (leaveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return leaveDate.toLocaleString("en-US", { month: "long", day: "numeric" });
}

function formatLeaveRange(start: string, end?: string) {
  const startDate = new Date(start);
  const startStr = startDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  if (!end) return startStr;
  const endDate = new Date(end);
  const endStr = endDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

export function OnLeaveList() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: onLeave = [], isLoading } = useQuery({
    queryKey: ["onLeave", today],
    queryFn: query(leaveRequestApi.listLeaveRequests, {
      queryParams: {
        status: "approved",
        end_date: today,
      },
    }),
    select: (res: any) =>
      (res.results || []).map((leave: any) => {
        const todayStr = new Date().toISOString().slice(0, 10);
        const start = new Date(leave.start_date);
        const today = new Date(todayStr);
    
        const effectiveStart = start < today ? todayStr : leave.start_date;
    
        return {
          name: leave.employee_name,
          avatar: "/profile.png",
          date: effectiveStart,     
          rangeStart: leave.start_date, 
          endDate: leave.end_date,
        };
      }),
    
  });

  const grouped: Record<string, OnLeaveItem[]> = {};
  onLeave.forEach((item: OnLeaveItem) => {
    const label = getDayLabel(item.date);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(item);
  });
  const dayLabels = Object.keys(grouped).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Tomorrow") return -1;
    if (b === "Tomorrow") return 1;
    const aDate = new Date(
      onLeave.find((l: { date: string; }) => getDayLabel(l.date) === a)?.date || ""
    );
    const bDate = new Date(
      onLeave.find((l: { date: string; }) => getDayLabel(l.date) === b)?.date || ""
    );
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <Card className="h-84 flex flex-col shadow-lg border border-gray-200 rounded-xl w-full">
      <CardHeader className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-primary-700">On Leave</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-2 p-0">
        <ScrollArea className="h-72 pr-2">
          <div className="flex flex-col space-y-2 px-2 sm:px-4 py-2">
            {isLoading ? (
              <CardListSkeleton count={4} />
            ) : dayLabels.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-8">Nobody is on leave</div>
            ) : (
              dayLabels.map((day) => (
                <div key={day} className="mb-2">
                  <div className="font-semibold text-primary-700 mt-2 text-base">
                    {day} <span className="text-xs text-gray-500">({grouped[day].length})</span>
                  </div>
                  {grouped[day].length > 0 ? (
                    grouped[day].map((l) => (
                      <div
                        key={l.name + l.date}
                        className="flex items-center gap-3 mt-2 bg-white rounded-lg px-3 py-2 border hover:shadow transition"
                      >
                        <Avatar
                          className="size-8 font-medium text-secondary-800 shadow flex-shrink-0"
                          name={l.name}
                        />
                        <span className="font-medium text-primary-800 truncate">{l.name}</span>
                        <span className="text-xs text-gray-500">
                        Leave {formatLeaveRange(l.rangeStart, l.endDate)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-xs">
                      Nobody requested Leave for {day}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
