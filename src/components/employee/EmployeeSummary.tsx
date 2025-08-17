import { useTranslation } from "react-i18next";
import CareIcon from "../../CAREUI/icons/CareIcon";
import { Button } from "../ui/button";
import EmployeeAvatar from "./EmployeeAvatar";
import EmployeeColumns, { type EmployeeChildProps } from "./EmployeeColumns";
import {
  BasicInfoDetails,
  ContactInfoDetails,
  EmploymentDetails,
  AddressDetails,
  EducationDetails,
} from "./EmployeeViewDetails";
import { HRRoles } from "../../common/constants";
import { navigate } from "raviger";
import { useAtomValue } from "jotai";
import { authUserAtom } from "../../state/user-atom";
import { useCurrentEmployee } from "../../hooks/useEmployee";

export default function EmployeeSummaryTab({
  employeeData,
}: {
  employeeData: any;
}) {
  const { t } = useTranslation();
  const authUser = useAtomValue(authUserAtom);
  const user = employeeData.user || authUser;
  const canEditEmployee =
  authUser &&
  (HRRoles.includes((authUser.user_type || "").toLowerCase()) ||
    authUser.is_superuser);

  const {employee } = useCurrentEmployee();

  const columnsData: EmployeeChildProps = {
    employeeData,
    id: employeeData.id,
    permissions: undefined,
  };

  const renderBasicInfo = () => (
    <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
      <BasicInfoDetails user={user} />
    </div>
  );

  const renderContactInfo = () => (
    <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
      <ContactInfoDetails user={user} />
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
      <EmploymentDetails employee={employeeData} />
    </div>
  );

  const renderAddressDetails = () => (
    <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
      <AddressDetails address={employeeData.address} />
    </div>
  );

  const renderEducationDetails = () => (
    <div className="overflow-visible px-4 py-5 sm:px-6 rounded-lg shadow-sm sm:rounded-lg bg-white">
      <EducationDetails educations={employeeData.education || ""} />
    </div>
  );

  return (
    <div>
      <div className="mt-10 flex flex-col gap-y-6">
        {canEditEmployee && (
          <Button
            variant="outline"
            className="w-fit self-end"
            data-cy="edit-employee-button"
            onClick={() => navigate(`/hrm/hrm/employees/${employeeData.id}/edit`)}
          >
            <CareIcon icon="l-pen" className="mr-2 size-4" />
            {t("edit_employee")}
          </Button>
        )}
        {(canEditEmployee || employeeData.id == employee?.id) && (
          <EmployeeColumns
            heading={t("edit_avatar")}
            note={t("personal_information_note")}
            Child={({ id }) => <EmployeeAvatar employeeId={id} />}
            childProps={columnsData}
          />
        )}

        <EmployeeColumns
          heading={t("personal_information")}
          note={t("personal_information_note")}
          Child={renderBasicInfo}
          childProps={columnsData}
        />
        <EmployeeColumns
          heading={t("contact_info")}
          note={t("contact_info_note")}
          Child={renderContactInfo}
          childProps={columnsData}
        />
        <EmployeeColumns
          heading={t("employment_details")}
          note={t("employment_details_note")}
          Child={renderEmploymentDetails}
          childProps={columnsData}
        />
        <EmployeeColumns
          heading={t("address_information")}
          note={t("address_information_note")}
          Child={renderAddressDetails}
          childProps={columnsData}
        />
        <EmployeeColumns
          heading={t("education_information")}
          note={t("education_information_note")}
          Child={renderEducationDetails}
          childProps={columnsData}
        />
      </div>
    </div>
  );
}
