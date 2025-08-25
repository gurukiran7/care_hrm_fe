import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

import {
  CardGridSkeleton,
  TableSkeleton,
} from "../../components/Common/SkeletonLoading";

import query from "../../Utils/request/query";

import employeeApi from "../../types/employee/employeeApi";
import Page from "../../common/Page";
import SearchInput from "../../components/Common/SearchInput";
import useFilters from "../../hooks/useFilters";
import { useView } from "../../Utils/useView";
import EmployeeListAndCardView from "../../components/employee/EmployeeListAndCard";

export function Employees() {
  const { t } = useTranslation();
  const { qParams, updateQuery, Pagination, resultsPerPage } = useFilters({
    limit: 15,
    disableCache: true,
  });
  const [activeTab, setActiveTab] = useView("employees", "card");

  const { data: employeeListData, isFetching: employeeListFetching } = useQuery(
    {
      queryKey: ["employees", qParams, resultsPerPage],
      queryFn: query.debounced(employeeApi.listEmployees, {
        queryParams: {
          first_name: qParams.first_name,
          limit: resultsPerPage,
          offset: (qParams.page - 1) * resultsPerPage,
        },
      }),
    }
  );

  let employeesList: React.ReactNode = <></>;

  if (employeeListFetching || !employeeListData) {
    employeesList =
      activeTab === "card" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <CardGridSkeleton count={6} />
        </div>
      ) : (
        <TableSkeleton count={7} />
      );
  } else {
    employeesList = (
      <div>
        <EmployeeListAndCardView
          employees={employeeListData?.results ?? []}
          activeTab={activeTab === "card" ? "card" : "list"}
        />
        <Pagination totalCount={employeeListData.count} />
      </div>
    );
  }

  return (
    <Page
      title={t("employees_management", {defaultValue: "Employees Management"})}
      componentRight={
        <Badge
          className="bg-purple-50 text-purple-700 ml-2 text-sm font-medium rounded-xl px-3 m-3 w-max"
          variant="outline"
        >
          {employeeListFetching
            ? t("loading")
            : t("entity_count", {
                count: employeeListData?.count ?? 0,
                entity: t("employee"),
              })}
        </Badge>
      }
    >
      <hr className="mt-4 border-gray-200" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 m-5 ml-0">
        <SearchInput
          options={[
            {
              key: "first_name",
              type: "text",
              placeholder: t("search_by_name"),
              value: qParams.name || "",
              display: t("name"),
            },
          ]}
          onSearch={(key, value) =>
            updateQuery({
              [key]: value || undefined,
            })
          }
          className="w-full max-w-sm"
        />
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "card" | "list")}
        >
          <TabsList className="flex">
            <TabsTrigger value="card" id="employee-card-view">
              <span>{t("card")}</span>
            </TabsTrigger>
            <TabsTrigger value="list" id="employee-list-view">
              <span>{t("list")}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="overflow-x-auto overflow-y-hidden">{employeesList}</div>
    </Page>
  );
}
