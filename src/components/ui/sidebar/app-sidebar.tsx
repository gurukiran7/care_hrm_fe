import { Link, useLocationChange } from "raviger";
import { useTranslation } from "react-i18next";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "../sidebar";
import { HRNav, HRNavUser } from "./hr-nav";
import { useCurrentEmployee } from "../../../hooks/useEmployee";
import { HRRoles } from "../../../common/constants";
import { useAtomValue } from "jotai/react";
import { authUserAtom } from "../../../state/user-atom";
import { DashboardIcon } from "@radix-ui/react-icons";
import { EmployeeNav } from "./employee-nav";

export function AppSidebar({}) {
  const { t } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { employee } = useCurrentEmployee();
  useLocationChange(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  });
  const authUser = useAtomValue(authUserAtom);
  const user = employee?.user || authUser;

  const showHRNav =
    user &&
    (
      ("user_type" in user && HRRoles.includes((user.user_type || "").toLowerCase())) ||
      ("is_superuser" in user && user.is_superuser)
    );

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="group-data-[side=left]:border-r-0"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-white mt-2"
            >
              <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                    <DashboardIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight text-gray-900">
                    <span className="truncate font-semibold">
                      {t("View Dashboard")}
                    </span>
                  </div>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>{showHRNav ? <HRNav /> : <EmployeeNav/>}</SidebarContent>

      <SidebarFooter>
        <HRNavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
