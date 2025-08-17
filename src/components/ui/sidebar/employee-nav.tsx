import { useTranslation } from "react-i18next";
import { NavMain, type NavigationLink } from "./nav-main";
import { DashboardIcon } from "@radix-ui/react-icons";

export function EmployeeNav() {
  const { t } = useTranslation();

  const links: NavigationLink[] = [
    {
      name: t("dashboard", { defaultValue: "HR Dashboard" }),
      url: "/hrm/dashboard",
      icon: <DashboardIcon className="w-4 h-4" />,
    },
  ];

  return <NavMain links={links} />;
}

