import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
