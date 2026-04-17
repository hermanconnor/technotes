import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createNoteSchema,
  type CreateNoteFields,
} from "@/validation/noteSchema";
import type { User } from "@/lib/types";

interface Props {
  employees: User[];
  onAdd: (data: CreateNoteFields) => void;
  isLoading?: boolean;
}

const AddNoteDialog = ({ employees, onAdd, isLoading }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { user, roles } = useAuthStore();

  const isManagerOrAdmin = roles.some((role) =>
    ["Manager", "Admin"].includes(role),
  );

  const form = useForm<CreateNoteFields>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      text: "",
      user: isManagerOrAdmin ? "" : (user ?? ""),
    },
  });

  const onSubmit = (data: CreateNoteFields) => {
    onAdd(data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <Plus className="size-4" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <FileText className="text-primary size-5" />
            </div>
            <div>
              <DialogTitle>New Repair Note</DialogTitle>
              <DialogDescription>
                Create a new repair ticket or service note.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4 py-4">
            {/* Title Field */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    placeholder="e.g., iPhone Screen Replacement"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Note Content Field */}
            <Controller
              name="text"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="text">
                    Note Content <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="text"
                    placeholder="Describe the repair issue..."
                    className="min-h-30"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Conditional User Assignment */}
            {isManagerOrAdmin && (
              <Controller
                name="user"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="user">Assign To</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        id="user"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp._id} value={emp._id}>
                            {emp.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
