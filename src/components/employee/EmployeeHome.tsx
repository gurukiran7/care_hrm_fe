import { useQuery } from "@tanstack/react-query";
import { Link } from "raviger";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils";
import Loading from "../../components/Common/Loading";

import query from "../../Utils/request/query";
import employeeApi from "../../types/employee/employeeApi";
import useAppHistory from "../../hooks/useAppHistory";
import EmployeeBanner from "./EmployeeBanner";
import { formatName, keysOf } from "../../Utils/utils";
import Page from "../../common/Page";
import ErrorPage from "../ErrorPages/DefaultErrorPage";
import EmployeeSummaryTab from "./EmployeeSummary";
import { LeavesTab } from "./LeavesTab";
import { DocumentsTab } from "./DocumentsTab";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/user-atom";
import { HRRoles } from "../../common/constants";

export interface EmployeeHomeProps {
  id?: string;
  tab: string;
}

export interface TabChildProp {
  body: (props: any) => React.ReactNode | undefined;
  hidden?: boolean;
}

export default function EmployeeHome(props: EmployeeHomeProps) {
  const { tab, id } = props;
  const { t } = useTranslation();
  const { goBack } = useAppHistory();

  const user = useAtomValue(authUserAtom);
  const canEdit =
    user &&
    (("user_type" in user &&
      HRRoles.includes((user.user_type || "").toLowerCase())) ||
      ("is_superuser" in user && user.is_superuser));

  const {
    data: employeeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getEmployeeDetails", id],
    queryFn: id
      ? query(employeeApi.getEmployee, { pathParams: { id } })
      : () => Promise.resolve(null),
    enabled: !!id,
  });

  if (isError) {
    goBack("/employees");
  }

  if (isLoading || !employeeData) {
    return <Loading />;
  }

  const TABS = {
    PROFILE: {
      body: EmployeeSummaryTab,
      hidden: false,
    },
    LEAVES: {
      body: (props: any) => (
        <LeavesTab employeeData={props.employeeData} canEdit={canEdit} />
      ),
      hidden: false,
    },
    DOCS: {
      body: (props: any) => (
        <DocumentsTab employeeId={props.employeeData.id} canEdit={canEdit} />
      ),
      hidden: false,
    },
  } satisfies Record<string, TabChildProp>;

  const normalizedTab = tab.toUpperCase();
  const isValidTab = (tab: string): tab is keyof typeof TABS =>
    Object.keys(TABS).includes(tab as keyof typeof TABS);
  const currentTab = isValidTab(normalizedTab) ? normalizedTab : undefined;

  if (!currentTab) {
    return <ErrorPage />;
  }

  const SelectedTab = TABS[currentTab].body;
  const employeeUrl = `/employees/${id}`;

  return (
    <Page
      title={formatName(employeeData.user) || t("manage_employee")}
      hideTitleOnPage
      className="w-full"
    >
      <EmployeeBanner employeeData={employeeData} />
      <div className="mt-4 w-full border-b-2 border-secondary-200">
        <div className="overflow-x-auto sm:flex sm:items-baseline">
          <div className="mt-4 sm:mt-0">
            <nav
              className="flex space-x-6 overflow-x-auto"
              id="employeemanagement_tab_nav"
            >
              {keysOf(TABS)
                .filter((p) => !TABS[p].hidden)
                .map((p) => (
                  <Link
                    key={p}
                    href={`${employeeUrl}/${p.toLocaleLowerCase()}`}
                    className={cn(
                      "min-w-max-content cursor-pointer whitespace-nowrap text-sm font-semibold capitalize",
                      currentTab === p
                        ? "border-b-2 border-primary-500 text-primary-600 hover:border-secondary-300"
                        : "text-secondary-700 hover:text-secondary-700"
                    )}
                  >
                    <div className="px-3 py-1.5" id={p.toLowerCase()}>
                      {p === "PROFILE"
                        ? t("employee__tab_profile", { defaultValue: "Profile" })
                        : p === "LEAVES"
                        ? t("employee__tab_leaves", { defaultValue: "Leaves" })
                        : p === "DOCS"
                        ? t("employee__tab_documents", { defaultValue: "Documents" })
                        : p}
                    </div>
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </div>
      <SelectedTab employeeData={employeeData} />
    </Page>
  );
}
