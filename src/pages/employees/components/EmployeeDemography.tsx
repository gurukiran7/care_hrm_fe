import { useState } from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { EmployeeData } from "../EmployeeProfile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";

const InfoSection = ({
  title,
  details,
  id,
}: {
  title: string;
  details: { label: string; value: string }[];
  id: string;
}) => (
  <Card id={id} className="mb-6">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="mb-8 mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 md:gap-y-8">
        {details.map((detail, j) => (
          <div key={j}>
            <div className="text-sm text-gray-500">{detail.label}</div>
            <div className="font-semibold text-gray-900 text-sm">
              {detail.value || "-"}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const EducationCard = ({
  edu,
}: {
  edu: {
    institution: string;
    degree: string;
    specialization: string;
    start_date: string;
    end_date: string;
  };
}) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{edu.institution}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        <div>
          <div className="text-xs text-gray-500">Degree</div>
          <div className="font-medium">{edu.degree}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Specialization</div>
          <div className="font-medium">{edu.specialization}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Start Date</div>
          <div className="font-medium">{edu.start_date}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">End Date</div>
          <div className="font-medium">{edu.end_date}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const EmployeeDemography = ({
  employeeData,
}: {
  employeeData: EmployeeData;
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const generalInfo = [
    { label: "Full Name", value: employeeData.name },
    { label: "Phone Number", value: employeeData.phone_number },
    { label: "Date of Birth", value: employeeData.date_of_birth },
    { label: "Sex", value: employeeData.gender },
    { label: "Email address", value: employeeData.email },
    { label: "Current Address", value: employeeData.address },
    { label: "Permanent Address", value: employeeData.permanent_address },
    { label: "Nationality", value: employeeData.nationality },
    { label: "State", value: employeeData.state },
  ];

  const socialLinks = [
    { label: "Linkedin", value: employeeData.social_links.linkedin },
    { label: "Twitter", value: employeeData.social_links.twitter },
    { label: "Facebook", value: employeeData.social_links.facebook },
    { label: "Instagram", value: employeeData.social_links.instagram },
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-8 mt-8 w-full"
      data-testid="employee-details"
    >
      {/* Sidebar Navigation */}
      <nav className="sticky top-20 hidden lg:flex flex-col gap-2 basis-1/5">
        {[
          { id: "general-info", label: "General Info" },
          { id: "social-links", label: "Social Links" },
          { id: "educational-details", label: "Education Details" },
        ].map(({ id, label }) => (
          <button
            key={id}
            className={`rounded-lg px-4 py-2 text-left transition-colors duration-200 ${
              activeSection === id
                ? "bg-blue-50 text-blue-900 font-semibold"
                : "hover:bg-blue-50 hover:text-blue-900"
            }`}
            onClick={() => scrollToSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 flex flex-col gap-6">
        {/* Status & Type */}
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="py-4">
              <div className="text-xs text-gray-500">Employee Status</div>
              <div className="mt-1 text-sm font-semibold text-[#1E40AF] bg-[#DBEAFE] rounded-full px-2 py-1 inline-block">
                {employeeData.employee_status}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="py-4">
              <div className="text-xs text-gray-500">Employment Type</div>
              <div className="mt-1 text-sm font-semibold text-[#027A48] bg-[#ECFDF3] rounded-full px-2 py-1 inline-block">
                {employeeData.employee_type}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="py-4">
              <div className="text-xs text-gray-500">Hire Date</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {employeeData.hire_date}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-[220px]">
            <CardContent className="py-4">
              <div className="text-xs text-gray-500">Daily Working Hours</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {employeeData.daily_working_hours} hours
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Sections */}
        <InfoSection
          id="general-info"
          title="General Info"
          details={generalInfo}
        />
        <InfoSection
          id="social-links"
          title="Social Links"
          details={socialLinks}
        />

        {/* Education Section */}
        <Card id="educational-details" className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Education Details</CardTitle>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <DotsHorizontalIcon className="w-5 h-5 text-gray-500" />
            </button>
          </CardHeader>
          <CardContent>
            {employeeData.education.map((edu, idx) => (
              <EducationCard key={idx} edu={edu} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
