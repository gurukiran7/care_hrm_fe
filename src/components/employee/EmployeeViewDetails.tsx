import { useTranslation } from "react-i18next";
import { formatPhoneNumberIntl } from "react-phone-number-input";

const LabelValue = ({
  label,
  value,
  id,
}: {
  label: string;
  value?: string | null;
  id?: string;
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-gray-500">{label}</p>
    <span id={`view-${id}`} className="text-sm truncate max-w-fit">
      {value || "-"}
    </span>
  </div>
);

const Badge = ({
  text,
  textColor = "text-black",
  className = "",
}: {
  text: string;
  textColor?: string;
  className?: string;
}) => (
  <div className="relative mb-4">
    <div className="mt-1 h-1 w-6 bg-blue-600 mb-1" />
    <span
      className={`
        inline-flex items-center rounded-full text-base font-semibold
        ${textColor} ${className}
      `}
    >
      {text}
    </span>
  </div>
);

export const BasicInfoDetails = ({ user }: { user: any }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("basic_info")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="username" label={t("username")} value={user.username} />
        <LabelValue id="prefix" label={t("prefix")} value={user.prefix || "-"} />
        <LabelValue id="first_name" label={t("first_name")} value={user.first_name} />
        <LabelValue id="last_name" label={t("last_name")} value={user.last_name} />
        <LabelValue id="suffix" label={t("suffix")} value={user.suffix || "-"} />
        <LabelValue id="gender" label={t("gender")} value={user.gender} />
      </div>
    </div>
  );
};

export const ContactInfoDetails = ({ user }: { user: any }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("contact_info")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="email" label={t("email")} value={user.email} />
        <LabelValue
          id="phone_number"
          label={t("phone_number")}
          value={user.phone_number && formatPhoneNumberIntl(user.phone_number)}
        />
      </div>
    </div>
  );
};

export const EmploymentDetails = ({ employee }: { employee: any }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("employment_details")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="hire_date" label={t("hire_date")} value={employee.hire_date} />
        <LabelValue id="department" label={t("department")} value={employee.user.department} />
        <LabelValue id="role" label={t("role")} value={employee.user.role} />
      </div>
    </div>
  );
};

export const AddressDetails = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("address")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue
          id="address"
          label={t("address")}
          value={address || "-"}
        />
      </div>
    </div>
  );
};

export const EducationDetails = ({ educations }: { educations: string }) => {
  const { t } = useTranslation();
  const eduStr = typeof educations === "string" ? educations : "";

  return (
    <div className="pt-2 pb-5">
      <Badge text={t("education")} />
      <div>
        {eduStr.trim().length > 0
          ? <span>{eduStr}</span>
          : <div>{t("no_education_details")}</div>
        }
      </div>
    </div>
  );
};