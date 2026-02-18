import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="card">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  return children;
}
