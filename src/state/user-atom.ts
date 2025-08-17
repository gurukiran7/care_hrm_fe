
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { UserBase } from "../types/employee/employee";

export const authUserAtom = atomWithStorage<UserBase | undefined>(
  "care-auth-user",
  undefined,
  createJSONStorage(() => sessionStorage)
);