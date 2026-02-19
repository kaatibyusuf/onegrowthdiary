import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [hint, setHint] = useState("");

  useEffect(() => {
    let alive = true;
    async function load() {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, nickname")
        .eq("id", user.id)
        .maybeSingle();

      if (!alive) return;
      if (error) setHint(error.message);
      if (data?.full_name) setFullName(data.full_name);
      if (data?.nickname) setNickname(data.nickname);
    }
    load();
    return () => { alive = false; };
  }, [user.id]);

  async function save() {
    setHint("Saving…");
    const payload = {
      id: user.id,
      full_name: fullName,
      nickname,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);
    setHint(error ? error.message : "Saved.");
    if (!error) setTimeout(() => setHint(""), 1500);
  }

  return (
    <main className="card">
      <div className="cardHead">
        <div>
          <h2 className="h2">Profile</h2>
          <p className="muted">Your diary identity, private to you.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel">Nickname</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="What should the app call you?" />
        </div>

        <div className="row">
          <button className="btn" onClick={save} type="button">Save</button>
        </div>

        {hint ? <p className="micro" style={{ color: "rgba(246,205,69,.92)" }}>{hint}</p> : null}
      </div>
    </main>
  );
}
