import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import NotesPage from "./pages/NotesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
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
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
