
import { CalendarMinus2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";

interface OnLeaveItem {
  name: string;
  avatar: string;
  date: string;
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

export function OnLeaveList({ onLeave }: { onLeave: OnLeaveItem[] }) {
  // Group by computed day label
  const grouped: Record<string, OnLeaveItem[]> = {};
  onLeave.forEach((item) => {
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
      onLeave.find((l) => getDayLabel(l.date) === a)?.date || ""
    );
    const bDate = new Date(
      onLeave.find((l) => getDayLabel(l.date) === b)?.date || ""
    );
    return aDate.getTime() - bDate.getTime();
  });

  return (
    <Card className="h-80 flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <CalendarMinus2 /> On Leave
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-2 p-0">
        <ScrollArea className="h-60 pr-2">
          <div className="flex flex-col space-y-2 px-4 py-2">
            {dayLabels.map((day) => (
              <div key={day}>
                <div className="font-semibold mt-2">
                  {day} ({grouped[day].length})
                </div>
                {grouped[day].length > 0 ? (
                  grouped[day].map((l) => (
                    <div
                      key={l.name + l.date}
                      className="flex items-center gap-2 mt-2"
                    >
                      <img
                        src={l.avatar}
                        alt={l.name}
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="font-medium text-[#453C52]">{l.name}</span>
                      <span className="text-xs text-gray-500">
                        Leave {formatLeaveRange(l.date, l.endDate)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-xs">
                    Nobody requested Leave for {day}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
