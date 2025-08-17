import { Link, navigate } from "raviger";
import { useTranslation } from "react-i18next";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar } from "../Common/avatar";
import { formatName } from "../../Utils/utils";
import type { Employee } from "../../types/employee/employee";
import { Badge } from "../ui/badge";

interface EmployeeCardProps {
  employee: Employee;
  roleName: string;
  actions?: React.ReactNode;
}

export function EmployeeStatusIndicator({
  is_on_leave,
}: {
  is_on_leave?: boolean;
}) {
  const { t } = useTranslation();
  return is_on_leave ? (
    <Badge variant="primary" className="whitespace-nowrap">
      <span className="inline-flex items-center gap-1 text-yellow-700 font-semibold">
        <span className="inline-block size-2 rounded-full bg-yellow-500" />
        {t("on_leave")}
      </span>
    </Badge>
  ) : (
    <Badge variant="yellow" className="whitespace-nowrap">
      <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
        <span className="inline-block size-2 rounded-full bg-green-500" />
        {t("active")}
      </span>
    </Badge>
  );
}

export function EmployeeCard(props: EmployeeCardProps) {
  const { employee, actions, roleName } = props;
  const { t } = useTranslation();

  return (
    <Card
      key={employee.id}
      className={cn("h-full", employee.user.deleted && "opacity-60")}
    >
      <CardContent className="p-4 flex flex-col h-full justify-between">
        <div className="flex items-start gap-3">
          <Avatar
            name={`${employee.user.first_name} ${employee.user.last_name}`}
            imageUrl={employee.user.profile_picture_url}
            className="h-12 w-12 sm:h-14 sm:w-14 text-xl sm:text-2xl flex-shrink-0"
          />

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between">
                <h1 className="text-base font-bold break-words pr-2">
                  {formatName(employee.user)}
                </h1>
                <span className="text-sm text-gray-500">
                  <EmployeeStatusIndicator is_on_leave={employee.is_on_leave} />
                </span>
              </div>
              <span className="text-sm text-gray-500 mr-2 break-words">
                {employee.user.username}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-500">{t("role")}</div>
                <div className="font-medium truncate" data-cy="employee-role">
                  {roleName || employee.user.user_type}
                </div>
              </div>
              <div>
                <div className="text-gray-500">{t("phone_number")}</div>
                <div className="font-medium truncate">
                  {employee.user.phone_number
                    ? formatPhoneNumberIntl(employee.user.phone_number)
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 rounded-md py-4 px-4 bg-gray-50 flex justify-end gap-2">
          {!employee.user.deleted ? (
            <>
              {actions}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate(`/hrm/employees/${employee.id}/profile`);
                }}
              >
                <span>{t("see_details")}</span>
              </Button>
            </>
          ) : (
            <div className="bg-gray-200 rounded-md px-2 py-1 text-sm inline-block">
              {t("archived")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const EmployeeGrid = ({
  employees,
}: {
  employees?: Employee[];
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {employees?.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          roleName={employee.user.user_type}
        />
      ))}
    </div>
  );
};

const EmployeeListHeader = () => {
  const { t } = useTranslation();
  return (
    <thead>
      <tr className="bg-gray-50 text-sm font-medium text-gray-500">
        <th className="px-4 py-3 text-left">{t("name")}</th>
        <th className="w-32 px-10 py-3 text-left">{t("status")}</th>
        <th className="px-10 py-3 text-left">{t("role")}</th>
        <th className="px-4 py-3 text-left">{t("contact_number")}</th>
      </tr>
    </thead>
  );
};

const EmployeeListRow = ({ employee }: { employee: Employee }) => {
  const { t } = useTranslation();
  return (
    <tr
      key={employee.id}
      id={`emp_${employee.id}`}
      className="hover:bg-gray-50"
    >
      <td className="px-4 py-4 lg:pr-20">
        <div className="flex items-center gap-3">
          <Avatar
            imageUrl={employee.user.profile_picture_url}
            name={formatName(employee.user, true) ?? ""}
            className="size-10 text-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-sm font-medium">{formatName(employee.user)}</h1>
            <span className="text-xs text-gray-500">
              {employee.user.username}
            </span>
          </div>
        </div>
      </td>
      <td className="px-10 py-4 text-sm">
          <EmployeeStatusIndicator is_on_leave={employee.is_on_leave} />
      </td>
      <td className="px-10 py-4 text-sm">{employee.user.user_type}</td>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        {employee.user.phone_number
          ? formatPhoneNumberIntl(employee.user.phone_number)
          : "-"}
      </td>
      <td className="px-4 py-4">
        <Button asChild variant="outline" size="sm">
          <Link href={`/employees/${employee.id}`}>
            <span>{t("see_details")}</span>
          </Link>
        </Button>
      </td>
    </tr>
  );
};

export const EmployeeList = ({
  employees,
}: {
  employees?: Employee[];
}) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="relative min-w-full divide-y divide-gray-200">
        <EmployeeListHeader />
        <tbody className="divide-y divide-gray-200 bg-white">
          {employees?.map((employee) => (
            <EmployeeListRow key={employee.id} employee={employee} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface EmployeeListAndCardViewProps {
  employees: Employee[];
  activeTab: "card" | "list";
}

export default function EmployeeListAndCardView({
  employees,
  activeTab,
}: EmployeeListAndCardViewProps) {
  const { t } = useTranslation();

  return (
    <>
      {employees.length > 0 ? (
        <>
          {activeTab === "card" ? (
            <EmployeeGrid employees={employees} />
          ) : (
            <EmployeeList employees={employees} />
          )}
        </>
      ) : (
        <div className="h-full space-y-2 rounded-lg bg-white p-7 shadow-sm">
          <div className="flex w-full items-center justify-center text-xl font-bold text-secondary-500">
            {t("no_employees_found")}
          </div>
        </div>
      )}
    </>
  );
}
