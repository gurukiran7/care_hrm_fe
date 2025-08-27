import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import holidaysApi from "../../../types/holidays/holidaysApi";
import mutate from "../../../Utils/request/mutate";
import query from "../../../Utils/request/query";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "../../../components/ui/table";
import { HolidayDialog, type HolidayFormValues } from "../components/holiday-dialog";
import type { Holiday } from "../../../types/holidays/holidays";

import CareIcon from "../../../CAREUI/icons/CareIcon";
import { TableSkeleton } from "../../../components/Common/SkeletonLoading";
import { EmptyState } from "../../../components/ui/empty-state";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useTranslation } from "react-i18next";
import Page from "../../../common/Page";

function HolidayCard({
  holiday,
  onEdit,
  onDelete,
}: {
  holiday: Holiday;
  onEdit: (holiday: Holiday) => void;
  onDelete: (holiday: Holiday) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 pb-2">
        <div className="mb-4">
          <h3
            className="font-medium text-gray-900 mb-2 break-words line-clamp-2"
            title={holiday.name}
          >
            {holiday.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {t("date")}: {holiday.date}
          </p>
          {holiday.description && (
            <p className="text-sm text-gray-600 mb-3">
              {t("description")}: {holiday.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(holiday)}
        >
          <CareIcon icon="l-edit" className="size-4" />
          {t("edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(holiday)}
        >
          <CareIcon icon="l-trash" className="size-4 text-red-500" />
          {t("delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function HolidaysIndex() {
  const { t } = useTranslation();
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const { data: holidaysData = { results: [] }, refetch, isLoading } = useQuery({
    queryKey: ["holidays", name],
    queryFn: query(holidaysApi.listHolidays, { queryParams: { name } }),
    select: (res: any) => res,
  });

  const addHolidayMutation = useMutation({
    mutationFn: mutate(holidaysApi.addHoliday),
    onSuccess: () => {
      toast.success("Holiday created");
      setShowHolidayDialog(false);
      refetch();
    },
    onError: () => toast.error("Failed to create holiday"),
  });

  const updateHolidayMutation = useMutation({
    mutationFn: ({ id, ...body }: { id: string; name: string; date: string; description?: string }) =>
      mutate(holidaysApi.updateHoliday, { pathParams: { id } })(body),
    onSuccess: () => {
      toast.success("Holiday updated");
      setEditHolidayId(null);
      refetch();
    },
    onError: () => toast.error("Failed to update holiday"),
  });

  const deleteHolidayMutation = useMutation({
    mutationFn: (id: string) => mutate(holidaysApi.deleteHoliday, { pathParams: { id } })(),
    onSuccess: () => {
      toast.success("Holiday deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete holiday"),
  });

  const currentHoliday = holidaysData.results.find((h: Holiday) => h.id === editHolidayId);

  return (
    <Page title={t("holidays")} hideTitleOnPage>
      <div className="container mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-green-700">{t("holidays")}</h1>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {t("manage_holidays", { defaultValue: "Manage holidays for your organization." })}
              </p>
            </div>
            <Button onClick={() => setShowHolidayDialog(true)}>
              <CareIcon icon="l-plus" />
              {t("add_holiday", { defaultValue: "Add Holiday" })}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CareIcon icon="l-search" className="size-5" />
                </span>
                <Input
                  placeholder={t("search_holidays", { defaultValue: "Search holidays" })}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full md:w-[300px] pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:hidden">
              <TableSkeleton count={5} />
            </div>
            <div className="hidden md:block">
              <TableSkeleton count={5} />
            </div>
          </>
        ) : holidaysData.results.length === 0 ? (
          <EmptyState
            icon="l-calender"
            title={t("no_holidays_found", { defaultValue: "No holidays found" })}
            description={t("adjust_holiday_filters", { defaultValue: "Try adjusting your search or filters." })}
          />
        ) : (
          <>
            {/* Table view for desktop */}
            <div className="rounded-lg border hidden md:block min-w-[800px]">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>{t("holiday")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("description")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {holidaysData.results.map((h: Holiday) => (
                    <TableRow key={h.id} className="divide-x">
                      <TableCell className="font-medium">{h.name}</TableCell>
                      <TableCell className="text-gray-600">{h.date}</TableCell>
                      <TableCell className="text-gray-600">{h.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditHolidayId(h.id)}
                        >
                          <CareIcon icon="l-edit" className="size-4" />
                          {t("edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => deleteHolidayMutation.mutate(h.id)}
                        >
                          <CareIcon icon="l-trash" className="size-4 text-red-500" />
                          {t("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Card view for mobile */}
            <div className="md:hidden block rounded-lg border">
              {holidaysData.results.map((h: Holiday) => (
                <HolidayCard
                  key={h.id}
                  holiday={h}
                  onEdit={() => setEditHolidayId(h.id)}
                  onDelete={() => deleteHolidayMutation.mutate(h.id)}
                />
              ))}
            </div>
          </>
        )}

        <HolidayDialog
          open={showHolidayDialog || !!editHolidayId}
          onOpenChange={(v: boolean) => {
            setShowHolidayDialog(v);
            if (!v) setEditHolidayId(null);
          }}
          onSubmit={(values: HolidayFormValues) => {
            if (editHolidayId) updateHolidayMutation.mutate({ id: editHolidayId, ...values });
            else addHolidayMutation.mutate(values);
          }}
          isPending={addHolidayMutation.isPending || updateHolidayMutation.isPending}
          initialValues={editHolidayId ? currentHoliday : undefined}
        />
      </div>
    </Page>
  );
}