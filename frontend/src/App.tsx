import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import PublicOnly from "./components/PublicOnly";
import NotFound from "./components/NotFound";
import Loading from "./components/Loading";

// Lazy Loaded Pages (Split into separate bundles)
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Wrap EVERYTHING that needs auth memory in PersistLogin */}
          <Route element={<PersistLogin />}>
            {/* --- Public Only Routes --- */}
            <Route element={<PublicOnly />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<Login />} />
            </Route>

            {/* --- Protected Routes --- */}
            <Route
              element={
                <RequireAuth allowedRoles={["Admin", "Manager", "Employee"]} />
              }
            >
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />

                <Route path="notes">
                  <Route index element={<NotesPage />} />
                </Route>

                <Route
                  element={<RequireAuth allowedRoles={["Admin", "Manager"]} />}
                >
                  <Route path="employees">
                    <Route index element={<EmployeesPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>{" "}
          {/* End of PersistLogin */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
