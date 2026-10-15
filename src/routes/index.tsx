import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  X, Star, Heart, Map, RefreshCw, Compass, Construction, HelpCircle, Info, Settings, LogOut,
  Route as Check, Leaf, ShieldCheck, ChevronDown, Loader2, Menu, Wifi, BatteryFull, Signal,
} from "lucide-react";
import logo from "@/assets/pgnlogo.png.asset.json";
import hero from "@/assets/hero.jpg.asset.json";
import { StylePreview } from "@/components/StylePreview";
import {
  PLANS, PLAN_ORDER, LAUNCH_OFFER, DEFAULT_HIGHLIGHTED_PLAN, TRIGGER_COPY, BENEFITS, FREE_CAP_TRIPS, PREMIUM_CAP_TRIPS,
  ctaLabel, disclosure, checkoutPrice, money, fmtDate, type PlanId, type Trigger,
} from "@/lib/paywall-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pocket Guide Premium — Paywall Prototype" },
      { name: "description", content: "Clickable prototype of the Pocket Guide Namibia Premium subscription paywall." },
      { property: "og:title", content: "Pocket Guide Premium — Paywall Prototype" },
      { property: "og:description", content: "Clickable prototype of the Pocket Guide Namibia Premium subscription paywall." },
    ],
  }),
  component: Prototype,
});

type UserState = "free" | "active" | "expired";
type Screen = "sidebar" | "paywall" | "success" | "active" | "expired" | "saved" | "style";

function Prototype() {
  const [trigger, setTrigger] = useState<Trigger>("sidebar");
  const [launch, setLaunch] = useState(true);
  const [highlight, setHighlight] = useState<PlanId>(DEFAULT_HIGHLIGHTED_PLAN);
  const [showMonthly, setShowMonthly] = useState(true);
  const [userState, setUserState] = useState<UserState>("free");
  const [screen, setScreen] = useState<Screen>("sidebar");
  const [selected, setSelected] = useState<PlanId>(DEFAULT_HIGHLIGHTED_PLAN);
  const [purchased, setPurchased] = useState<PlanId>("yearly");
  const [sheet, setSheet] = useState<"none" | "checkout" | "processing">("none");
  const [nudge, setNudge] = useState(false);

  useEffect(() => setSelected(highlight), [highlight]);
  useEffect(() => { if (!showMonthly && selected === "monthly") setSelected(highlight === "monthly" ? "yearly" : highlight); }, [showMonthly, selected, highlight]);

  const applyTrigger = (t: Trigger) => {
    setTrigger(t); setSheet("none");
    if (t === "sidebar") { setScreen("sidebar"); setNudge(false); }
    else if (t === "nudge") { setScreen("saved"); setNudge(true); }
    else { setScreen("paywall"); setNudge(false); }
  };
  const applyUser = (u: UserState) => {
    setUserState(u); setSheet("none"); setNudge(false);
    setScreen(u === "active" ? "active" : u === "expired" ? "expired" : "sidebar");
  };
  const openPremium = () => setScreen(userState === "active" ? "active" : userState === "expired" ? "expired" : "paywall");

  const confirm = () => {
    setSheet("processing");
    setTimeout(() => { setSheet("none"); setPurchased(selected); setUserState("active"); setScreen("success"); }, 1400);
  };

  const plans = PLAN_ORDER.filter((p) => showMonthly || p !== "monthly")
    .sort((a, b) => (a === highlight ? -1 : b === highlight ? 1 : 0));
  const copy = TRIGGER_COPY[trigger === "nudge" ? "trip3" : trigger];

  return (
    <main className="min-h-screen bg-ctl-bg md:flex md:items-start md:justify-center md:gap-8 md:p-8">
      <div className="relative mx-auto h-[100dvh] w-full overflow-hidden bg-parchment md:h-[844px] md:w-[390px] md:shrink-0 md:rounded-[44px] md:border-[10px] md:border-pgn-dark md:shadow-card flex flex-col">
        <div className="flex h-9 shrink-0 items-center justify-between bg-pgn-blue px-6 text-sm font-bold text-on-dark" aria-hidden>
          <span>9:41</span>
          <span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" /></span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {screen === "sidebar" && <Sidebar userState={userState} onPremium={openPremium} />}
          {screen === "paywall" && (
            <Paywall copy={copy} plans={plans} selected={selected} setSelected={setSelected} highlight={highlight}
              launch={launch} onClose={() => setScreen("sidebar")} onCta={() => setSheet("checkout")} />
          )}
          {screen === "success" && <Success plan={purchased} onExplore={() => setScreen("sidebar")} onManage={() => setScreen("active")} />}
          {screen === "active" && <Status kind="active" plan={purchased} onBack={() => setScreen("sidebar")} onPrimary={() => toast("Opens App Store / Google Play subscription settings")} />}
          {screen === "expired" && <Status kind="expired" plan={purchased} onBack={() => setScreen("sidebar")} onPrimary={() => setScreen("paywall")} />}
          {screen === "saved" && <SavedTrip onBack={() => setScreen("sidebar")} />}
          {screen === "style" && <StylePreview onBack={() => setScreen("sidebar")} />}
        </div>

        {nudge && screen === "saved" && (
          <Sheet onDismiss={() => setNudge(false)} label="Trip saved">
            <h2 className="text-xl text-navy">Trip saved.</h2>
            <p className="mt-3 rounded-2xl border border-warm-border bg-sand p-4 text-sm text-navy">
              You've used 1 of {FREE_CAP_TRIPS} free trips. Premium includes up to {PREMIUM_CAP_TRIPS} trips and live location alerts for drives like this.
            </p>
            <button className="btn-cta mt-5 w-full" onClick={() => { setNudge(false); setTrigger("trip3"); setScreen("paywall"); }}>See Premium</button>
            <button className="mt-2 min-h-11 w-full text-navy" onClick={() => setNudge(false)}>Not now</button>
          </Sheet>
        )}

        {sheet !== "none" && (
          <Sheet neutral onDismiss={() => sheet === "checkout" && setSheet("none")} label="Checkout">
            {sheet === "checkout" ? (
              <>
                <p className="text-xs uppercase tracking-wider text-ctl-sub">App Store / Google Play checkout, simulated</p>
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-ctl-fill p-4">
                  <img src={logo.url} alt="" className="h-12 w-12 rounded-xl bg-ctl-panel p-1" />
                  <div className="min-w-0">
                    <p className="font-display text-lg text-ctl-ink">{PLANS[selected].name}</p>
                    <p className="text-sm text-ctl-sub">{checkoutPrice(selected, launch)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-ctl-sub">{disclosure(selected, launch)}</p>
                <button className="mt-5 min-h-[52px] w-full rounded-full bg-ctl-ink font-bold text-ctl-panel" onClick={confirm}>Confirm</button>
                <button className="mt-2 min-h-11 w-full text-ctl-ink" onClick={() => setSheet("none")}>Cancel</button>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-ctl-ink" role="status">
                <Loader2 className="h-10 w-10 animate-spin" aria-hidden />
                <p className="mt-3">Processing…</p>
              </div>
            )}
          </Sheet>
        )}
      </div>

      <Controls onStyle={() => { setSheet("none"); setNudge(false); setScreen("style"); }} {...{ trigger, applyTrigger, launch, setLaunch, highlight, setHighlight, showMonthly, setShowMonthly, userState, applyUser }} />
    </main>
  );
}

function Sheet({ children, onDismiss, label, neutral }: { children: ReactNode; onDismiss: () => void; label: string; neutral?: boolean }) {
  return (
    <div className="absolute inset-0 z-20 flex items-end bg-pgn-dark/50" onClick={onDismiss}>
      <div role="dialog" aria-label={label} className={`w-full rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom ${neutral ? "bg-ctl-panel" : "bg-on-dark"}`} onClick={(e) => e.stopPropagation()}>
        <div className={`mx-auto mb-4 h-1.5 w-10 rounded-full ${neutral ? "bg-ctl-line" : "bg-warm-border"}`} />
        {children}
      </div>
    </div>
  );
}

// Assumption: spec names only Travel Advice for the terracotta accent bar; applied to all four expandable rows.
const ACCENT_ROWS: string[] = ["Travel Advice", "How to use the App", "About app", "Settings"];

function Sidebar({ userState, onPremium }: { userState: UserState; onPremium: () => void }) {
  const items = [
    [Heart, "Favorites"], [Map, "Map Options"], [RefreshCw, "Update Map"], [Compass, "Travel Advice"],
    [Construction, "Road Condition Updates"], [HelpCircle, "How to use the App"], [Info, "About app"], [Settings, "Settings"], [LogOut, "Logout"],
  ] as const;
  return (
    <div className="min-h-full bg-parchment">
      <div className="bg-navy px-5 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="Pocket Guide Namibia logo" className="h-14 w-14 rounded-full bg-on-dark p-1.5" />
          <div className="min-w-0">
            <p className="font-display text-lg text-on-dark">Traveller</p>
            {userState === "active" ? (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2 py-0.5 text-xs text-pgn-dark"><Star className="h-3 w-3 fill-pgn-dark text-pgn-dark" aria-hidden /> Premium</span>
            ) : <p className="text-sm text-on-dark">Free plan</p>}
          </div>
        </div>
      </div>
      <nav className="space-y-2 p-3">
        <button onClick={onPremium} className="gold-outline flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-navy">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-gradient"><Star className="h-4 w-4 fill-on-dark text-on-dark" aria-hidden /></span>
          <span className="font-display">Pocket Guide Premium</span>
        </button>
        {items.map(([I, l]) => (
          <div key={l} className="relative flex min-h-12 items-center gap-3 overflow-hidden rounded-2xl border border-warm-border bg-on-dark px-4 text-navy">
            {ACCENT_ROWS.includes(l) && <span className="absolute inset-y-0 left-0 w-1 bg-terracotta" aria-hidden />}
            <I className="h-5 w-5 text-warm-brown" aria-hidden /> {l}
          </div>
        ))}
      </nav>
    </div>
  );
}

function Paywall({ copy, plans, selected, setSelected, highlight, launch, onClose, onCta }: {
  copy: { headline: string; sub: string }; plans: PlanId[]; selected: PlanId; setSelected: (p: PlanId) => void;
  highlight: PlanId; launch: boolean; onClose: () => void; onCta: () => void;
}) {
  return (
    <div className="pb-8">
      <div className="relative h-48 bg-sand">
        <img src={hero.url} alt="Paraglider over the Namib dunes near the coast" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/0 to-transparent" />
        <button onClick={onClose} aria-label="Close" className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-pgn-dark text-on-dark"><X className="h-5 w-5" /></button>
        <img src={logo.url} alt="Pocket Guide Namibia logo" className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2 translate-y-1/3 rounded-full bg-on-dark p-2 shadow-card" />
      </div>
      <div className="px-5 pt-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-warm-brown">Pocket Guide Premium</p>
        <h1 className="mt-1 text-center text-[28px] leading-tight text-navy">{copy.headline}</h1>
        <p className="mt-2 text-center text-muted-foreground">{copy.sub}</p>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-warm-brown">What you get</p>
        <ul className="mt-3 space-y-3">
          {BENEFITS.map((b) => { return (
            <li key={b.key} className="flex gap-3">
              <CheckCircle />
              <div className="min-w-0"><p className="text-navy">{b.title}</p>{"note" in b && <p className="text-xs text-muted-foreground">{b.note}</p>}</div>
            </li>); })}
        </ul>

        <div role="radiogroup" aria-label="Choose a plan" className="mt-6 space-y-3">
          {plans.map((id) => <PlanCard key={id} id={id} on={selected === id} best={highlight === id} launch={launch} onSelect={() => setSelected(id)} />)}
        </div>

        <button className="btn-cta mt-5 w-full text-lg" onClick={onCta}>{ctaLabel(selected)}</button>
        <p className="mt-3 text-center text-xs leading-relaxed text-navy" aria-live="polite">{disclosure(selected, launch)}</p>

        <div className="mt-3 flex flex-wrap justify-center gap-x-4 text-sm">
          <button className="min-h-11 font-bold text-link underline" onClick={() => toast("No previous purchases found (simulated)")}>Restore purchases</button>
          <a href="#" className="flex min-h-11 items-center text-link underline">Terms of Use</a>
          <a href="#" className="flex min-h-11 items-center text-link underline">Privacy Policy</a>
        </div>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-warm-brown">Always free</p>
        <div className="mt-2 flex gap-3 rounded-2xl border border-warm-border bg-sand p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-warm-brown" aria-label="Free features" />
          <p className="text-sm text-navy">Still free for everyone: offline map, 5 curated trips, road conditions forum, travel advice and emergency numbers.</p>
        </div>
        <div className="mt-3 flex gap-3 rounded-2xl border border-warm-border bg-on-dark p-4">
          <Leaf className="h-5 w-5 shrink-0 text-warm-brown" aria-label="Give back" />
          <p className="text-sm text-navy">A portion of every subscription goes directly to local conservation and community partners in Namibia.</p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-4 text-sm">
          <button className="min-h-11 text-link underline" onClick={() => toast("Opens the App Store redemption sheet")}>Have an offer code?</button>
          <a href="#" className="flex min-h-11 items-center text-link underline">Subscription terms</a>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ id, on, best, launch, onSelect }: { id: PlanId; on: boolean; best: boolean; launch: boolean; onSelect: () => void }) {
  const p = PLANS[id];
  return (
    <button role="radio" aria-checked={on} onClick={onSelect}
      className={`relative w-full rounded-2xl bg-on-dark p-4 text-left shadow-card transition ${on ? "border-2 border-terracotta" : "border border-warm-border m-px"}`}>
      <div className="flex flex-wrap gap-1.5">
        {best && <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-on-dark bg-navy">Best value</span>}
        {id === "yearly" && launch && <span className="rounded-full border border-warm-border px-2.5 py-0.5 text-xs font-bold text-terracotta-text">{LAUNCH_OFFER.label}</span>}
        {id === "trip_pass" && <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-warm-brown">One trip, no renewal</span>}
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg text-navy">{p.name}</p>
          {id === "yearly" && (<>
            <p className="text-navy">
              {launch && <><s className="text-muted-foreground">{money(p.price)}</s>{" "}<b>{money(LAUNCH_OFFER.firstYearPrice)}</b> first year</>}
              {!launch && <b>{money(p.price)}/year</b>}
            </p>
            {launch && <p className="text-sm text-muted-foreground">then {money(p.price)}/year</p>}
            <p className="text-sm text-muted-foreground">{p.trialDays}-day free trial</p>
          </>)}
          {id === "trip_pass" && <p className="text-sm text-muted-foreground"><b className="text-navy">{money(p.price)} once</b>, {p.days} days of Premium, does not auto-renew</p>}
          {id === "monthly" && <p className="text-sm text-muted-foreground"><b className="text-navy">{money(p.price)}/month</b>, cancel anytime</p>}
        </div>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 ${on ? "border-terracotta bg-terracotta text-on-dark" : "border-input-border"}`}>
          {on && <Check className="h-4 w-4" aria-hidden />}
        </span>
      </div>
    </button>
  );
}

function Success({ plan, onExplore, onManage }: { plan: PlanId; onExplore: () => void; onManage: () => void }) {
  return (
    <div className="flex min-h-full flex-col items-center px-6 pt-20 text-center">
      <span className="grid h-24 w-24 place-items-center rounded-full bg-gold-gradient shadow-card"><Star className="h-12 w-12 fill-on-dark text-on-dark" aria-label="Premium star" /></span>
      <h1 className="mt-6 text-3xl text-navy">Welcome to Premium</h1>
      <p className="mt-2 text-muted-foreground">{PLANS[plan].name} is active. Here's what's unlocked:</p>
      <BenefitChecklist />
      <button className="btn-cta mt-8 w-full" onClick={onExplore}>Explore Premium features</button>
      <button className="mt-2 min-h-11 w-full text-link underline" onClick={onManage}>Manage subscription</button>
    </div>
  );
}

function CheckCircle() {
  return <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-terracotta text-on-dark"><Check className="h-4 w-4" aria-hidden /></span>;
}

function BenefitChecklist() {
  return (
    <ul className="mt-6 w-full space-y-3 text-left">
      {BENEFITS.map((b) => (
        <li key={b.key} className="flex items-center gap-3 rounded-2xl border border-warm-border bg-on-dark p-3 text-navy">
          <CheckCircle /> {b.title}
        </li>
      ))}
    </ul>
  );
}

function Status({ kind, plan, onBack, onPrimary }: { kind: "active" | "expired"; plan: PlanId; onBack: () => void; onPrimary: () => void }) {
  const p = PLANS[plan];
  const dateLine = kind === "expired" ? `${p.name} ended on ${fmtDate(-3)}`
    : p.renews ? `Renews on ${fmtDate(p.id === "monthly" ? 30 : 365)}` : `Access ends on ${fmtDate(p.days ?? 60)}`;
  return (
    <div className="min-h-full px-6 pt-6 pb-8">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Back to menu" className="grid h-11 w-11 place-items-center rounded-full bg-pgn-dark text-on-dark"><Menu className="h-5 w-5" /></button>
        <p className="font-display text-[22px] text-terracotta">{kind === "active" ? "Premium active" : "Premium expired"}</p>
      </div>
      <div className="mt-4 flex flex-col items-center text-center">
        <span className={`grid h-20 w-20 place-items-center rounded-full ${kind === "active" ? "bg-gold-gradient" : "bg-toggle-off"}`}>
          <Star className="h-10 w-10 fill-on-dark text-on-dark" aria-label="Premium star" />
        </span>
        <h1 className="mt-5 text-2xl text-navy">{kind === "active" ? "You're a Premium user" : "Your Premium access has ended"}</h1>
        <p className="mt-1 font-display text-lg text-warm-brown">{p.name}</p>
        <p className="mt-3 w-full rounded-2xl border border-warm-border bg-sand p-3 text-sm text-navy">{dateLine}</p>
      </div>
      <div className={kind === "expired" ? "opacity-60" : ""}><BenefitChecklist /></div>
      <button className="btn-cta mt-8 w-full" onClick={onPrimary}>{kind === "active" ? "Manage subscription" : "Renew Premium"}</button>
      {kind === "active"
        ? <button className="mt-2 min-h-11 w-full text-link underline" onClick={() => toast("Purchases restored (simulated)")}>Restore purchases</button>
        : <button className="mt-2 min-h-11 w-full text-link underline" onClick={onPrimary}>View plans</button>}
    </div>
  );
}

function SavedTrip({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-full">
      <div className="relative h-72 bg-sand">
        <img src={hero.url} alt="" className="h-full w-full object-cover opacity-80" />
        <button onClick={onBack} aria-label="Back to menu" className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-pgn-dark text-on-dark"><Menu className="h-5 w-5" /></button>
      </div>
      <div className="p-5">
        <h1 className="text-2xl text-navy">Swakopmund → Sossusvlei</h1>
        <p className="text-muted-foreground">3 days · 4 stops · Custom trip</p>
      </div>
    </div>
  );
}

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="mb-1.5 text-xs uppercase tracking-wider text-ctl-sub">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <button key={v} onClick={() => onChange(v)} aria-pressed={value === v}
            className={`min-h-9 rounded-full border px-3 text-sm ${value === v ? "border-ctl-ink bg-ctl-ink text-ctl-panel" : "border-ctl-line bg-ctl-panel text-ctl-ink"}`}>{l}</button>
        ))}
      </div>
    </fieldset>
  );
}

function Controls(p: { onStyle: () => void;
  trigger: Trigger; applyTrigger: (t: Trigger) => void; launch: boolean; setLaunch: (b: boolean) => void;
  highlight: PlanId; setHighlight: (p: PlanId) => void; showMonthly: boolean; setShowMonthly: (b: boolean) => void;
  userState: UserState; applyUser: (u: UserState) => void;
}) {
  const [open, setOpen] = useState(true);
  const onoff: ["on" | "off", string][] = [["on", "ON"], ["off", "OFF"]];
  return (
    <aside className="m-4 rounded-2xl bg-ctl-panel p-5 text-ctl-ink shadow-card md:m-0 md:w-80">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-11 w-full items-center justify-between">
        <h2 className="text-lg text-ctl-ink">Prototype controls</h2>
        <ChevronDown className={`h-5 w-5 text-ctl-ink transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (<>
        <Seg label="Trigger context" value={p.trigger} onChange={p.applyTrigger}
          options={[["sidebar", "Sidebar"], ["trip3", "Trip #3"], ["pdf", "PDF export"], ["alerts", "Live alerts"], ["nudge", "Post-save nudge"]]} />
        <Seg label="Launch offer" value={p.launch ? "on" : "off"} onChange={(v) => p.setLaunch(v === "on")} options={onoff} />
        <Seg label="Highlighted plan" value={p.highlight} onChange={p.setHighlight}
          options={[["yearly", "Yearly"], ["trip_pass", "Trip Pass"], ["monthly", "Monthly"]]} />
        <Seg label="Show monthly plan" value={p.showMonthly ? "on" : "off"} onChange={(v) => p.setShowMonthly(v === "on")} options={onoff} />
        <Seg label="User state" value={p.userState} onChange={p.applyUser}
          options={[["free", "Free"], ["active", "Premium active"], ["expired", "Expired"]]} />
        <button onClick={p.onStyle} className="mt-5 min-h-11 w-full rounded-full border border-ctl-ink text-sm font-bold text-ctl-ink">Open Style preview</button>
        <p className="mt-4 text-xs text-ctl-sub">Design mock only. No real payments.</p>
      </>)}
    </aside>
  );
}
