import { Users } from "lucide-react";
import EmployeesStatsSkeleton from "./EmployeesStatsSkeleton";
import ErrorState from "@/components/ErrorState";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const EmployeesStatsCards = () => {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) return <EmployeesStatsSkeleton />;

  if (isError || !stats) {
    return (
      <ErrorState
        title="Unable to load employee stats"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <Users className="text-primary size-5" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.totalEmployees}
            </p>
            <p className="text-muted-foreground text-sm">Total Employees</p>
          </div>
        </div>
      </div>

      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <Users className="size-5 text-green-500" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.activeEmployees}
            </p>
            <p className="text-muted-foreground text-sm">Active</p>
          </div>
        </div>
      </div>

      <div className="bg-card border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
            <Users className="text-muted-foreground h-5 w-5" />
          </div>
          <div>
            <p className="text-foreground text-2xl font-bold">
              {stats.inactiveEmployees}
            </p>
            <p className="text-muted-foreground text-sm">Inactive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesStatsCards;
