import { MobileNavbar } from "./mobile-navbar";
import { cn } from "../lib/utils";
import { Link, usePath } from "raviger";
import { hrRoutes } from "./nav-options";
import { Button } from "./ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { User } from "lucide-react";
import { useAtomValue } from "jotai/react";
import { authUserAtom } from "../state/user-atom";
import { getHRMPermissions, hasPermission } from "../common/Permissions";

export default function Navbar() {
  const pathname = usePath();
  const user = useAtomValue(authUserAtom);
  const permissions = user?.permissions ?? [];
  const hrmPermissions = getHRMPermissions(hasPermission, permissions);
  const routes = hrRoutes;

  return (
    <nav className="fixed w-full z-50 flex justify-between items-center py-4 px-4 border-b border-[#F8FAFC]/10 bg-[#F1F5F9]/90 backdrop-blur-sm">
      <div className="flex items-center group">
        <Link href={"/"}>
          <h1 className="ml-2 !text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
            Care_HRM
          </h1>
        </Link>
      </div>
      {hrmPermissions.canViewHRDashboard ? (
        <div className="hidden md:flex items-center gap-2">
          <div className="flex flex-row gap-x-6 mr-8">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link href={route.href} key={route.href}>
                  <div
                    className={cn(
                      "flex items-center space-x-1 py-2 px-3 rounded-md transition-colors",
                      isActive
                        ? "text-[#111827] font-medium"
                        : "text-[#111827]/70 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    <span className="font-bold text-lg cursor-pointer">
                      {route.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
            <Button className="rounded-full bg-[#111827] text-[#F8FAFC] hover:bg-[#111827]/90 flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              create employee
            </Button>
        </div>
      ) : hrmPermissions.canViewEmployeeDashboard ? (
        <div className="ml-auto flex items-center">
          <Link href="/profile">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center space-x-1 py-2 px-3 rounded-md transition-colors",
                pathname === "/profile"
                  ? "text-[#111827] font-medium"
                  : "text-[#111827]/70 hover:text-primary hover:bg-primary/5"
              )}
            >
              <User className="w-6 h-6" />
              <span className="hidden md:inline font-semibold">My Profile</span>
            </Button>
          </Link>
        </div>
      ) : null}
      <MobileNavbar />
    </nav>
  );
}
