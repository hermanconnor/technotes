import { useLocation } from "react-router";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  const location = useLocation();

  const currentPage =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.substring(1).charAt(0).toUpperCase() +
        location.pathname.slice(2);

  return (
    <>
      <DashboardHeader currentPage={currentPage} />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
