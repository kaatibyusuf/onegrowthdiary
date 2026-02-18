import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";

const PROMPTS = [
  "What did you avoid today?",
  "What did you do well today?",
  "What are you pretending not to know?",
  "What drained you today, and why?",
  "What’s one brave thing you can do tomorrow?",
  "What did you learn about yourself today?",
];

function isoDay(d) {
  return d.toISOString().slice(0, 10);
}
function formatDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function pickPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}
function countWords(text) {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

export default function Today() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => isoDay(today), [today]);

  const [prompt, setPrompt] = useState(pickPrompt());
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(true);

  // Load today's entry from cloud
  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("entries")
        .select("prompt, content")
        .eq("user_id", user.id)
        .eq("entry_date", dayKey)
        .maybeSingle();

      if (!alive) return;

      if (error) setHint(error.message);
      if (data?.prompt) setPrompt(data.prompt);
      if (data?.content) setText(data.content);

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, [user.id, dayKey]);

  async function save() {
    setHint("Saving…");

    const payload = {
      user_id: user.id,
      entry_date: dayKey,
      prompt,
      content: text,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("entries").upsert(payload, {
      onConflict: "user_id,entry_date",
    });

    if (error) setHint(error.message);
    else {
      setHint("Saved. You showed up today.");
      setTimeout(() => setHint(""), 2000);
    }
  }

  return (
    <>
      <main className="card">
        <div className="cardHead">
          <div>
            <h2 className="h2">Today’s Page</h2>
            <p className="muted">{formatDate(today)}</p>
          </div>
          <div className="pill">{loading ? "Loading…" : `${countWords(text)} words`}</div>
        </div>

        <section className="prompt">
          <p className="promptLabel">Prompt</p>
          <p className="promptText">{prompt}</p>
          <button className="link" type="button" onClick={() => setPrompt(pickPrompt())}>
            Change prompt
          </button>
        </section>

        <section>
          <label className="promptLabel" htmlFor="entry">Write</label>
          <textarea
            id="entry"
            className="textarea"
            rows={10}
            placeholder="Write freely. No audience. No pressure."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />

          <div className="row">
            <button className="btn btnGhost" type="button" onClick={() => setText("")} disabled={loading}>
              Clear
            </button>
            <button className="btn" type="button" onClick={save} disabled={loading}>
              Close this page
            </button>
          </div>

          {hint ? <p className="micro" style={{ color: "rgba(246,205,69,.9)" }}>{hint}</p> : null}
        </section>
      </main>

      <footer className="footer muted">
        <span>Private. Cloud-synced.</span>
      </footer>
    </>
  );
}
