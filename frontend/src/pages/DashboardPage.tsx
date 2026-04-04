import { useEffect, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/store/useAuthStore";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DashboardPage = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // const {
  //   data: users,
  //   isLoading: isLoadingUsers,
  //   isError: isUserError,
  //   error,
  // } = useUsers();
  // const {
  //   data: notes,
  //   isLoading: isLoadingNotes,
  //   isError: isNoteError,
  // } = useNotes();
  const { user: currentUsername, roles } = useAuthStore();

  const isAdminOrManager = roles.includes("Admin") || roles.includes("Manager");

  console.log(currentUsername);

  // const myOpen =
  //   notes?.filter((n) => !n.completed && n.username === currentUsername)
  //     .length || 0;
  // const totalEmployees = users?.length || 0;
  // const activeEmployees = users?.filter((u) => u.active).length || 0;
  // const totalNotes = notes?.length || 0;
  // const openNotes = notes?.filter((n) => !n.completed).length || 0;
  // const completedNotes = notes?.filter((n) => n.completed).length || 0;

  // const stats = {
  //   totalEmployees,
  //   activeEmployees,
  //   totalNotes,
  //   openNotes,
  //   completedNotes,
  // };

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(currentTime)
    : "";

  const formattedTime = currentTime
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(currentTime)
    : "";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground mb-2 flex items-center gap-2">
              <CalendarDays className="size-4" />
              {formattedDate}
              {formattedTime && (
                <>
                  <span className="mx-1">at</span>
                  <Clock className="size-4" />
                  {formattedTime}
                </>
              )}
            </p>
            <h1 className="text-foreground text-3xl font-bold">
              Welcome back!
            </h1>
            <p className="text-muted-foreground mt-1">
              {"Here's what's happening at TechFix Pro today."}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <CheckCircle2 className="h-6 w-6 text-green-500" />
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
      </div> */}

      {/* Quick Actions & Content Grid */}
    </div>
  );
};

export default DashboardPage;
