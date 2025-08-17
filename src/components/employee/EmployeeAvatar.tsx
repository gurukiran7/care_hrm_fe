import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import uploadFile from "../../Utils/request/uploadFile";
import { useCurrentEmployee } from "../../hooks/useEmployee";
import { HRRoles } from "../../common/constants";
import { useAtomValue } from "jotai/react";
import { authUserAtom } from "../../state/user-atom";
import userApi from "../../types/user/userApi";
import type { Employee } from "../../types/employee/employee";
import { formatName, getAuthorizationHeader } from "../../Utils/utils";
import mutate from "../../Utils/request/mutate";
import query, { sleep } from "../../Utils/request/query";
import employeeApi from "../../types/employee/employeeApi";
import Loading from "../Common/Loading";
import AvatarEditModal from "../Common/AvatarEditModal";
import { Avatar } from "../Common/avatar";
import { TooltipComponent } from "../ui/tooltip";
import { Button } from "../ui/button";

export default function EmployeeAvatar({ employeeId }: { employeeId: string }) {
  const { t } = useTranslation();
  const [editAvatar, setEditAvatar] = useState(false);
  const { employee } = useCurrentEmployee();
  const queryClient = useQueryClient();

  const authUser = useAtomValue(authUserAtom);
  const user = employee?.user || authUser;

  const canEditAvatar =
    user &&
    (
      ("user_type" in user && HRRoles.includes((user.user_type || "").toLowerCase())) ||
      ("is_superuser" in user && user.is_superuser)
    );

  const { mutateAsync: mutateAvatarDelete } = useMutation({
    mutationFn: mutate(userApi.deleteProfilePicture, {
      pathParams: { username: employee?.user?.username ?? authUser?.username },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployeeDetails", employeeId],
      });
      toast.success(t("profile_picture_deleted"));
      setEditAvatar(false);
    },
  });

  const { data: employeeData, isLoading } = useQuery<Employee>({
    queryKey: ["getEmployeeDetails", employeeId],
    queryFn: query(employeeApi.getEmployee, {
      pathParams: { id: employeeId },
    }),
  });

  if (isLoading || !employeeData) {
    return <Loading />;
  }

  const handleAvatarUpload = async (
    file: File,
    onError: () => void
  ) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    const apiUrl = import.meta.env.VITE_REACT_CARE_API_URL?.trim();

    const url = `${apiUrl}api/v1/users/${employeeData.user.username}/profile_picture/`;
    await uploadFile(
      url,
      formData,
      "POST",
      { Authorization: getAuthorizationHeader() },
      async (xhr: XMLHttpRequest) => {
        if (xhr.status === 200) {
          setEditAvatar(false);
          await sleep(1000);
          queryClient.invalidateQueries({
            queryKey: ["getEmployeeDetails", employeeId],
          });
          toast.success(t("avatar_updated_success"));
        }
      },
      null,
      () => {
        onError();
      }
    );
  };

  const handleAvatarDelete = async (
    onSuccess: () => void,
    onError: () => void
  ) => {
    try {
      await mutateAvatarDelete();
      onSuccess();
    } catch {
      onError();
    }
  };

  return (
    <>
      <AvatarEditModal
        title={t("edit_avatar")}
        open={editAvatar}
        imageUrl={employeeData.user.profile_picture_url}
        handleUpload={handleAvatarUpload}
        handleDelete={handleAvatarDelete}
        onOpenChange={(open) => setEditAvatar(open)}
        aspectRatio={1}
      />
      <div>
        <div className="my-4 overflow-visible rounded-lg bg-white px-4 py-5 shadow-sm sm:rounded-lg sm:px-6 flex justify-between">
          <div className="flex items-center">
            <Avatar
              name={formatName(employeeData.user, true)}
              imageUrl={employeeData.user.profile_picture_url}
              className="size-20"
            />
            <div className="my-4 ml-4 flex flex-col gap-2">
              {!canEditAvatar ? (
                <TooltipComponent
                  content={t("edit_avatar_permission_error")}
                  className="w-full"
                >
                  <Button
                    variant="white"
                    onClick={() => setEditAvatar(!editAvatar)}
                    type="button"
                    id="change-avatar"
                    data-cy="change-avatar"
                    disabled
                  >
                    {t("change_avatar")}
                  </Button>
                </TooltipComponent>
              ) : (
                <Button
                  variant="white"
                  onClick={() => setEditAvatar(!editAvatar)}
                  type="button"
                  id="change-avatar"
                  data-cy="change-avatar"
                >
                  {t("change_avatar")}
                </Button>
              )}

              <p className="text-xs leading-5 text-gray-500">
                {t("change_avatar_note", {
                  maxSize: 2, // update as needed
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
