import { CalendarDaysIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";

interface HolidayOrLeave {
  id: number;
  name: string;
  date?: string; 
  start_date?: string; 
  end_date?: string;  
  type?: "holiday" | "leave";
  description?: string;
  reason?: string;
}

export function HolidaysList({ holidays }: { holidays: HolidayOrLeave[] }) {
  return (
    <Card className="h-84 flex flex-col shadow-lg border border-gray-200 rounded-xl w-full">
      <CardHeader className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-primary-700">Scheduled Holidays & leaves</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-72 pr-2">
          <div className="flex flex-col gap-3 px-2 sm:px-4 py-2">
            {holidays.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-8">No holidays or leaves found</div>
            ) : (
              holidays.map(h => (
                <div key={h.id} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border hover:shadow transition">
                  <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="font-medium text-primary-800 text-base">
                      {h.name}
                      {h.type === "leave" && <span className="text-xs text-gray-500 ml-2">(Leave)</span>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {h.type === "holiday"
                        ? `Date: ${h.date}`
                        : `From: ${h.start_date} To: ${h.end_date}`}
                    </div>
                    {h.type === "holiday" && h.description && (
                      <div className="text-xs text-gray-400">{h.description}</div>
                    )}
                    {h.type === "leave" && h.reason && (
                      <div className="text-xs text-gray-400">Reason: {h.reason}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}