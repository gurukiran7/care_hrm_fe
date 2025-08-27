import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "../../lib/utils";

import CareIcon, { type IconName } from "../../CAREUI/icons/CareIcon";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { TooltipComponent } from "../../components/ui/tooltip";

import Loading from "../../components/Common/Loading";
import ArchivedFileDialog from "./ArchivedFileDialog";
import FileUploadDialog from "./FileUploadDialog";
import useFileManager from "../../hooks/useFileManager";
import useFileUpload from "../../hooks/useFileUpload";
import useFilters from "../../hooks/useFilters";

import routes from "../../Utils/request/api";
import query from "../../Utils/request/query";
import { formatName } from "../../Utils/utils";
import type { FileUploadModel } from "../../lib/types/common";
import { authUserAtom } from "../../state/user-atom";
import { useAtomValue } from "jotai";
import {
  BACKEND_ALLOWED_EXTENSIONS,
  FILE_EXTENSIONS,
  HRRoles,
} from "../../common/constants";
import { Label } from "../ui/label";

interface FilesTabProps {
  type: "employee";
  associatingId: string;
  canEdit: boolean | undefined;
}

export const FilesPage = ({ type, associatingId, canEdit }: FilesTabProps) => {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openArchivedFileDialog, setOpenArchivedFileDialog] = useState(false);
  const [selectedArchivedFile, setSelectedArchivedFile] =
    useState<FileUploadModel | null>(null);
  const { qParams, updateQuery, Pagination } = useFilters({
    limit: 15,
    disableCache: true,
  });

  const user = useAtomValue(authUserAtom);

  const canAccess =
    type === "employee" &&
    user &&
    (("user_type" in user &&
      HRRoles.includes((user.user_type || "").toLowerCase())) ||
      ("is_superuser" in user && user.is_superuser));

  const {
    data: files,
    isLoading: filesLoading,
    refetch,
  } = useQuery({
    queryKey: ["files", type, associatingId, qParams],
    queryFn: query.debounced(routes.viewUpload, {
      queryParams: {
        file_type: type,
        associating_id: associatingId,
        name: qParams.name,
        limit: qParams.limit,
        offset: ((qParams.page || 1) - 1) * qParams.limit,
        ...(qParams.is_archived !== undefined && {
          is_archived: qParams.is_archived,
        }),
        ...(qParams.file !== "all" && {
          file_category: qParams.file,
        }),
        ordering: "-modified_date",
      },
    }),
    enabled: canAccess,
  });

  const fileManager = useFileManager({
    type: type,
    onArchive: refetch,
    onEdit: refetch,
    uploadedFiles:
      files?.results
        .filter((file: { is_archived: any }) => !file.is_archived)
        .slice()
        .reverse()
        .map((file: any) => ({
          ...file,
          associating_id: associatingId,
        })) || [],
  });

  const fileUpload = useFileUpload({
    type: type,
    category: "employee_document",
    multiple: true,
    allowedExtensions: BACKEND_ALLOWED_EXTENSIONS,
    allowNameFallback: false,
    onUpload: () => {
      refetch();
    },
    compress: false,
  });

  useEffect(() => {
    if (
      fileUpload.files.length > 0 &&
      fileUpload.files[0] !== undefined &&
      !fileUpload.previewing
    ) {
      setOpenUploadDialog(true);
    } else {
      setOpenUploadDialog(false);
    }
  }, [fileUpload.files, fileUpload.previewing]);

  useEffect(() => {
    if (!openUploadDialog) {
      fileUpload.clearFiles();
    }
  }, [openUploadDialog]);

  const getFileType = (file: FileUploadModel) => {
    return fileManager.getFileType(file);
  };

  const icons: Record<keyof typeof FILE_EXTENSIONS | "UNKNOWN", IconName> = {
    AUDIO: "l-volume",
    IMAGE: "l-image",
    PRESENTATION: "l-presentation-play",
    VIDEO: "l-video",
    UNKNOWN: "l-file-medical",
    DOCUMENT: "l-file-medical",
  };

  const getArchivedMessage = (file: FileUploadModel) => {
    return (
      <div className="flex flex-row gap-2 justify-end">
        <span className="text-gray-200/90 self-center uppercase font-bold">
          Archived
        </span>
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedArchivedFile(file);
            setOpenArchivedFileDialog(true);
          }}
        >
          <span className="flex flex-row items-center gap-1">
            <CareIcon icon="l-archive-alt" />
            View
          </span>
        </Button>
      </div>
    );
  };

  const DetailButtons = ({ file }: { file: FileUploadModel }) => {
    return (
      <>
        <div className="flex flex-row gap-2 justify-end">
          {fileManager.isPreviewable(file) && (
            <Button
              variant="secondary"
              onClick={() => fileManager.viewFile(file, associatingId)}
              data-cy="file-view-button"
            >
              <span className="flex flex-row items-center gap-1">
                <CareIcon icon="l-eye" />
                View
              </span>
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" data-cy="file-options-button">
                <CareIcon icon="l-ellipsis-h" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="text-primary-900">
                <Button
                  size="sm"
                  onClick={() => fileManager.downloadFile(file, associatingId)}
                  variant="ghost"
                  className="w-full flex flex-row justify-stretch items-center"
                >
                  <CareIcon icon="l-arrow-circle-down" className="mr-1" />
                  <span>Download</span>
                </Button>
              </DropdownMenuItem>
              {canEdit && (
                <>
                  <DropdownMenuItem asChild className="text-primary-900">
                    <Button
                      size="sm"
                      onClick={() =>
                        fileManager.archiveFile(file, associatingId)
                      }
                      variant="ghost"
                      className="w-full flex flex-row justify-stretch items-center"
                      data-cy="file-archive-option"
                    >
                      <CareIcon icon="l-archive-alt" className="mr-1" />
                      <span>Archive</span>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-primary-900">
                    <Button
                      size="sm"
                      onClick={() => fileManager.editFile(file, associatingId)}
                      variant="ghost"
                      className="w-full flex flex-row justify-stretch items-center"
                      data-cy="file-rename-button"
                    >
                      <CareIcon icon="l-pen" className="mr-1" />
                      <span>Rename</span>
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  };

  const FilterButton = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="text-sm text-secondary-800"
            data-cy="files-filter-button"
          >
            <span className="flex flex-row items-center gap-1">
              <CareIcon icon="l-filter" />
              <span>Filter</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[calc(100vw-2.5rem)] sm:w-[calc(100%-2rem)]"
        >
          <DropdownMenuItem
            className="text-primary-900"
            onClick={() => {
              updateQuery({ is_archived: "false" });
            }}
            data-cy="active-files-button"
          >
            <span>Active Files</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-primary-900"
            onClick={() => {
              updateQuery({ is_archived: "true" });
            }}
          >
            <span>Archived Files</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const FilterBadges = () => {
    if (typeof qParams.is_archived === "undefined") return null;
    return (
      <div className="flex flex-row gap-2 mt-2 mx-2">
        <Badge
          data-cy="file-status-badge"
          variant="outline"
          className="cursor-pointer"
          onClick={() => updateQuery({ is_archived: undefined })}
        >
          {qParams.is_archived === "false" ? "Active Files" : "Archived Files"}
          <CareIcon icon="l-times-circle" />
        </Badge>
      </div>
    );
  };

  const FileUploadButtons = () => {
    if (!canEdit) return <></>;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline_primary"
            className="flex flex-row items-center mr-2"
            data-cy="add-files-button"
          >
            <CareIcon icon="l-file-upload" className="mr-1" />
            <span>Add Files</span>
            <CareIcon icon="l-angle-down" className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[calc(100vw-2.5rem)] sm:w-full"
        >
          <DropdownMenuItem
            className="flex flex-row items-center"
            onSelect={(e: { preventDefault: () => void }) => {
              e.preventDefault();
            }}
            aria-label="Choose File"
          >
            <Label
              htmlFor={`file_upload_${type}`}
              data-cy="choose-file-option"
              className="flex items-center w-full text-primary-900 hover:text-black py-1 font-medium"
            >
              <CareIcon icon="l-file-upload-alt" />
              <span>Choose File</span>
            </Label>
            {fileUpload.Input({ className: "hidden" })}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => fileUpload.handleCameraCapture()}
            className="flex items-center text-primary-900 font-medium"
            aria-label="Open Camera"
          >
            <CareIcon icon="l-camera" />
            <span>Open Camera</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const RenderCard = () => (
    <div className="xl:hidden space-y-4 px-2">
      {files?.results && files?.results?.length > 0
        ? files.results.map((file: FileUploadModel) => {
            const filetype = getFileType(file);
            const fileName = file.name ? file.name + file.extension : "";

            return (
              <Card
                key={file.id}
                className={cn(
                  "overflow-hidden",
                  file.is_archived ? "bg-white/50" : "bg-white"
                )}
              >
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-full bg-gray-100 shrink-0">
                      <CareIcon icon={icons[filetype]} className="text-xl" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {fileName}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {filetype}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Date</div>
                      <div className="font-medium">
                        {dayjs(file.created_date).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Shared By</div>
                      <div className="font-medium">
                        {file.uploaded_by ? formatName(file.uploaded_by) : ""}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    {file.is_archived ? (
                      getArchivedMessage(file)
                    ) : (
                      <DetailButtons file={file} />
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        : !filesLoading && (
            <div className="text-center py-4 text-gray-500">
              No files found
            </div>
          )}
    </div>
  );

  const RenderTable = () => (
    <div className="hidden xl:block -mt-2">
      <Table className="border-separate border-spacing-y-3 mx-2 lg:max-w-[calc(100%-16px)]">
        <TableHeader>
          <TableRow className="shadow rounded overflow-hidden">
            <TableHead className="w-[20%] bg-white rounded-l">
              File Name
            </TableHead>
            <TableHead className="w-[20%] rounded-y bg-white">
              File Type
            </TableHead>
            <TableHead className="w-[25%] rounded-y bg-white">
              Date
            </TableHead>
            <TableHead className="w-[20%] rounded-y bg-white">
              Shared By
            </TableHead>
            <TableHead className="w-[15%] text-right rounded-r bg-white"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.results && files?.results?.length > 0
            ? files.results.map((file: FileUploadModel) => {
                const filetype = getFileType(file);
                const fileName = file.name ? file.name + file.extension : "";

                return (
                  <TableRow
                    key={file.id}
                    className={cn("shadow rounded-md overflow-hidden group")}
                  >
                    <TableCell
                      className={cn(
                        "font-medium rounded-l-md rounded-y-md group-hover:bg-transparent",
                        file.is_archived ? "bg-white/50" : "bg-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-full bg-gray-100 shrink-0">
                          <CareIcon
                            icon={icons[filetype]}
                            className="text-xl"
                          />
                        </span>
                        {file.name && file.name.length > 20 ? (
                          <TooltipComponent content={fileName}>
                            <span className="text-gray-900 truncate block">
                              {fileName}
                            </span>
                          </TooltipComponent>
                        ) : (
                          <span className="text-gray-900 truncate block">
                            {fileName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "rounded-y-md group-hover:bg-transparent",
                        file.is_archived ? "bg-white/50" : "bg-white"
                      )}
                    >
                      {filetype}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "rounded-y-md group-hover:bg-transparent",
                        file.is_archived ? "bg-white/50" : "bg-white"
                      )}
                    >
                      <TooltipComponent
                        content={dayjs(file.created_date).format(
                          "DD MMM YYYY, hh:mm A"
                        )}
                      >
                        <span>
                          {dayjs(file.created_date).format("DD MMM YYYY ")}
                        </span>
                      </TooltipComponent>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "rounded-y-md group-hover:bg-transparent",
                        file.is_archived ? "bg-white/50" : "bg-white"
                      )}
                    >
                      {file.uploaded_by ? formatName(file.uploaded_by) : ""}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right rounded-r-md rounded-y-md group-hover:bg-transparent",
                        file.is_archived ? "bg-white/50" : "bg-white"
                      )}
                    >
                      {file.is_archived ? (
                        getArchivedMessage(file)
                      ) : (
                        <DetailButtons file={file} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            : !filesLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No files found
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-4">
       {fileManager.Dialogues}
      <ArchivedFileDialog
        open={openArchivedFileDialog}
        onOpenChange={setOpenArchivedFileDialog}
        file={selectedArchivedFile}
      />
      <FileUploadDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        fileUpload={fileUpload}
        associatingId={associatingId}
        type={type}
      />
      <div className="flex flex-wrap items-center gap-2 -mt-2 ">
        <div className="relative flex-1 min-w-72 max-w-96 ml-2">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <Input
            id="search-by-filename"
            name="name"
            placeholder="Search files"
            value={qParams.name || ""}
            onChange={(e) => updateQuery({ name: e.target.value })}
            className="pointer-events-auto pl-10"
            data-cy="search-input"
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterButton />
          {/* {type === "encounter" && (
            <>
              <Button
                variant="outline_primary"
                className="min-w-24 sm:min-w-28"
                onClick={async () => {
                  await queryClient.invalidateQueries({
                    queryKey: ["files"],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["discharge_files"],
                  });
                  toast.success(t("refreshed"));
                }}
              >
                <CareIcon icon="l-sync" className="mr-2" />
                {t("refresh")}
              </Button>
              <ReportBuilderSheet
                facilityId={facilityId || ""}
                patientId={encounter?.patient.id || ""}
                encounterId={encounter?.id || ""}
                permissions={encounter?.permissions || []}
                trigger={
                  <Button variant="primary" asChild>
                    <div className="flex items-center gap-1 text-gray-950 py-0.5 cursor-pointer">
                      <CareIcon
                        icon="l-file-export"
                        className="size-4 text-green-600"
                      />
                      {t("generate_report", {
                        count: 2,
                      })}
                    </div>
                  </Button>
                }
                onSuccess={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["files"],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["discharge_files"],
                  });
                }}
              />
            </>
          )} */}
        </div>

        <div className="ml-auto">
        <FileUploadButtons />
        </div>
      </div>
      <FilterBadges />
      <RenderTable />
      <RenderCard />

      <div className="flex">
        {filesLoading ? (
          <Loading />
        ) : (
          <Pagination totalCount={files?.count || 0} />
        )}
      </div>
    </div>
  );
};
