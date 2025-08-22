import type { GENDER_TYPES } from "../../common/constants";
import type { UserType } from "../user/user";

export interface Skill {
  external_id: string;
  name: string;
  description: string;
}

export interface UserBase {
  id?: string;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  prefix?: string | null;
  suffix?: string | null;
  user_type: UserType;
  gender: (typeof GENDER_TYPES)[number]["id"];
  is_superuser?: boolean;
  email?: string;
  geo_organization?: string;
  password?: string;
  date_of_birth?: string;
  weekly_working_hours?: number;
  qualification?: string;
}

export interface Employee {
  id: string;
  user: EmployeeRead;
  hire_date: string;
  is_on_leave?: boolean;
}

export interface EmployeeCreate {
  user: UserBase & {
    skills?: string[];
  };
  hire_date: string;
  address?: string;
  pincode?: number;
}

export interface EmployeeUpdate {
  user?: Partial<
    UserBase & {
      skills?: string[];
    }
  >;
  education?: string;
  hire_date?: string;
  pincode?: number;
}

export interface EmployeeRead extends UserBase {
  last_login: string | null;
  profile_picture_url?: string ;
  mfa_enabled: boolean;
  deleted: boolean;
  skills: Skill[];
}

export interface EmployeeReadMinimal extends UserBase {
  last_login: string;
  profile_picture_url: string;
  mfa_enabled: boolean;
  deleted: boolean;
}
