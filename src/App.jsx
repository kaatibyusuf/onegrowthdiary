import logo from "./assets/onegrowth-logo.png";
import { NavLink, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Today from "./pages/Today";
import RequireAuth from "./lib/RequireAuth";
import { supabase } from "./lib/supabase";
import { useAuth } from "./lib/AuthProvider";

export default function App() {
  const { user, loading } = useAuth();

  return (
    <div className="container">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logo}
            alt="One Growth"
            style={{
              height: 38,
              width: "auto",
              filter: "drop-shadow(0 6px 18px rgba(0,0,0,.35))",
              display: "block",
            }}
          />
          <div>
            <p className="eyebrow">One Growth</p>
            <h1 className="title">Growth Diary</h1>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {loading ? null : user ? (
            <>
              <NavLink className="link" to="/">
                Today
              </NavLink>
              <NavLink className="link" to="/history">
                History
              </NavLink>
              <button
                className="link"
                onClick={() => supabase.auth.signOut()}
                type="button"
              >
                Sign out
              </button>
            </>
          ) : (
            <NavLink className="link" to="/auth">
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Today />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <div className="card">
                <h2 className="h2">History</h2>
                <p className="muted">Next.</p>
              </div>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
