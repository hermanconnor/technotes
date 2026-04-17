import { useDashboardStats } from "@/hooks/useDashboardStats";
import { CheckCircle2, Circle, FileText } from "lucide-react";
import NotesStatsSkeleton from "./NotesStatsSkeleton";
import ErrorState from "../ErrorState";

const NotesStatsCards = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) return <NotesStatsSkeleton />;

  if (isError || !stats) {
    return (
      <ErrorState
        title="Unable to load notes stats"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <FileText className="text-primary size-5" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.totalNotes}
            </p>
            <p className="text-muted-foreground text-sm">Total Notes</p>
          </div>
        </div>
      </div>
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Circle className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.openNotes}
            </p>
            <p className="text-muted-foreground text-sm">Open</p>
          </div>
        </div>
      </div>
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
            <CheckCircle2 className="size-5 text-green-500" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.completedNotes}
            </p>
            <p className="text-muted-foreground text-sm">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesStatsCards;
