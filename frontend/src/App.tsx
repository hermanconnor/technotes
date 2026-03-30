import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import RootLayout from "./RootLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
