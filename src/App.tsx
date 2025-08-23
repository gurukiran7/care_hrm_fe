import { useRoutes } from "raviger";
import { Dashboard } from "./pages/dashboard";
import { Employees } from "./pages/employees";
import { LeaveTypesSettings } from "./pages/leave-settings";
import { AppSidebar } from "./components/ui/sidebar/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import useSidebarState from "./hooks/useSidebarState";
import EmployeeHome from "./components/employee/EmployeeHome";
import EmployeeForm from "./components/employee/EmployeeForm";
import LeaveTypesIndex from "./pages/leave-settings/leave-types/LeaveTypes";
import HolidaysIndex from "./pages/leave-settings/holidays/holidays";
const routes = {
  "/dashboard": (_params: {}) => <Dashboard />,
  "/employees": (_params: {}) => <Employees />,
  "/employees/:id/:tab": (params: { id: string; tab: string }) => (
    <EmployeeHome id={params.id} tab={params.tab} />
  ),
  "/employees/:id": (params: { id: string }) => (
    <EmployeeHome id={params.id} tab="profile" />
  ),
  "/settings": (_params: {}) => <LeaveTypesSettings />,
  "/hrm/employees/create": (_params: {}) => <EmployeeForm />,
  "/": (_params: {}) => <Dashboard />,
  "/hrm/employees/:id/edit": (params: { id: string }) => (
    <EmployeeForm employeeId={params.id} />
  ),
  "/settings/leave-types":()=><LeaveTypesIndex/>,
  "/settings/holidays":()=><HolidaysIndex/>,
};

function App() {
  const routeResult = useRoutes(routes, { basePath: "/hrm" });
  const sidebarOpen = useSidebarState();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex h-full min-h-screen w-full bg-gray-50">
        <AppSidebar />

        {routeResult || <div className="">Page not found</div>}
      </div>
    </SidebarProvider>
  );
}

export default App;
