import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <main className="flex min-h-dvh flex-col">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
