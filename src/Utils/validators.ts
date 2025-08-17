import { t } from "i18next";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

export default () => ({
  phoneNumber: {
    optional: z
      .string()
      .optional()
      .refine((val) => !val || isValidPhoneNumber(val), {
        message: t("phone_number_validation_error"),
      }),

    required: z
      .string()
      .min(1, { message: t("field_required") })
      .refine((val) => isValidPhoneNumber(val), {
        message: t("phone_number_validation_error"),
      }),
  },

  pincode: z
    .number()
    .int()
    .positive()
    .min(100000, t("pincode_must_be_6_digits"))
    .max(999999, t("pincode_must_be_6_digits")),
});
