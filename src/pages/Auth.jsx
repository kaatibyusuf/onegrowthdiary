import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

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
      }
    } catch (err) {
      setMsg(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="card">
      <h2 className="h2">{mode === "signup" ? "Create account" : "Login"}</h2>
      <p className="muted">Your diary is private and tied to your account.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          type="email"
          required
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          type="password"
          required
        />

        <button className="btn" disabled={busy} type="submit">
          {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Login"}
        </button>

        <button
          className="btn btnGhost"
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        >
          Switch to {mode === "signup" ? "Login" : "Sign up"}
        </button>

        {msg ? <p className="micro" style={{ color: "rgba(246,205,69,.9)" }}>{msg}</p> : null}
      </form>
    </main>
  );
}

const inputStyle = {
  borderRadius: 14,
  border: "1px solid rgba(246,205,69,.18)",
  background: "rgba(12,24,21,.55)",
  color: "white",
  padding: "12px",
  outline: "none",
};
