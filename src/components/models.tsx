



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


