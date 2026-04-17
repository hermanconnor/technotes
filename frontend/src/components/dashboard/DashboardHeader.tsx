import { Link, useNavigate } from "react-router";
import { Wrench, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useLogout";
import { getInitials } from "@/utils";

interface Props {
  currentPage: string;
}

const DashboardHeader = ({ currentPage }: Props) => {
  const navigate = useNavigate();
  const logout = useLogout();

  const { user, roles = [] } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const canSeeEmployees = roles.some((role) =>
    ["Admin", "Manager"].includes(role),
  );

  return (
    <header className="border-border bg-card border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary flex size-10 items-center justify-center rounded-lg">
                <Wrench className="text-primary-foreground size-5" />
              </div>
              <span className="text-foreground hidden text-xl font-bold sm:inline">
                TechFix Pro
              </span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{currentPage}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
              >
                <Link to="/dashboard/notes">Notes</Link>
              </Button>

              {/* Conditional Rendering based on Roles */}
              {canSeeEmployees && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                >
                  <Link to="/users">Employees</Link>
                </Button>
              )}
            </nav>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-10 cursor-pointer items-center gap-2 px-2"
                  aria-label="User menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start sm:flex">
                    <span className="text-foreground text-sm leading-none font-medium">
                      {user || "User"}
                    </span>
                    {roles.length > 0 && (
                      <span className="text-muted-foreground mt-1 text-xs uppercase">
                        {roles[0]}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="text-muted-foreground size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user}</span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
