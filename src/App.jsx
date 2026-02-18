import { NavLink, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Today from "./pages/Today";
import RequireAuth from "./lib/RequireAuth";
import { supabase } from "./lib/supabase";

export default function App() {
  return (
    <div className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">One Growth</p>
          <h1 className="title">Growth Diary</h1>
        </div>

        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <NavLink className="link" to="/">Today</NavLink>
          <NavLink className="link" to="/history">History</NavLink>
          <button className="link" onClick={() => supabase.auth.signOut()} type="button">
            Sign out
          </button>
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
