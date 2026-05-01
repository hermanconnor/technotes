import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Trash2, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import {
  updateNoteSchema,
  type UpdateNoteFields,
} from "@/validation/noteSchema";
import { useAuthStore } from "@/store/useAuthStore";
import type { Note, User } from "@/lib/types";
import { useUpdateNote } from "@/hooks/useUpdateNote";
import { useDeleteNote } from "@/hooks/useDeleteNote";
import { formatDate } from "@/utils";

interface Props {
  note: Note;
  employees: User[];
}

const EditNoteDialog = ({ note, employees }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { mutate: updateNote, isPending } = useUpdateNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();
  const { roles } = useAuthStore();

  const isManagerOrAdmin = roles.some((role) =>
    ["Manager", "Admin"].includes(role),
  );

  const isBusy = isPending || isDeleting;

  const form = useForm<UpdateNoteFields>({
    resolver: zodResolver(updateNoteSchema),
    values: {
      user: note.user._id,
      title: note.title,
      text: note.text,
      completed: note.completed,
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = (data: UpdateNoteFields) => {
    updateNote(
      { ...data, id: note._id },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteNote(note._id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
          <Pencil className="size-4" />
          <span className="sr-only">Edit note</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <FileText className="text-primary size-5" />
            </div>
            <div>
              <DialogTitle>Edit Repair Note</DialogTitle>
              <DialogDescription>
                Update the repair ticket or service note details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4 py-4">
            {/* Status Toggle */}
            <Controller
              name="completed"
              control={form.control}
              render={({ field }) => (
                <div className="border-border flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FieldLabel className="text-base">
                      Mark as Completed
                    </FieldLabel>
                    <p className="text-muted-foreground text-xs">
                      {field.value ? "Repair finished" : "Repair in progress"}
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isBusy}
                    className="cursor-pointer"
                  />
                </div>
              )}
            />

            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input {...field} disabled={isBusy} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Text Content */}
            <Controller
              name="text"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Note Content</FieldLabel>
                  <Textarea {...field} className="min-h-30" disabled={isBusy} />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Assignment (Manager/Admin Only) */}
            {isManagerOrAdmin && (
              <Controller
                name="user"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Assign To</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isBusy}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp._id} value={emp._id}>
                            {emp.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            )}

            {/* Timestamps */}
            <div className="bg-muted/50 text-muted-foreground rounded-lg p-3 text-[11px] tracking-wider uppercase">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{formatDate(note.createdAt)}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span>Updated</span>
                <span>{formatDate(note.updatedAt)}</span>
              </div>
            </div>
          </FieldGroup>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full cursor-pointer sm:mr-auto sm:w-auto"
                  disabled={isBusy}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Note
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Permanently delete "{note.title}"? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={isBusy}
                    className="cursor-pointer"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                    disabled={isBusy}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="flex-1 cursor-pointer sm:flex-none"
                onClick={() => handleOpenChange(false)}
                disabled={isBusy}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer sm:flex-none"
                disabled={isBusy}
              >
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
