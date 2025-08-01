import { useRoutes } from "raviger";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Employees } from "./pages/employees/employees-list";
import { Settings } from "./pages/settings";
import { Reports } from "./pages/reports";
import { EmployeeProfile } from "./pages/employees/employee-profile";
import Navbar from "./components/navbar";
import { EmployeeProvider } from "./hooks/useEmployee";
const routes = {
  "/dashboard": () => <Dashboard />,
  "/employees": () => <Employees />,
  "/employees/:id/:tab": () => <EmployeeProfile />,
  "/employees/:id": () => <EmployeeProfile />,
  "/settings": () => <Settings />,
  "/reports": () => <Reports />,
};

function App() {
  const routeResult = useRoutes(routes);

  return (
    <EmployeeProvider>
      <div className="care-hrm-container h-screen">
        <Navbar />
        <main className="h-full pt-16">
          {routeResult || <div className="p-4">Page not found</div>}
        </main>
      </div>
    </EmployeeProvider>
  );
}

export default App;
