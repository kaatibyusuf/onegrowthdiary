import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthProvider";

function ymd(d) { return d.toISOString().slice(0,10); }

function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1); x.setHours(0,0,0,0);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default function Calendar() {
  const { user } = useAuth();
  const [month, setMonth] = useState(() => new Date());
  const [datesWithEntries, setDatesWithEntries] = useState(new Set());
  const [selected, setSelected] = useState(() => new Date());
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [hint, setHint] = useState("");

  useEffect(() => {
    async function loadDates() {
      setHint("");
      const { data, error } = await supabase
        .from("entries")
        .select("entry_date")
        .eq("user_id", user.id);

      if (error) setHint(error.message);
      else setDatesWithEntries(new Set((data || []).map(x => x.entry_date)));
    }
    loadDates();
  }, [user.id]);

  useEffect(() => {
    async function loadEntry() {
      const key = ymd(selected);
      const { data, error } = await supabase
        .from("entries")
        .select("prompt, content, entry_date")
        .eq("user_id", user.id)
        .eq("entry_date", key)
        .maybeSingle();

      if (error) setHint(error.message);
      setSelectedEntry(data || null);
    }
    loadEntry();
  }, [selected, user.id]);

  const grid = useMemo(() => {
    const first = startOfMonth(month);
    const day = first.getDay(); // 0 Sun
    const gridStart = addDays(first, -day);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [month]);

  const monthLabel = useMemo(
    () => month.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    [month]
  );

  return (
    <main className="card">
      <div className="cardHead">
        <div>
          <h2 className="h2">Calendar</h2>
          <p className="muted">{monthLabel}</p>
        </div>
        <div className="row" style={{ marginTop: 0 }}>
          <button className="btn btnGhost" type="button" onClick={() => setMonth(addDays(startOfMonth(month), -1))}>
            Prev
          </button>
          <button className="btn btnGhost" type="button" onClick={() => setMonth(new Date())}>
            Today
          </button>
          <button className="btn btnGhost" type="button" onClick={() => setMonth(addDays(startOfMonth(month), 32))}>
            Next
          </button>
        </div>
      </div>

      {hint ? <p className="micro" style={{ color: "rgba(246,205,69,.92)" }}>{hint}</p> : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 12 }}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d} className="micro" style={{ opacity: .8, padding: "0 6px" }}>{d}</div>
        ))}

        {grid.map((d) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === month.getMonth();
          const hasEntry = datesWithEntries.has(key);
          const isSelected = ymd(d) === ymd(selected);

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(d)}
              className="btn btnGhost"
              style={{
                padding: "10px 8px",
                justifyContent: "center",
                opacity: inMonth ? 1 : 0.45,
                borderColor: isSelected ? "rgba(88,185,71,.55)" : hasEntry ? "rgba(246,205,69,.28)" : "rgba(246,205,69,.12)",
                background: isSelected ? "rgba(88,185,71,.10)" : hasEntry ? "rgba(246,205,69,.06)" : "rgba(246,205,69,.03)",
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 14 }}>
        <p className="promptLabel">Selected day</p>
        {selectedEntry ? (
          <div className="prompt" style={{ marginBottom: 0 }}>
            <p className="promptText">{selectedEntry.prompt}</p>
            <p className="micro" style={{ whiteSpace: "pre-wrap" }}>
              {selectedEntry.content || "(Empty)"}
            </p>
          </div>
        ) : (
          <p className="micro">No entry for this day yet.</p>
        )}
      </div>
    </main>
  );
}
