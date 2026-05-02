import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import NotesPage from "./pages/NotesPage";
import EmployeesPage from "./pages/EmployeesPage";
import NotFound from "./components/NotFound";
import PublicOnly from "./components/PublicOnly";

function App() {
  return (
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
  );
}

export default App;
