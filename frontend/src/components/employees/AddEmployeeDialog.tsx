import { useState } from "react";
import { Plus, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useCreateUser } from "@/hooks/useCreateUser";
import {
  createUserSchema,
  type CreateUserFields,
} from "@/validation/userSchema";
import type { UserRole } from "@/lib/types";
import { ROLES } from "@/lib/constants";

const AddEmployeeDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: createUser, isPending } = useCreateUser();

  const form = useForm<CreateUserFields>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      roles: ["Employee"],
      active: true,
    },
  });

  const onSubmit = (data: CreateUserFields) => {
    createUser(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <Plus className="size-4" />
          Add Employee
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Create a new employee account. Credentials will be required for
              login.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Username */}
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    id="username"
                    {...field}
                    placeholder="jsmith"
                    disabled={isPending}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      disabled={isPending}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Roles */}
            <Controller
              name="roles"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-3">
                  <FieldLabel>Assigned Roles</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {ROLES.map((role) => (
                      <div key={role} className="flex items-center gap-2">
                        <Checkbox
                          id={`new-role-${role}`}
                          checked={field.value?.includes(role as UserRole)}
                          disabled={isPending}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...field.value, role]
                              : field.value.filter((r) => r !== role);
                            field.onChange(updated);
                          }}
                        />
                        <Label
                          htmlFor={`new-role-${role}`}
                          className="font-normal"
                        >
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Employee
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
