import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setBusy(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. Check your email if confirmation is enabled.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/", { replace: true });
      }
    } catch (err) {
      setMsg(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 className="h2">{mode === "signup" ? "Create account" : "Login"}</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        Your diary is private, cloud-synced, and tied to your account.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel" htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label className="promptLabel" htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
          />
        </div>

        <button className="btn" disabled={busy} type="submit">
          {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Login"}
        </button>

        <button
          className="btn btnGhost"
          type="button"
          disabled={busy}
          onClick={() => {
            setMsg("");
            setMode(mode === "signup" ? "login" : "signup");
          }}
        >
          Switch to {mode === "signup" ? "Login" : "Sign up"}
        </button>

        {msg ? (
          <p className="micro" style={{ color: "rgba(246,205,69,.92)", marginTop: 2 }}>
            {msg}
          </p>
        ) : null}
      </form>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(246,205,69,.10)" }}>
        <p className="micro">
          Tip: if you enabled email confirmation in Supabase, you must confirm before login works.
        </p>
      </div>
    </main>
  );
}
