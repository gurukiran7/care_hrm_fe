import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { navigate } from "raviger";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import Loading from "../../components/Common/Loading";
import mutate from "../../Utils/request/mutate";
import query from "../../Utils/request/query";
import { GENDER_TYPES } from "../../common/constants";
import employeeApi from "../../types/employee/employeeApi";
import Page from "../../common/Page";
import { Textarea } from "../ui/textarea";
import validators from "../../Utils/validators";
import { useTranslation } from "react-i18next";
import DateField from "../ui/date-field";
import { dateQueryString } from "../../Utils/utils";

interface EmployeeFormProps {
  employeeId?: string;
}

const USER_TYPES = [
  { value: "nurse", label: "Nurse" },
  { value: "doctor", label: "Doctor" },
  { value: "staff", label: "Staff" },
  { value: "volunteer", label: "Volunteer" },
  { value: "administrator", label: "Administrator" },
];

export default function EmployeeForm(props: EmployeeFormProps) {
  const { employeeId } = props;
  const isEditMode = !!employeeId;
  const { t } = useTranslation();

  const userSchema = z
    .object({
      first_name: z.string().min(1, t("field_required")),
      last_name: z.string().min(1, t("field_required")),
      phone_number: validators().phoneNumber.required,
      prefix: z.string().max(10).optional(),
      suffix: z.string().max(50).optional(),
      user_type: z.enum([
        "doctor",
        "nurse",
        "staff",
        "volunteer",
        "administrator",
      ]),
      gender: z.enum(["male", "female", "transgender", "non_binary"]),
      geo_organization: z.string().uuid().or(z.literal("")).optional(),
      password_setup_method: z.enum(["immediate", "email"]).optional(),
      password: z.string().optional(),
      c_password: z.string().optional(),
      username: z
        .string()
        .min(4, t("field_required"))
        .max(16, t("username_not_valid"))
        .regex(/^[a-z0-9_-]*$/, t("username_not_valid"))
        .regex(/^[a-z0-9].*[a-z0-9]$/, t("username_not_valid"))
        .refine((val) => !val.match(/(?:[_-]{2,})/), t("username_not_valid")),
      email: isEditMode
        ? z.string().optional()
        : z.string().email(t("invalid_email_address")),
      is_active: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (!isEditMode && data.password_setup_method === "immediate") {
          return !!data.password;
        }
        return true;
      },
      {
        message: t("password_required"),
        path: ["password"],
      }
    )
    .refine(
      (data) => {
        if (
          !isEditMode &&
          data.password_setup_method === "immediate" &&
          data.password
        ) {
          return data.password === data.c_password;
        }
        return true;
      },
      {
        message: t("password_mismatch"),
        path: ["c_password"],
      }
    )
    .refine(
      (data) => {
        if (
          !isEditMode &&
          data.password_setup_method === "immediate" &&
          data.password
        ) {
          return (
            data.password.length >= 8 &&
            /[a-z]/.test(data.password) &&
            /[A-Z]/.test(data.password) &&
            /[0-9]/.test(data.password)
          );
        }
        return true;
      },
      {
        message: t("new_password_validation"),
        path: ["password"],
      }
    );

  const employeeSchema = z.object({
    education: z.string().optional(),
    hire_date: z.string().nonempty("Hire date is required"),
    address: isEditMode
      ? z.string().trim().optional()
      : z.string().trim().nonempty(t("address_is_required")),
    pincode: isEditMode
      ? validators().pincode.optional()
      : validators().pincode,
  });

  const employeeFormSchema = useMemo(
    () =>
      z.object({
        user: userSchema,
        ...employeeSchema.shape,
      }),
    [isEditMode]
  );

  const form = useForm({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      user: {
        first_name: "",
        last_name: "",
        phone_number: "",
        prefix: "",
        suffix: "",
        user_type: "nurse",
        geo_organization: "",
        password: "",
        c_password: "",
        password_setup_method: "immediate",
        username: "",
        email: "",
        is_active: true,
      },
      hire_date: "",
      address: "",
      education: "",
    },
    mode: "onSubmit",
  });
  const employeeQuery = useQuery<any>({
    queryKey: ["employee", employeeId],
    queryFn: query(employeeApi.getEmployee, {
      pathParams: { id: employeeId || "" },
    }),
    enabled: !!employeeId,
  });

  useEffect(() => {
    if (employeeQuery.data && employeeQuery.data.user) {
      form.reset({
        user: {
          first_name: employeeQuery.data.user?.first_name || "",
          last_name: employeeQuery.data.user?.last_name || "",
          phone_number: employeeQuery.data.user?.phone_number || "",
          prefix: employeeQuery.data.user?.prefix || "",
          suffix: employeeQuery.data.user?.suffix || "",
          user_type: employeeQuery.data.user?.user_type || "nurse",
          gender: employeeQuery.data.user?.gender,
          geo_organization:
            employeeQuery.data.user?.geo_organization || undefined,
          password: "",
          c_password: "",
          password_setup_method:
            employeeQuery.data.user?.password_setup_method || "immediate",
          username: employeeQuery.data.user?.username || "",
          email: employeeQuery.data.user?.email || "",
        },
        education: employeeQuery.data.educations || "",
        hire_date: employeeQuery.data.hire_date || undefined,
        address: employeeQuery.data.address || "",
        pincode: employeeQuery.data.pincode,
      });
    }
  }, [employeeQuery.data]);

  const { mutate: createEmployee, isPending: isCreatingEmployee } = useMutation(
    {
      mutationKey: ["create_employee"],
      mutationFn: mutate(employeeApi.addEmployee),
      onSuccess: () => {
        toast.success("Employee created successfully");
        navigate("/employees");
      },
      onError: () => {
        toast.error("Failed to create employee");
      },
    }
  );

  const { mutate: updateEmployee, isPending: isUpdatingEmployee } = useMutation(
    {
      mutationFn: mutate(employeeApi.updateEmployee, {
        pathParams: { id: employeeId || "" },
      }),
      onSuccess: () => {
        toast.success("Employee updated successfully");
        navigate("/hrm/employees/" + employeeId);
      },
      onError: () => {
        toast.error("Failed to update employee");
      },
    }
  );

  function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    if (!values.user.geo_organization) {
      delete values.user.geo_organization;
    }
    if (isEditMode && !values.user.password) {
      const { password, c_password, ...userRest } = values.user;
      updateEmployee({ ...values, user: userRest });
    } else if (isEditMode) {
      updateEmployee(values);
    } else {
      createEmployee(values);
    }
  }

  if (employeeId && employeeQuery.isLoading) {
    return <Loading />;
  }

  const title = !employeeId ? "Add Employee" : "Update Employee";


  return (
    <Page title={title}>
      <hr className="mt-4 border-gray-200" />
      <div className="relative mt-4 flex flex-col md:flex-row gap-4">

        <Form {...form}>
          <form
            className="md:w-[500px] space-y-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div id="user-info" className="space-y-6">
              <FormField
                control={form.control}
                name="user.first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        {...field}
                        maxLength={14}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefix</FormLabel>
                    <FormControl>
                      <Input placeholder="Prefix" {...field} maxLength={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suffix</FormLabel>
                    <FormControl>
                      <Input placeholder="Suffix" {...field} maxLength={50} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.user_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_TYPES.map((ut) => (
                          <SelectItem key={ut.value} value={ut.value}>
                            {ut.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_TYPES.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user.geo_organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geo Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Geo Organization UUID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!isEditMode && (
                <>
                  <FormField
                    control={form.control}
                    name="user.username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user.password_setup_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Setup Method</FormLabel>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">
                              Set Password Now
                            </SelectItem>
                            <SelectItem value="email">
                              Send Email Invitation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("user.password_setup_method") === "immediate" && (
                    <>
                      <FormField
                        control={form.control}
                        name="user.password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Password <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="user.c_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </>
              )}
            </div>
            <div id="employee-details" className="space-y-6">
              <div>
                
                <FormField
                  control={form.control}
                  name="hire_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hire date</FormLabel>
                      <FormControl>
                        <DateField
                          date={
                            field.value
                              ? typeof field.value === "string"
                                ? new Date(field.value)
                                : field.value
                              : undefined
                          }
                          onChange={(date) =>
                            field.onChange(dateQueryString(date))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Educations</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter education details "
                        data-cy="educations-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address fields */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-cy="address-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            ? Number(e.target.value)
                            : undefined;
                          field.onChange(value);
                        }}
                        value={field.value || undefined}
                        data-cy="pincode-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate("/employees")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isCreatingEmployee || isUpdatingEmployee}
              >
                {employeeId ? "Save" : "Save and Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Page>
  );
}
