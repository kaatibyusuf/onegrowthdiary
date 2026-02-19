import { useState } from "react";
import logo from "./assets/onegrowth-logo.png";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Today from "./pages/Today";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";
import RequireAuth from "./lib/RequireAuth";
import { supabase } from "./lib/supabase";
import { useAuth } from "./lib/AuthProvider";
import MenuDrawer from "./components/MenuDrawer";

export default function App() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="container">
      <header className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logo}
            alt="One Growth"
            style={{ height: 38, width: "auto", display: "block" }}
          />
          <div>
            <p className="eyebrow">One Growth</p>
            <h1 className="title">Growth Diary</h1>
          </div>
        </div>

        <button
          className="menuBtn"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          title="Menu"
        >
          ☰
        </button>
      </header>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        userEmail={user?.email}
        onSignOut={() => supabase.auth.signOut()}
      />

      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/" element={<RequireAuth><Today /></RequireAuth>} />
        <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/reminders" element={<RequireAuth><Reminders /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
      </Routes>
    </div>
  );
}
