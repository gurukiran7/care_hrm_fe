import { useTranslation } from "react-i18next";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import type { Employee, Skill } from "../../types/employee/employee";

const LabelValue = ({
  label,
  value,
  id,
}: {
  label: string;
  value?: string | number | null;
  id?: string;
}) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm text-gray-500">{label}</p>
    <span id={`view-${id}`} className="text-sm truncate max-w-fit">
      {value ?? "-"}
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
    <span className={`inline-flex items-center rounded-full text-base font-semibold ${textColor} ${className}`}>
      {text}
    </span>
  </div>
);

// small helper
const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString() : "-";

export const BasicInfoDetails = ({ user }: { user: Employee["user"] }) => {
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
        <LabelValue id="dob" label={t("date_of_birth")} value={formatDate(user.date_of_birth ?? null)} />
      </div>
    </div>
  );
};

export const ContactInfoDetails = ({ user }: { user: Employee["user"] }) => {
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

export const EmploymentDetails = ({ employee }: { employee: Employee & { address?: string; pincode?: number } }) => {
  const { t } = useTranslation();
  const u = employee.user;

  return (
    <div className="pt-2 pb-5">
      <Badge text={t("employment_details")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="user_type" label={t("user_type")} value={u.user_type} />
        <LabelValue id="hire_date" label={t("hire_date")} value={formatDate(employee.hire_date)} />
        <LabelValue
          id="weekly_working_hours"
          label={t("weekly_working_hours")}
          value={u.weekly_working_hours ?? "-"}
        />
        <LabelValue id="qualification" label={t("qualification")} value={u.qualification ?? "-"} />
      </div>
    </div>
  );
};

export const AddressDetails = ({
  address,
  pincode,
}: {
  address?: string;
  pincode?: number;
}) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("address")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabelValue id="address" label={t("address")} value={address || "-"} />
        <LabelValue id="pincode" label={t("pincode")} value={pincode ?? "-"} />
      </div>
    </div>
  );
};

export const SkillsDetails = ({ skills }: { skills: Skill[] }) => {
  const { t } = useTranslation();
  return (
    <div className="pt-2 pb-5">
      <Badge text={t("skills")} />
      {skills?.length ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.id}
              className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200"
              title={s.description}
            >
              {s.name}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-600">{t("no_skills_added")}</div>
      )}
    </div>
  );
};
