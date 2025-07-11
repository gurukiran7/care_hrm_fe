import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar } from "../../../components/avatar";
import { MessageCircleMore } from "lucide-react";

export interface Request {
  id: number;
  name: string;
  avatar: string;
  text: string;
  time: string;
}

export function RequestDetailCard({
  request,
  onClose,
}: {
  request: Request;
  onClose: () => void;
}) {
  return (
    <Card>
      <CardHeader className="bg-[#F1F5F9] flex flex-row items-center justify-between p-2 mb-2">
        <Button
          onClick={onClose}
          variant="ghost"
          className="flex items-center gap-2 "
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <CardTitle>Leave Request</CardTitle>
        </Button>
        <div className="flex gap-2">
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
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 mb-2 ">
          <Avatar
            className="size-12 font-semibold text-secondary-800"
            name={request.name}
            imageUrl={request.avatar}
          />
          <div className="text-left">
            <CardTitle className="font-semibold text-base">{request.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">{request.text}</CardDescription>
            <CardDescription className="text-xs text-gray-400">{request.time}</CardDescription>

            <div className="text-gray-500 text-sm text-left my-5">
              This request will leave {request.name} 8 days of vacation leave
            </div>
          </div>
        </div>

        <div className="bg-[#F1F5F9] rounded-lg px-4 py-3 mt-4 text-gray-700">
          <span className="flex items-center gap-2">
            <MessageCircleMore />
            Going to My cousin’s wedding
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
