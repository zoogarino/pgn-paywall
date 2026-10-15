import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Car, Map as MapIcon, Heart } from "lucide-react";

const TOKENS = [
  "pgn-blue", "pgn-link", "pgn-navy", "pgn-terracotta", "pgn-terracotta-text", "pgn-sand", "pgn-parchment",
  "pgn-warm-border", "pgn-input-border", "pgn-warm-brown", "pgn-muted", "pgn-dark",
  "pgn-toggle-off", "pgn-success", "pgn-partner-tab", "pgn-danger",
];
const PINS: [string, string][] = [
  ["Support Namibia", "pin-purple"], ["Activities", "pin-gold"], ["Accommodation", "pin-blue"], ["Sites", "pin-brown"],
  ["Support", "pin-orange"], ["Emergencies", "pgn-danger"], ["Fuel", "pgn-success"],
];

function lum(hex: string) {
  const h = hex.replace("#", "");
  const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a?: string, b?: string) {
  if (!a || !b) return "–";
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return ((x + 0.05) / (y + 0.05)).toFixed(2);
}

function Label({ children }: { children: string }) {
  return <p className="mb-2 mt-7 text-xs font-bold uppercase tracking-wider text-warm-brown">{children}</p>;
}

export function StylePreview({ onBack }: { onBack: () => void }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [on, setOn] = useState(false);
  const [off, setOff] = useState(false);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const all = [...TOKENS, ...PINS.map((p) => p[1]), "pgn-on-dark"];
    setVals(Object.fromEntries(all.map((t) => [t, cs.getPropertyValue(`--${t}`).trim().toUpperCase()])));
  }, []);
  const white = vals["pgn-on-dark"], parch = vals["pgn-parchment"];

  return (
    <div className="min-h-full bg-parchment px-5 pb-10 pt-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Back" className="grid h-11 w-11 place-items-center rounded-full bg-pgn-dark text-on-dark"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-[22px] text-terracotta">Style preview</h1>
      </div>

      <Label>Colour tokens</Label>
      <ul className="space-y-2">
        {TOKENS.map((t) => (
          <li key={t} className="flex items-center gap-3 rounded-xl border border-warm-border bg-on-dark p-2">
            <span className="h-10 w-10 shrink-0 rounded-lg border border-warm-border" style={{ background: `var(--${t})` }} />
            <div className="min-w-0 text-xs text-navy">
              <p className="font-bold">--{t}</p>
              <p className="text-pgn-muted">{vals[t]} · white {ratio(vals[t], white)}:1 · parchment {ratio(vals[t], parch)}:1</p>
            </div>
          </li>
        ))}
      </ul>

      <Label>Buttons</Label>
      <div className="space-y-2">
        <button className="btn-cta w-full">Start free trial</button>
        <button className="btn-cta w-full" disabled>Start free trial (disabled)</button>
        <button className="btn-secondary w-full">Contact us</button>
        <button className="min-h-[52px] w-full rounded-full border-2 border-navy font-bold text-navy">Cancel</button>
        <button className="min-h-[52px] w-full rounded-full bg-danger font-bold text-on-dark">Delete Account Permanently</button>
      </div>

      <Label>Toggles</Label>
      <div className="space-y-1 rounded-2xl border border-warm-border bg-on-dark px-4">
        {([["Offline maps", off, setOff], ["Live location alerts", on, setOn]] as const).map(([l, v, set]) => (
          <div key={l} className="flex min-h-12 items-center justify-between text-navy">
            <span>{l}</span>
            <button role="switch" aria-checked={v} aria-label={l} onClick={() => set(!v)}
              className={`relative h-7 w-12 rounded-full transition ${v ? "bg-terracotta" : "bg-toggle-off"}`}>
              <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-on-dark shadow-card transition-all ${v ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>

      <Label>Input fields</Label>
      <label className="block text-sm text-warm-brown">Full name
        <input placeholder="e.g. Maria Shikongo" className="mt-1 block min-h-11 w-full rounded-xl border border-input-border bg-on-dark px-3 text-navy placeholder:text-pgn-muted focus:outline-none focus:border-b-2 focus:border-b-link" />
      </label>
      <label className="mt-3 block text-sm text-warm-brown">Email (focused)
        <input placeholder="you@example.com" className="mt-1 block min-h-11 w-full rounded-xl border border-input-border border-b-2 border-b-link bg-on-dark px-3 text-navy placeholder:text-pgn-muted focus:outline-none" />
      </label>

      <Label>Cards</Label>
      <div className="space-y-2">
        <div className="rounded-2xl border border-warm-border bg-on-dark p-4 text-navy">White card with warm border</div>
        <div className="rounded-2xl border border-warm-border bg-sand p-4 text-navy">Sand info card</div>
        <div className="rounded-xl bg-navy px-4 py-3 font-display text-on-dark">Section header band</div>
      </div>

      <Label>Accordion, steps, checklist</Label>
      <div className="rounded-2xl border border-warm-border bg-on-dark">
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-12 w-full items-center justify-between px-4 font-bold text-warm-brown">
          Before you drive <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {open && (
          <div className="space-y-3 border-t border-warm-border p-4 text-sm text-navy">
            {["Download the offline map", "Check road conditions", "Save emergency numbers"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-terracotta text-xs font-bold text-terracotta-text">{i + 1}</span>{s}
              </div>
            ))}
            {["Spare tyre checked", "Water for two days"].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-terracotta text-on-dark"><Check className="h-4 w-4" aria-hidden /></span>{s}
              </div>
            ))}
          </div>
        )}
      </div>

      <Label>Nav bar</Label>
      <div className="flex items-center gap-3 rounded-2xl border border-warm-border bg-on-dark p-2">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-pgn-dark text-on-dark"><ArrowLeft className="h-5 w-5" aria-hidden /></span>
        <span className="font-display text-[20px] text-terracotta">Travel Advice</span>
      </div>

      <Label>Explore tiles</Label>
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-on-dark">
        <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-terracotta p-2"><Car className="h-6 w-6" aria-hidden />Car Hire</div>
        <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-navy p-2"><MapIcon className="h-6 w-6" aria-hidden />Trip Planner</div>
        <div className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl bg-pin-purple p-2"><Heart className="h-6 w-6" aria-hidden />Support Namibia</div>
      </div>

      <Label>Do not change</Label>
      <p className="mb-2 text-xs text-pgn-muted">Map pins: approximate, app values apply.</p>
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full border-2 border-navy bg-on-dark px-2 py-1 text-xs text-navy"><span className="h-4 w-4 rounded-full bg-terracotta" />Terracotta</span>
        {PINS.map(([l, t]) => (
          <span key={l} className="flex items-center gap-1.5 rounded-full border border-warm-border bg-on-dark px-2 py-1 text-xs text-navy">
            <span className="h-4 w-4 rounded-full" style={{ background: `var(--${t})` }} />{l}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="rounded-full bg-pgn-blue px-3 py-1 text-sm font-bold text-navy">28° Windhoek</span>
        <span className="border-b-[3px] border-pgn-blue pb-1 text-sm font-bold text-navy">Active tab</span>
        <span className="rounded-t-lg bg-partner-tab px-3 py-1 text-xs text-on-dark">Partner</span>
      </div>
    </div>
  );
}
