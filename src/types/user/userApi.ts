import { Type } from "../../Utils/request/api";
import type { AuthUserModel } from "./user";

export default {
    deleteProfilePicture: {
        path: "/api/v1/users/{username}/profile_picture/",
        method: "DELETE" as const,
        TRes: Type<AuthUserModel>(),
        TBody: Type<void>(),
      },
}