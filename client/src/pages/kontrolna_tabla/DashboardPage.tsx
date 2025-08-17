import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Dashboard } from "../../components/courses/Dashboard";

export default function DashboardStranica() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, logout, navigate]);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-600/75 to-orange-800/70 flex items-center justify-center">
      <Dashboard />
    </main>
  );
}
