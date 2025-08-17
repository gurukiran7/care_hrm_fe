
import type { GENDER_TYPES } from "../../common/constants";


export type UserType =
  | "doctor"
  | "nurse"
  | "staff"
  | "volunteer"
  | "administrator";

export type UpdatePasswordForm = {
  old_password: string;
  username: string;
  new_password: string;
};

export type UserBareMinimum = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserType;
  last_login: string | undefined;
  profile_picture_url?: string;
  external_id: string;
  prefix: string | null;
  suffix: string | null;
};

export type UserFacilityModel = {
  id: string;
  name: string;
};
export interface OrganizationParent {
  id: string;
  name: string;
  description?: string;
  metadata: Metadata | null;
  org_type: org_type;
  level_cache: number;
  parent?: OrganizationParent;
}

type org_type =
  | "team"
  | "govt"
  | "role"
  | "product_supplier"
  | "other"
  | "product_supplier";


export type Metadata = {
  govt_org_children_type?: string;
  govt_org_type?: string;
};

export interface Organization {
  id: string;
  name: string;
  description?: string;
  org_type: org_type;
  level_cache: number;
  has_children: boolean;
  active: boolean;
  parent?: OrganizationParent;
  created_at: string;
  updated_at: string;
  metadata: Metadata | null;
  permissions: string[];
}


export type AuthUserModel = UserBareMinimum & {
  external_id: string;
  phone_number?: string;
  alt_phone_number?: string;
  gender?:  (typeof GENDER_TYPES)[number]["id"];
  date_of_birth: Date | null | string;
  is_superuser?: boolean;
  verified?: boolean;
  facilities?: UserFacilityModel[];
  organizations?: Organization[];
  permissions: string[];
  mfa_enabled?: boolean;
  deleted: boolean;
};
