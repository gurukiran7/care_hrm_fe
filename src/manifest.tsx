// manifest.ts
import { lazy } from "react";
import { EmployeeProvider } from "./hooks/useEmployee";
import { Toaster } from "./components/ui/sonner";
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

const HRM = lazy(() => import("./App"));
const queryClient = new QueryClient();
const manifest: Manifest = {
  plugin: "care_hrm_fe",
  routes: {
    "/hrm": () => (
      <QueryClientProvider client={queryClient}>
        <EmployeeProvider>
          <>
            <HRM />
            <Toaster richColors position="top-right" />
          </>
        </EmployeeProvider>
      </QueryClientProvider>
    ),
    "/hrm/*": () => ( 
      <QueryClientProvider client={queryClient}>
        <EmployeeProvider>
          <>
            <HRM />
            <Toaster richColors position="top-right" />
          </>
        </EmployeeProvider>
      </QueryClientProvider>
    ),
  },
  extends: [],
  components: {},
};

export default manifest;
