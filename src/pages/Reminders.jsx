import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";

export default function Reminders() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("5 minutes. Face yourself.");
  const [timeLocal, setTimeLocal] = useState("20:30");
  const [hint, setHint] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("reminders")
      .select("id, title, time_local, enabled")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) setHint(error.message);
    else setItems(data || []);
  }

  useEffect(() => { load(); }, []);

  async function addReminder() {
    setHint("");
    const { error } = await supabase.from("reminders").insert({
      user_id: user.id,
      title,
      time_local: timeLocal,
      enabled: true,
    });
    if (error) setHint(error.message);
    else {
      setTitle("5 minutes. Face yourself.");
      setTimeLocal("20:30");
      load();
    }
  }

  async function toggle(id, enabled) {
    const { error } = await supabase.from("reminders").update({ enabled }).eq("id", id);
    if (error) setHint(error.message);
    else load();
  }

  async function remove(id) {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) setHint(error.message);
    else load();
  }

  async function enableBrowserNotifications() {
    if (!("Notification" in window)) {
      setHint("This browser does not support notifications.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm !== "granted") setHint("Notifications not allowed.");
    else setHint("Notifications enabled in this browser.");
  }

  return (
    <main className="card">
      <h2 className="h2">Reminders</h2>
      <p className="muted">Saved to your account. Notifications are optional per device.</p>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel">Message</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel">Time</label>
          <input value={timeLocal} onChange={(e) => setTimeLocal(e.target.value)} type="time" />
        </div>

        <div className="row">
          <button className="btn" onClick={addReminder} type="button">Add reminder</button>
          <button className="btn btnGhost" onClick={enableBrowserNotifications} type="button">
            Enable notifications
          </button>
        </div>

        {hint ? <p className="micro" style={{ color: "rgba(246,205,69,.92)" }}>{hint}</p> : null}

        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {items.map((r) => (
            <div key={r.id} className="prompt" style={{ marginBottom: 0 }}>
              <p className="promptText" style={{ marginBottom: 6 }}>{r.title}</p>
              <p className="micro">{r.time_local} • {r.enabled ? "Enabled" : "Disabled"}</p>
              <div className="row" style={{ marginTop: 8 }}>
                <button className="btn btnGhost" type="button" onClick={() => toggle(r.id, !r.enabled)}>
                  {r.enabled ? "Disable" : "Enable"}
                </button>
                <button className="btn btnGhost" type="button" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 ? <p className="micro">No reminders yet.</p> : null}
        </div>
      </div>
    </main>
  );
}
