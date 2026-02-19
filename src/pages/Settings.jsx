import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Settings() {
  const [newEmail, setNewEmail] = useState("");
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);

  async function changeEmail() {
    setHint("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setHint("Email update requested. Check your inbox to confirm, if required.");
      setNewEmail("");
    } catch (e) {
      setHint(e?.message || "Could not update email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="card">
      <h2 className="h2">Settings</h2>
      <p className="muted">Account controls.</p>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel">Change email</label>
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="new@email.com"
            type="email"
          />
        </div>

        <div className="row">
          <button className="btn" onClick={changeEmail} disabled={busy || !newEmail} type="button">
            {busy ? "Updating…" : "Update email"}
          </button>
        </div>

        {hint ? <p className="micro" style={{ color: "rgba(246,205,69,.92)" }}>{hint}</p> : null}
      </div>
    </main>
  );
}
