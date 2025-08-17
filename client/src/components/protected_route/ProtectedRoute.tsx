import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ObrišiVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";

type ProtectedRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    ObrišiVrednostPoKljuču("authToken");
    logout();
  };

  // Prikaži loading dok se učitava auth stanje
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  // Ako korisnik nije autentifikovan, preusmeri na login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Trenutno ne proveravamo role
  return <>{children}</>;
};
