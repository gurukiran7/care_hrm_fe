import { t } from "i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FilesPage } from "../Files/FileSubTab";


interface EmployeeDocumentsTabProps {
  employeeId: string;
  canEdit?: boolean;
}

export const DocumentsTab = ({
  employeeId,
  canEdit,
}: EmployeeDocumentsTabProps) => {
  const tabValue = "documents";

  return (
    <div className="space-y-4">
      <Tabs value={tabValue} onValueChange={() => {}}>
        <TabsList className="mt-2">
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-white rounded-md px-4 font-semibold"
          >
            {t("documents")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="documents">
          <FilesPage
            type="employee"
            associatingId={employeeId}
            canEdit={canEdit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};