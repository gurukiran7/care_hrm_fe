// manifest.ts
import { lazy } from "react";
import { EmployeeProvider } from "./hooks/useEmployee";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface NavigationLink {
  url: string;
  name: string;
  icon?: React.ReactNode;
}

interface Manifest {
  plugin: string;
  routes: Record<string, (...args: any) => React.ReactNode>;
  extends: string[];
  components: Record<string, React.LazyExoticComponent<React.FC<any>>>;
  navItems?: NavigationLink[];
  userNavItems?: NavigationLink[];
}

const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const queryClient = new QueryClient();
const manifest: Manifest = {
  plugin: "care_hrm_fe",
  routes: {
    "/dashboard": () => (
      <QueryClientProvider client={queryClient}>
        <EmployeeProvider>
          <Dashboard />
        </EmployeeProvider>
      </QueryClientProvider>
    ),
  },
  extends: [],
  components: {},
  navItems: [{ url: "/dashboard", name: "Dashboard" }],
};

export default manifest;
