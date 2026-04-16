import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ManageTeamSkeleton } from "./ManageTeamSkeleton";
import { getInitials } from "@/utils";
import { useUsers } from "@/hooks/useUsers";
import ErrorState from "../ErrorState";

const ManageTeam = () => {
  const { data: teamMembers, isLoading, isError, refetch } = useUsers();

  return (
    <div className="mt-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Team Members</CardTitle>
            <CardDescription>Your active technicians and staff</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/employees">
              Manage Team
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ManageTeamSkeleton />
          ) : isError ? (
            <ErrorState
              title="Couldn't load team"
              message="Failed to fetch team member data."
              onRetry={() => refetch()}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers?.slice(0, 4).map((member) => (
                <div
                  key={member.username}
                  className="bg-secondary/50 hover:bg-secondary/80 flex items-center gap-3 rounded-lg p-3 transition-colors"
                >
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {getInitials(member.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="text-foreground truncate text-sm font-medium">
                      {member.username}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {member.roles?.[0] || "Staff"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageTeam;
