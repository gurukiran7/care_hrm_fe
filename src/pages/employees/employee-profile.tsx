import { Avatar } from "../../components/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { TrashIcon } from "@radix-ui/react-icons";
import { EmployeeDemography } from "./components/employee_demography";
import { EmployeeLeaves } from "./components/leaves_tab";
import { Pencil } from "lucide-react";
import { Button } from "../../components/ui/button";

export type EmployeeData = {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  gender: string;
  department: string;
  hire_date: string;
  daily_working_hours: string;
  designation: string;
  address: string;
  permanent_address: string;
  nationality: string;
  state: string;
  emergency_contact: {
    name: string;
    number: string;
  };
  joining_date: string;
  employee_status: string;
  employee_type: string;
  social_links: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  education: {
    institution: string;
    degree: string;
    specialization: string;
    start_date: string;
    end_date: string;
  }[];
};

const employeeData: EmployeeData = {
  id: "EMP12345",
  name: "Karan ",
  phone_number: "9876543210",
  email: "john12@gmail.com",
  date_of_birth: "1960-05-11",
  gender: "Male",
  department: "IT",
  hire_date: "2022-04-02",
  daily_working_hours: "8",
  designation: "Software Engineer",
  address:
      "House No. 32, Hostel Zone, Bone Avenue, karnataka, PIN: 695014",
    permanent_address:
      "",
    nationality: "Indian",
  state: "Karnataka",
  emergency_contact: {
    name: "Jane Doe",
    number: "9812345678",
  },
  joining_date: "2022-04-02",
  employee_status: "Active",
  employee_type: "full time",
  social_links: {
    linkedin: "www.linkedin.com",
    twitter: "www.twitter.com",
    facebook: "www.facebook.com",
    instagram: "www.instagram.com",
  },
  education: [
    {
      institution: "University of Kerala",
      degree: "Bachelor's",
      specialization: "Computer Science",
      start_date: "June 5, 2020",
      end_date: "April 4, 2024",
    },
  ],
};

export function EmployeeProfile() {
  const employee = employeeData;

  const handleDeleteClick = () => {
    alert("Delete Profile clicked");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              className="size-14 md:size-20 font-semibold text-secondary-800"
              name={employee.name}
              imageUrl="/profile.png"
            />
            <div>
              <CardTitle className="capitalize text-6xl">
                {employee.name}
              </CardTitle>
              <CardDescription className="capitalize">
                {employee.designation}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="p-2 gap-1 flex">
              Edit <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              className="gap-1 flex"
              data-cy="delete-employee-button"
              onClick={handleDeleteClick}
            >
              <TrashIcon className="w-3 h-3" />
              <span className="hidden md:inline">Delete</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="leaves">Leaves</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <ScrollArea className="h-auto pr-4">
                <EmployeeDemography employeeData={employee} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="leaves">
              <ScrollArea className="h-auto pr-4">
                <EmployeeLeaves />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="documents">
              <ScrollArea className="h-auto pr-4">
                <div>Documents Content</div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
