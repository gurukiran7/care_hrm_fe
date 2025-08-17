import { useTranslation } from "react-i18next";
import { NavMain, type NavigationLink } from "./nav-main";
import { UsersIcon, SettingsIcon } from "lucide-react";
import { useSidebar } from "../sidebar";

import { useCurrentEmployee } from "../../../hooks/useEmployee";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../sidebar";
import { useNavigate } from "raviger";
import { Avatar } from "../../Common/avatar";
import { DashboardIcon } from "@radix-ui/react-icons";

export function HRNav() {
  const { t } = useTranslation();

  const links: NavigationLink[] = [
    {
      name: t("dashboard", { defaultValue: "HR Dashboard" }),
      url: "/hrm/dashboard",
      icon: <DashboardIcon className="w-4 h-4" />,
    },
    {
      name: t("employees", { defaultValue: "Employees" }),
      url: "/hrm/employees",
      icon: <UsersIcon className="w-4 h-4" />,
    },
    {
      name: t("leave settings", { defaultValue: "Leave Settings" }),
      url: "/hrm/settings",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
  ];

  return <NavMain links={links} />;
}

export function HRNavUser() {
  const { isMobile, open } = useSidebar();
  const { employee } = useCurrentEmployee();
  const navigate = useNavigate();

  if (!employee) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => navigate(`/hrm/employees/${employee.id}`)}
          data-cy="user-profile-nav"
        >
          <Avatar
            className="size-8 rounded-lg"
            name={employee?.user.first_name || "User"}
          />
          {(open || isMobile) && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {employee.user.first_name}
              </span>
              <span className="truncate text-xs">{employee.user.username}</span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
