import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import leaveTypeApi from "../../../types/leaveTypes/leaveTypeApi";
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
import Page from "../../../common/Page";
import {
  LeaveTypeDialog,
  type LeaveTypeFormValues,
} from "../components/leavetype-dialog";
import { Input } from "../../../components/ui/input";
import CareIcon from "../../../CAREUI/icons/CareIcon";
import { useTranslation } from "react-i18next";
import { TableSkeleton } from "../../../components/Common/SkeletonLoading";
import { EmptyState } from "../../../components/ui/empty-state";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";

function LeaveTypeCard({
  leaveType,
  onEdit,
  onDelete,
}: {
  leaveType: any;
  onEdit: (leaveType: any) => void;
  onDelete: (leaveType: any) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="p-6 pb-2">
        <div className="mb-4">
          <h3
            className="font-medium text-gray-900 mb-2 break-words line-clamp-2"
            title={leaveType.name}
          >
            {leaveType.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {t("default_days")}: {leaveType.default_days ?? "-"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between ">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(leaveType)}
        >
          <CareIcon icon="l-edit" className="size-4" />
          {t("edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(leaveType)}
        >
          <CareIcon icon="l-trash" className="size-4 text-red-500" />
          {t("delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}
export default function LeaveTypesIndex() {
  const { t } = useTranslation();
  const [editId, setEditId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const {
    data: leaveTypes = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["leaveTypes", name],
    queryFn: query(leaveTypeApi.listLeaveTypes, { queryParams: { name } }),
    select: (res: any) => res.results || [],
  });

  const createMutation = useMutation({
    mutationFn: mutate(leaveTypeApi.addLeaveType),
    onSuccess: () => {
      toast.success("Leave type created");
      setShowCreate(false);
      refetch();
    },
    onError: () => toast.error("Failed to create leave type"),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name: string;
      default_days: number;
    }) =>
      mutate(leaveTypeApi.updateLeaveType, { pathParams: { id } })({
        name: body.name,
        default_days: body.default_days,
      }),
    onSuccess: () => {
      toast.success("Leave type updated");
      setEditId(null);
      refetch();
    },
    onError: () => toast.error("Failed to update leave type"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      mutate(leaveTypeApi.deleteLeaveType, { pathParams: { id } })(),
    onSuccess: (_, id) => {
      toast.success("Leave type deleted");
      queryClient.setQueryData(["leaveTypes"], (old: any) => {
        if (!old) return old;
        return old.filter((lt: any) => lt.id !== id);
      });
      queryClient.invalidateQueries({ queryKey: ["leaveTypes"] });
    },
    onError: () => toast.error("Failed to delete leave type"),
  });

  const currentEdit = leaveTypes.find((lt: any) => lt.id === editId);

  return (
    <Page title={t("leave_types")} hideTitleOnPage >
      <div className="container mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-green-700">
            {t("leave_types")}
          </h1>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">
                {t("manage_leave_types_and_defaults", {
                  defaultValue: "Manage leave types and their default days.",
                })}
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)}>
              <CareIcon icon="l-plus" />
              {t("add_leave_type", { defaultValue: "Add Leave Type" })}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CareIcon icon="l-search" className="size-5" />
                </span>
                <Input
                  placeholder={t("search_leave_types", {
                    defaultValue: "Search leave types",
                  })}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full md:w-[300px] pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton count={5} />
        ) : leaveTypes.length === 0 ? (
          <EmptyState
            icon="l-calender"
            title={t("no_leave_types_found", {
              defaultValue: "No leave types found",
            })}
            description={t("adjust_leave_type_filters", {
              defaultValue: "Try adjusting your search or filters.",
            })}
          />
        ) : (
          <>
            <div className="rounded-lg border hidden md:block min-w-[800px]">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>
                      {t("default_days", { defaultValue: "Default Days" })}
                    </TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {leaveTypes.map((lt: any) => (
                    <TableRow key={lt.id} className="divide-x">
                      <TableCell className="font-medium">{lt.name}</TableCell>
                      <TableCell className="text-gray-600">
                        {lt.default_days ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditId(lt.id)}
                        >
                          <CareIcon icon="l-edit" className="size-4" />
                          {t("edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => deleteMutation.mutate(lt.id)}
                        >
                          <CareIcon
                            icon="l-trash"
                            className="size-4 text-red-500"
                          />
                          {t("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden block rounded-lg border">
              {leaveTypes.map((lt: any) => (
                <LeaveTypeCard
                  key={lt.id}
                  leaveType={lt}
                  onEdit={() => setEditId(lt.id)}
                  onDelete={() => deleteMutation.mutate(lt.id)}
                />
              ))}
            </div>
          </>
        )}

        <LeaveTypeDialog
          open={showCreate || !!editId}
          onOpenChange={(v: boolean) => {
            setShowCreate(false);
            if (!v) setEditId(null);
          }}
          onSubmit={(values: LeaveTypeFormValues) => {
            if (editId) updateMutation.mutate({ id: editId, ...values });
            else createMutation.mutate(values);
          }}
          isPending={createMutation.isPending || updateMutation.isPending}
          initialValues={editId ? currentEdit : undefined}
        />
      </div>
    </Page>
  );
}
