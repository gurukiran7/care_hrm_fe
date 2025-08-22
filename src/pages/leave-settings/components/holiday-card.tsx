import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card";
import type { Holiday } from "../../../types/holidays/holidays";


export function HolidayCard({ holiday, onEdit, onDelete, isDeleting }: { holiday: Holiday; onEdit: (id: string) => void; onDelete: (id: string) => void; isDeleting: boolean }) {
  return (
    <Card className="flex flex-col justify-between h-full shadow-md border border-gray-200 rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{holiday.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600">
          Date: <span className="font-semibold">{holiday.date}</span>
        </div>
        {holiday.description && (
          <div className="text-gray-500 mt-2">{holiday.description}</div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(holiday.id)}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(holiday.id)}
          disabled={isDeleting}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}