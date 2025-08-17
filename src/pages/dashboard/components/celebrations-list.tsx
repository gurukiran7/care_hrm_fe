import {  Cake } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Avatar } from "../../../components/Common/avatar";

interface Celebration {
  id: number;
  name: string;
  avatar: string;
  date: string;
}

export function CelebrationsList({
  celebrations,
}: {
  celebrations: Celebration[];
}) {
  return (
    <Card className="h-84 flex flex-col shadow-lg border border-gray-200 rounded-xl w-full">
      <CardHeader className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b bg-gray-50 rounded-t-xl">
        <CardTitle className="text-lg font-bold text-primary-700">Celebrations</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-72 pr-2">
          <div className="flex flex-col gap-3 px-2 sm:px-4 py-2">
            {celebrations.length === 0 ? (
              <div className="text-center text-gray-400 text-xs py-8">No celebrations found</div>
            ) : (
              celebrations.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border hover:shadow transition"
                >
                  <Avatar
                    className="size-8 font-medium text-secondary-800 shadow flex-shrink-0"
                    name={c.name}
                    imageUrl={c.avatar}
                  />
                  <div>
                    <div className="font-medium text-primary-800 text-base">{c.name}</div>
                    <div className="text-xs text-blue-600">{c.date}</div>
                  </div>
                  <span className="ml-auto cursor-pointer">
                    <Cake className="w-5 h-5 text-pink-500" />
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
