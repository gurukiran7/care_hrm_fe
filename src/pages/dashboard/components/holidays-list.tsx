import { CalendarDaysIcon, GiftIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";

interface Holiday {
  id: number;
  name: string;
  date: string;
}

export function HolidaysList({ holidays }: { holidays: Holiday[] }) {
  return (
    <Card className="h-72 flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <CalendarDaysIcon /> Holidays
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-52 pr-2">
          <div className="flex flex-col gap-2 px-4 py-2">
            {holidays.map(h => (
              <Card key={h.id} className="flex flex-col items-start bg-gray-100 rounded-lg px-4 py-3">
                <CardTitle className="font-medium text-lg">{h.name}</CardTitle>
                <CardDescription className="text-xs text-gray-500">{h.date}</CardDescription>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}