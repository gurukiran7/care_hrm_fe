import type { GENDER_TYPES } from "../../common/constants";
import type { UserType } from "../user/user";


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
}

export interface Employee {
  id: string;
  user: EmployeeReadMinimal;
  hire_date: string;
  is_on_leave?: boolean;
}

export interface EmployeeCreate {
  user: UserBase;
  hire_date: string;
  address?: string;
  education?: string;
  pincode?: number;
}

  export interface EmployeeUpdate {
    user: {
      first_name: string;
      last_name: string;
      phone_number: string;
      user_type: UserType;
      gender: string;
      username: string;
      email?: string;
      prefix?: string;
      suffix?: string;
      geo_organization?: string;
      password?: string;
    };
    education?:  string;
    hire_date?: string;
    address?: string;
    pincode?:number;
  }

export interface EmployeeReadMinimal extends UserBase {
  last_login: string;
  profile_picture_url: string;
  mfa_enabled: boolean;
  deleted: boolean;
}