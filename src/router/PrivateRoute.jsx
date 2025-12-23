import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // mientras el contexto resuelve el usuario
  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
    // o null / spinner si querés
  }

  // si no hay usuario → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // usuario autenticado
  return children;
}
