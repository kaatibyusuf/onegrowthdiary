import { NavLink } from "react-router-dom";

export default function MenuDrawer({ open, onClose, userEmail, onSignOut }) {
  if (!open) return null;

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawerHead">
          <div>
            <p className="eyebrow" style={{ marginBottom: 4 }}>Menu</p>
            <p className="micro">{userEmail || "Not signed in"}</p>
          </div>
          <button className="menuBtn" onClick={onClose} type="button" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="drawerLinks">
          <NavLink className="link" to="/" onClick={onClose}>Today</NavLink>
          <NavLink className="link" to="/calendar" onClick={onClose}>Calendar</NavLink>
          <NavLink className="link" to="/profile" onClick={onClose}>Profile</NavLink>
          <NavLink className="link" to="/reminders" onClick={onClose}>Reminders</NavLink>
          <NavLink className="link" to="/settings" onClick={onClose}>Settings</NavLink>

          <button className="btn btnGhost" onClick={onSignOut} type="button">
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );
}
