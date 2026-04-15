import { CheckCircle2, Circle, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import ErrorState from "../ErrorState";

const DashboardStats = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) return <DashboardStatsSkeleton />;
  if (isError || !stats) {
    return (
      <ErrorState
        title="Unable to load dashboard stats"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
              <FileText className="text-primary size-6" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold">
                {stats.totalNotes}
              </p>
              <p className="text-muted-foreground text-sm">Total Notes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
              <Circle className="size-6 text-amber-500" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold">
                {stats.openNotes}
              </p>
              <p className="text-muted-foreground text-sm">Open Tickets</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="size-6 text-green-500" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold">
                {stats.completedNotes}
              </p>
              <p className="text-muted-foreground text-sm">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <Users className="text-primary size-6" />
            </div>
            <div>
              <p className="text-foreground text-3xl font-bold">
                {stats.activeEmployees}
              </p>
              <p className="text-muted-foreground text-sm">Active Staff</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
