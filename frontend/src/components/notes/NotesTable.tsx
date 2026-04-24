import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Note, User } from "@/lib/types";
import { formatDate } from "@/utils";

interface Props {
  notes: Note[];
  users: User[] | undefined;
  isLoading: boolean;
}

const NotesTable = ({ notes, users, isLoading }: Props) => {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-30">Status</TableHead>
            <TableHead className="hidden w-30 md:table-cell">Created</TableHead>
            <TableHead className="hidden w-30 md:table-cell">Updated</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-37.5">Owner</TableHead>
            <TableHead className="w-20 text-right">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                Loading notes...
              </TableCell>
            </TableRow>
          ) : notes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-muted-foreground h-32 text-center"
              >
                No notes match your criteria.
              </TableCell>
            </TableRow>
          ) : (
            notes.map((note) => (
              <TableRow key={note._id}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      note.completed
                        ? "border-green-500/50 bg-green-500/5 text-green-500"
                        : "border-amber-500/50 bg-amber-500/5 text-amber-500"
                    }
                  >
                    {note.completed ? "Done" : "Open"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {formatDate(note.createdAt)}
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {formatDate(note.updatedAt)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-foreground font-medium">{note.title}</p>
                    <p className="text-muted-foreground line-clamp-1 max-w-md text-sm">
                      {note.text}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {note.username}
                </TableCell>
                <TableCell className="text-right">
                  <EditNoteDialog
                    note={note}
                    employees={users ?? []}
                    onSave={handleSaveNote}
                    onDelete={handleDeleteNote}
                    trigger={
                      <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit note</span>
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotesTable;
