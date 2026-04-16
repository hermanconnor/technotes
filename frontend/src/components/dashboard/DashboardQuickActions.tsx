import { Link } from "react-router";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNotes } from "@/hooks/useNotes";
import { RecentNotesSkeleton } from "./RecentNotesSkeleton";
import ErrorState from "../ErrorState";

interface Props {
  isAdminOrManager: boolean;
}

const DashboardQuickActions = ({ isAdminOrManager }: Props) => {
  const { data, isLoading, isError, refetch } = useNotes({ limit: 5 });
  const recentNotes = data?.data ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Quick Actions */}
      <Card className="bg-card border-border lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="w-full justify-start gap-3">
            <Link to="/dashboard/notes">
              <Plus className="size-4" />
              Add New Note
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="w-full justify-start gap-3"
          >
            <Link to="/dashboard/notes">
              <FileText className="size-4" />
              View All Notes
              <ArrowRight className="ml-auto size-4" />
            </Link>
          </Button>
          {isAdminOrManager ? (
            <Button
              asChild
              variant="secondary"
              className="w-full justify-start gap-3"
            >
              <Link to="/dashboard/employees">
                <Users className="size-4" />
                Manage Employees
                <ArrowRight className="ml-auto size-4" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <div className="lg:col-span-2">
        {isLoading ? (
          <RecentNotesSkeleton />
        ) : isError ? (
          <ErrorState
            title="Could not load recent notes"
            message="We had trouble reaching the notes server."
            onRetry={() => refetch()}
          />
        ) : (
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">
                  Recent Repair Notes
                </CardTitle>
                <CardDescription>
                  Latest updates on repair tickets
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/notes">
                  View All
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-secondary/50 hover:bg-secondary flex items-center justify-between rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {note.completed ? (
                        <CheckCircle2 className="size-5 shrink-0 text-green-500" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-amber-500" />
                      )}
                      <div>
                        <p className="text-foreground font-medium">
                          {note.title}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {note.username} &middot; Updated {note.updatedAt}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        note.completed
                          ? "border-green-500/50 bg-green-500/10 text-green-500"
                          : "border-amber-500/50 bg-amber-500/10 text-amber-500"
                      }
                    >
                      {note.completed ? "Done" : "Open"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardQuickActions;
