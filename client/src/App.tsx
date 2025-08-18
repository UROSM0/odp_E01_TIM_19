import { Routes, Route, Navigate } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthAPIService";
import { ProtectedRoute } from "./components/protected_route/ProtectedRoute";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import DashboardStranica from "./pages/kontrolna_tabla/DashboardPage";
import NotFoundStranica from "./pages/not_found/NotFoundPage";
import CourseStranica from "./pages/kontrolna_tabla/CoursePage"; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardStranica />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <ProtectedRoute>
            <CourseStranica />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      <Route path="/404" element={<NotFoundStranica />} />
    </Routes>
  );
}

export default App;
