import { GiftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Cake } from "lucide-react";
import { ScrollArea } from "../../../components/ui/scroll-area";

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
    <Card className="h-72 flex flex-col">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <GiftIcon /> Celebrations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-52 pr-2">
          <div className="flex flex-col gap-2 px-4 py-2">
            {celebrations.map((c) => (
              <Card
                key={c.id}
                className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3"
              >
                <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full" />
                <CardHeader className="text-left p-0 space-y-0">
                  <CardTitle className="font-medium text-lg">{c.name}</CardTitle>
                  <CardDescription className="text-xs text-blue-600">{c.date}</CardDescription>
                </CardHeader>
                <span className="ml-auto cursor-pointer">
                  <Cake />
                </span>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
