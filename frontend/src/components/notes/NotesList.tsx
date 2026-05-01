import { useState } from "react";

import NotesStatsCards from "./NotesStatsCards";
import NotesFilters from "./NotesFilters";
import ErrorState from "@/components/ErrorState";
import AddNoteDialog from "./AddNoteDialog";

import { useCreateNote } from "@/hooks/useCreateNote";
import { useNotes } from "@/hooks/useNotes";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/useAuthStore";
import type { StatusFilter } from "@/lib/types";
import NotesTable from "./NotesTable";
import TablePagination from "../TablePagination";
import { useDebounce } from "@/hooks/useDebounce";

const NotesList = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const debouncedSearch = useDebounce(search, 500);

  const { roles } = useAuthStore();

  const isManagerOrAdmin = roles.some((role) =>
    ["Manager", "Admin"].includes(role),
  );

  const { data: users } = useUsers({
    enabled: isManagerOrAdmin,
  });

  const { mutate: createNote, isPending } = useCreateNote();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useNotes({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    completed: status === "all" ? undefined : status === "completed",
  });

  const notes = response?.data ?? [];
  const metadata = response?.metadata;

  if (isError) {
    return (
      <section className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      {/* Page Title & Stats */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Repair Notes</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage repair tickets and service notes.
            </p>
          </div>
          <AddNoteDialog
            employees={users ?? []}
            onAdd={(data) => createNote(data)}
            isLoading={isPending}
          />
        </div>

        {/* Stats Cards */}
        <NotesStatsCards />
      </div>

      {/* Filters */}
      <div className="bg-card border-border rounded-lg border">
        <NotesFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
          isFetching={isFetching}
        />

        {/* Table */}
        <NotesTable notes={notes} users={users} isLoading={isLoading} />

        {/* Pagination */}
        <TablePagination
          metadata={metadata}
          onPageChange={setPage}
          isFetching={isFetching}
          unit="notes"
        />
      </div>
    </section>
  );
};

export default NotesList;
