import type { Employee } from "../../types/employee/employee";
import { formatName } from "../../Utils/utils";
import { Avatar } from "../Common/avatar";
import { TooltipComponent } from "../ui/tooltip";
import { EmployeeStatusIndicator } from "./EmployeeListAndCard";

export default function EmployeeBanner({
  employeeData,
}: {
  employeeData: Employee;
}) {
  if (!employeeData || !employeeData.user) {
    return null;
  }

  const user = employeeData.user;

  return (
    <div className="mb-3 flex flex-col w-full justify-between gap-3 rounded transition-all duration-200 ease-in-out sm:flex-row">
      <div className="flex flex-row gap-2 self-center">
        <Avatar
          imageUrl={user.profile_picture_url}
          name={formatName(user, true)}
          className="size-20 md:mr-2 shrink-0"
        />
        <div className="grid grid-cols-1 self-center">
          <div className="flex flex-row items-center gap-3">
            <TooltipComponent content={formatName(user)} side="top">
              <h1 className="text-xl font-bold truncate" id="employee-name">
                {formatName(user)}
              </h1>
            </TooltipComponent>
            <div className="text-sm text-gray-500">
              <EmployeeStatusIndicator is_on_leave={employeeData.is_on_leave} />
            </div>
          </div>

          <TooltipComponent content={user.username} side="bottom">
            <p
              id="username"
              className="text-sm font-light leading-relaxed text-secondary-600 w-fit"
            >
              {user.username}
            </p>
          </TooltipComponent>
        </div>
      </div>
    </div>
  );
}
