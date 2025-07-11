import React, { useState } from "react";
import { Avatar } from "../../../components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";


interface Request {
  id: number;
  name: string;
  avatar: string;
  text: string;
  time: string;
}

export function RequestsList({
  requests,
  onSelect,
}: {
  requests: Request[];
  onSelect?: (req: Request) => void;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <Card className="flex flex-col h-80">
      <CardHeader className="font-semibold ">
        <CardTitle>Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="h-60 pr-2">
          <div className="flex flex-col gap-3 px-4 py-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="group flex items-center gap-3 hover:bg-[#F1F5F9] bg-white rounded-lg px-4 py-3 relative cursor-pointer"
                onMouseEnter={() => setHoveredId(req.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect?.(req)}
              >
                <Avatar
                  className="size-10 font-semibold text-secondary-800"
                  name={req.name}
                  imageUrl={req.avatar}
                />
                <div>
                  <span className="font-medium">{req.name} </span>
                  <span className="text-gray-700">{req.text}</span>
                  <div className="text-xs text-gray-400 text-left">
                    {req.time}
                  </div>
                </div>
                <div
                  className={`absolute right-4 flex gap-2 transition-all duration-200
                    ${
                      hoveredId === req.id
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 translate-x-2 pointer-events-none"
                    }
                  `}
                >
                  <Button
                    size="sm"
                    variant="default"
                    className="bg-green-400 text-white hover:bg-green-700 rounded-full"
                  >
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
