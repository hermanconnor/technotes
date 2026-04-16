import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { CalendarDays, Clock } from "lucide-react";

import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions";
import ManageTeam from "@/components/dashboard/ManageTeam";

const DashboardPage = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  const { roles } = useAuthStore();
  const isAdminOrManager = roles.includes("Admin") || roles.includes("Manager");

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
      <DashboardStats />

      {/* Quick Actions & Content Grid */}
      <DashboardQuickActions isAdminOrManager={isAdminOrManager} />

      {/* Team Section */}
      {isAdminOrManager && <ManageTeam />}
    </div>
  );
};

export default DashboardPage;
