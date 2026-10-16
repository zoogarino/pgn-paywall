import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Star, Heart, Map, RefreshCw, Compass, Construction, HelpCircle, Info, Settings, LogOut, Leaf, ShieldCheck, ChevronDown, Loader2, X, Wifi, BatteryFull, Signal } from "lucide-react";
import logo from "@/assets/pgnlogo.png.asset.json";
import hero from "@/assets/hero.jpg.asset.json";
import { StylePreview } from "@/components/StylePreview";
import { Action, Primary, Back, Checklist, PremiumStar, PurchaseLinks, Restore, Sheet, Toggle } from "@/components/PremiumUI";
import { MapScreen, FilterSheet, type MapFilter } from "@/components/PremiumMap";
import { PLANS, PLAN_ORDER, DEFAULT_HIGHLIGHTED_PLAN, DEFAULT_SETTINGS, PREMIUM_ACCENT, LIVE_ALERTS_RELEASE_LABEL, COPY, TRIGGER_COPY, ctaLabel, disclosure, priceLabel, summary, yearlySaving, planExtras, nudgeCopy, alertsSheetTitle, launchEnabled, fmtDate, type PlanId, type Trigger, type UserState, type OfferSettings, type AlertsStatus, type PremiumAccent } from "@/lib/paywall-config";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Pocket Guide Premium — Namibia travel plans" },
    { name: "description", content: "Explore Pocket Guide Namibia Premium plans, trip passes, map filtering and upcoming location alerts." },
    { property: "og:title", content: "Pocket Guide Premium — Namibia travel plans" },
    { property: "og:description", content: "Explore Namibia with custom trips, printable itineraries and Premium map filtering." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Prototype,
});
type Screen = "sidebar" | "paywall" | "success" | "active" | "expired" | "saved" | "style" | "map" | "alerts" | "rental" | "inquiry_sent";
type SheetKind = "none" | "checkout" | "processing" | "notify" | "map_locked" | "filter" | "nudge";
function Prototype() {
  const [trigger, setTrigger] = useState<Trigger>("sidebar");
  const [settings, setSettings] = useState<OfferSettings>(DEFAULT_SETTINGS);
  const [accent, setAccent] = useState<PremiumAccent>(PREMIUM_ACCENT);
  const [highlight, setHighlight] = useState<PlanId>(DEFAULT_HIGHLIGHTED_PLAN);
  const [showMonthly, setShowMonthly] = useState(true);
  const [userState, setUserState] = useState<UserState>("free");
  const [screen, setScreen] = useState<Screen>("sidebar");
  const [returnScreen, setReturnScreen] = useState<Screen>("sidebar");
  const [selected, setSelected] = useState<PlanId>(DEFAULT_HIGHLIGHTED_PLAN);
  const [purchased, setPurchased] = useState<PlanId>(DEFAULT_HIGHLIGHTED_PLAN);
  const [sheet, setSheet] = useState<SheetKind>("none");
  const [notified, setNotified] = useState(false);
  const [alertsOn, setAlertsOn] = useState(false);
  const [filter, setFilter] = useState<MapFilter>(null);
  const [rentalNudge, setRentalNudge] = useState(false);
  const paymentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (paymentTimer.current) clearTimeout(paymentTimer.current); }, []);
  useEffect(() => { if (userState !== "active") { setFilter(null); setAlertsOn(false); } }, [userState]);
  useEffect(() => { if (settings.alerts === "coming_soon") setAlertsOn(false); if (sheet === "notify" && settings.alerts !== "coming_soon") setSheet("none"); }, [settings.alerts, sheet]);
  useEffect(() => { if (!showMonthly && selected === "monthly") setSelected("trip_pass"); }, [showMonthly, selected]);
  useEffect(() => {
    setRentalNudge(false);
    if (screen !== "inquiry_sent" || userState !== "free") return;
    const timer = setTimeout(() => setRentalNudge(true), 1500);
    return () => clearTimeout(timer);
  }, [screen, userState]);
  const dismiss = () => { if (paymentTimer.current) clearTimeout(paymentTimer.current); setSheet("none"); };
  const openPaywall = (t: Trigger, from: Screen = screen) => { dismiss(); setTrigger(t); setReturnScreen(from); setScreen("paywall"); };
  const applyTrigger = (t: Trigger) => {
    dismiss(); setTrigger(t); setRentalNudge(false);
    if (t === "sidebar") setScreen("sidebar");
    else if (t === "map") setScreen("map");
    else if (t === "rental") setScreen("rental");
    else if (t === "alerts") { setScreen("alerts"); if (settings.alerts === "coming_soon") setSheet("notify"); else if (userState !== "active") openPaywall(t, "alerts"); }
    else if (t === "nudge") { setScreen("saved"); if (userState === "free") setSheet("nudge"); }
    else if (userState === "active") { setScreen("saved"); toast(t === "pdf" ? "PDF export is available (simulated)" : "New trip created (simulated)"); }
    else openPaywall(t, "sidebar");
  };
  const applyUser = (u: UserState) => { setUserState(u); dismiss(); setRentalNudge(false); if (u !== "active") { setFilter(null); setAlertsOn(false); } setScreen(u === "active" ? "active" : u === "expired" ? "expired" : "sidebar"); };
  const confirm = () => { setSheet("processing"); paymentTimer.current = setTimeout(() => { setSheet("none"); setPurchased(selected); setUserState("active"); setScreen("success"); }, 1400); };
  const back = () => { dismiss(); setScreen("sidebar"); };
  const chooseHighlight = (p: PlanId) => { setHighlight(p); setSelected(p === "monthly" && !showMonthly ? "trip_pass" : p); };
  const changeSetting = <K extends keyof OfferSettings>(key: K, value: OfferSettings[K]) => setSettings(s => ({ ...s, [key]: value }));
  return <main className="min-h-screen bg-ctl-bg md:flex md:items-start md:justify-center md:gap-8 md:p-8">
    <div data-testid="phone" className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-parchment md:h-[844px] md:w-[390px] md:shrink-0 md:rounded-[44px] md:border-[10px] md:border-pgn-dark md:shadow-card">
      <div className="flex h-9 shrink-0 items-center justify-between bg-pgn-blue px-6 text-sm font-bold text-on-dark" aria-hidden="true"><span>9:41</span><span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" /></span></div>
      <div key={screen} className="min-h-0 flex-1 overflow-y-auto">
        {screen === "sidebar" && <Sidebar userState={userState} accent={accent} onPremium={() => userState === "free" ? openPaywall("sidebar") : setScreen(userState === "active" ? "active" : "expired")} onMap={() => setScreen("map")} onAlerts={() => applyTrigger("alerts")} onRental={() => setScreen("rental")} />}
        {screen === "paywall" && <Paywall trigger={trigger} settings={settings} selected={selected} highlight={highlight} plans={PLAN_ORDER.filter(p => showMonthly || p !== "monthly")} onSelect={setSelected} onClose={() => setScreen(returnScreen)} />}
        {(screen === "active" || screen === "expired" || screen === "success") && <Status kind={screen} plan={purchased} settings={settings} accent={accent} notified={notified} onBack={back} onPlans={() => { setSelected(purchased); openPaywall("sidebar"); }} onMap={() => setScreen("map")} />}
        {screen === "saved" && <div><img src={hero.url} alt="Namib dunes" className="h-64 w-full object-cover" /><div className="p-5"><Back title="Trip saved" onBack={back} /><h2 className="mt-5 text-2xl">Swakopmund → Sossusvlei</h2><p className="text-pgn-muted">3 days · 4 stops · Custom trip</p></div></div>}
        {screen === "style" && <StylePreview onBack={back} />}
        {screen === "map" && <MapScreen onBack={back} filter={filter} clear={() => setFilter(null)} accent={accent} premium={userState === "active"} onFilter={() => setSheet(userState === "active" ? "filter" : "map_locked")} />}
        {screen === "alerts" && <div className="p-5"><Back title="Live location alerts" onBack={back} /><div className="mt-8 flex items-center justify-between gap-3"><p className="text-sm">{settings.alerts === "coming_soon" ? `Coming ${LIVE_ALERTS_RELEASE_LABEL}` : "Live location alerts"}</p><Toggle label="Enable live location alerts" on={alertsOn} onChange={on => { if (settings.alerts === "coming_soon") setSheet("notify"); else if (userState !== "active") openPaywall("alerts"); else setAlertsOn(on); }} /></div><p className="mt-4 text-sm text-pgn-muted">{TRIGGER_COPY.alerts.sub}</p>{notified && <p className="mt-6 text-sm text-success">{COPY.notifyRow}</p>}</div>}
        {screen === "rental" && <RentalForm onBack={back} onSubmit={() => setScreen("inquiry_sent")} />}
        {screen === "inquiry_sent" && <div className="p-5"><Back title={COPY.rentalSent} onBack={back} /><ShieldCheck className="mx-auto mt-16 h-16 w-16 text-success" /><h2 className="mt-5 text-center text-2xl">{COPY.rentalSent}</h2><p className="mt-3 text-center text-pgn-muted">{COPY.rentalConfirmation}</p></div>}
      </div>
      {screen === "paywall" && <footer className="shrink-0 border-t border-warm-border bg-parchment px-4 pb-2 pt-3"><Primary onClick={() => setSheet("checkout")}>{ctaLabel(selected, settings)}</Primary><p className="mt-2 text-center text-[11px] leading-tight text-navy" aria-live="polite">{summary(selected, settings)}</p><PurchaseLinks /></footer>}
      {rentalNudge && screen === "inquiry_sent" && userState === "free" && <section aria-label="Rental Premium offer" className="absolute bottom-4 left-3 right-3 rounded-lg border border-warm-border bg-on-dark p-4 shadow-card"><p className="text-sm text-navy">{COPY.rentalNudge}</p><div className="mt-3 flex gap-2"><Primary onClick={() => { setRentalNudge(false); openPaywall("rental"); }}>{COPY.seePremium}</Primary><Action className="shrink-0 text-link" onClick={() => setRentalNudge(false)}>{COPY.notNow}</Action></div></section>}
      {sheet === "notify" && <Sheet label={alertsSheetTitle()} onDismiss={dismiss}><h2 className="pr-3 text-xl">{alertsSheetTitle()}</h2><p className="mt-3 text-sm text-pgn-muted">{COPY.alertsBody}</p><Primary className="mt-5" onClick={() => setNotified(true)} disabled={notified}>{notified ? COPY.notified : COPY.notify}</Primary><Action className="mt-2 min-h-11 w-full text-navy" onClick={dismiss}>{COPY.notNow}</Action>{userState !== "active" && <Action className="w-full text-link underline" onClick={() => openPaywall("alerts")}>{COPY.seePlans}</Action>}</Sheet>}
      {(sheet === "map_locked" || sheet === "nudge") && <Sheet label={sheet === "map_locked" ? TRIGGER_COPY.map.headline : "Trip saved"} onDismiss={dismiss}><h2 className="text-xl">{sheet === "map_locked" ? TRIGGER_COPY.map.headline : "Trip saved"}</h2><p className="mt-3 text-sm text-pgn-muted">{sheet === "map_locked" ? TRIGGER_COPY.map.sub : nudgeCopy(settings)}</p><Primary className="mt-5" onClick={() => openPaywall(sheet === "map_locked" ? "map" : "nudge")}>{COPY.seePremium}</Primary><Action className="mt-2 min-h-11 w-full text-navy" onClick={dismiss}>{COPY.notNow}</Action></Sheet>}
      {sheet === "filter" && userState === "active" && <FilterSheet filter={filter} apply={setFilter} onDismiss={dismiss} />}
      {(sheet === "checkout" || sheet === "processing") && <Sheet neutral label="Checkout" onDismiss={dismiss}>{sheet === "processing" ? <div role="status" className="flex flex-col items-center py-10"><Loader2 className="h-10 w-10 animate-spin motion-reduce:animate-none" /><p className="mt-3">Processing…</p></div> : <><p className="text-xs text-ctl-sub">App Store / Google Play checkout, simulated</p><div className="mt-4 flex items-center gap-3"><img src={logo.url} alt="" className="h-12 w-12" /><h2 className="text-xl">{PLANS[selected].name}</h2></div><p className="mt-3 font-bold">{priceLabel(selected, settings)}</p><p className="mt-3 text-xs text-ctl-sub">{disclosure(selected, settings)}</p><Primary className="mt-5" onClick={confirm}>Confirm</Primary><Action className="mt-2 min-h-11 w-full" onClick={dismiss}>Cancel</Action></>}</Sheet>}
    </div>
    <Controls trigger={trigger} applyTrigger={applyTrigger} settings={settings} changeSetting={changeSetting} highlight={highlight} setHighlight={chooseHighlight} showMonthly={showMonthly} setShowMonthly={setShowMonthly} userState={userState} applyUser={applyUser} accent={accent} setAccent={setAccent} resetNotify={() => setNotified(false)} onStyle={() => { dismiss(); setScreen("style"); }} />
  </main>;
}
function Sidebar({ userState, accent, onPremium, onMap, onAlerts, onRental }: { userState: UserState; accent: PremiumAccent; onPremium: () => void; onMap: () => void; onAlerts: () => void; onRental: () => void }) {
  const items = [[Heart, "Favorites"], [Map, "Map Options"], [RefreshCw, "Update Map"], [Compass, "Travel Advice"], [Construction, "Road Condition Updates"], [HelpCircle, "How to use the App"], [Info, "About app"], [Settings, "Settings"], [LogOut, "Logout"]] as const;
  return <div className="min-h-full"><div className="bg-navy px-5 pb-6 pt-8"><div className="flex items-center gap-3"><img src={logo.url} alt="Pocket Guide Namibia logo" className="h-14 w-14 rounded-full bg-on-dark p-1.5" /><div><p className="font-display text-lg text-on-dark">Traveller</p><p className="text-sm text-on-dark">{userState === "active" ? "Premium" : "Free plan"}</p></div></div></div><nav className="space-y-2 p-3"><Action onClick={onPremium} className={`min-h-12 w-full justify-start rounded-2xl px-4 text-navy ${accent === "gold" ? "gold-outline" : "border-2 border-terracotta"}`}><PremiumStar accent={accent} /><span className="font-display">Pocket Guide Premium</span></Action>{items.map(([Icon, label]) => <Action key={label} onClick={label === "Map Options" ? onMap : label === "Settings" ? onAlerts : () => toast(`${label} (prototype)`)} className="relative min-h-12 w-full justify-start overflow-hidden rounded-2xl border border-warm-border bg-on-dark px-4 text-navy">{["Travel Advice", "How to use the App", "About app", "Settings"].includes(label) && <span className="absolute inset-y-0 left-0 w-1 bg-terracotta" />}<Icon className="text-warm-brown" />{label}</Action>)}<Action onClick={onMap} className="min-h-11 w-full text-link">Open map</Action><Action onClick={onRental} className="min-h-11 w-full text-link">{COPY.rentalTitle}</Action></nav></div>;
}
function Paywall({ trigger, settings, selected, highlight, plans, onSelect, onClose }: { trigger: Trigger; settings: OfferSettings; selected: PlanId; highlight: PlanId; plans: PlanId[]; onSelect: (p: PlanId) => void; onClose: () => void }) {
  const copy = TRIGGER_COPY[trigger];
  return <div className="pb-6"><div className="relative h-44 bg-sand"><img src={hero.url} alt="Paraglider over Namib dunes" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/0 to-transparent" /><Action onClick={onClose} aria-label="Close paywall" className="absolute left-4 top-4 h-11 w-11 rounded-full bg-pgn-dark p-0 text-on-dark"><X /></Action><img src={logo.url} alt="Pocket Guide Namibia logo" className="absolute bottom-0 left-1/2 h-16 w-16 -translate-x-1/2 translate-y-1/3 rounded-full bg-on-dark p-2" /></div><div className="px-4 pt-8"><p className="text-center text-xs text-warm-brown">Pocket Guide Premium</p><h1 className="mt-2 text-center text-[28px] leading-tight">{copy.headline}</h1><p className="mt-2 text-center text-sm text-pgn-muted">{copy.sub}</p><div role="radiogroup" aria-label="Choose a plan" className="mt-6 space-y-3">{plans.map(id => <PlanCard key={id} id={id} settings={settings} on={selected === id} best={highlight === id} onSelect={() => onSelect(id)} />)}</div><p className="mt-4 text-xs leading-relaxed text-pgn-muted">{COPY.alertsDisclaimer}</p><div className="mt-5 flex gap-2 border-y border-warm-border py-4"><ShieldCheck className="h-5 w-5 shrink-0 text-warm-brown" /><p className="text-xs leading-relaxed">{COPY.alwaysFree}</p></div><div className="mt-4 flex gap-2"><Leaf className="h-4 w-4 shrink-0 text-warm-brown" /><p className="text-xs text-pgn-muted">{COPY.conservation}</p></div><p className="mt-4 text-center text-xs text-pgn-muted">{COPY.sharedCancellation}</p></div></div>;
}
function PlanCard({ id, on, best, settings, onSelect }: { id: PlanId; on: boolean; best: boolean; settings: OfferSettings; onSelect: () => void }) {
  const dark = id === "trip_pass";
  return <Action role="radio" aria-checked={on} onClick={onSelect} className={`block w-full rounded-lg border-2 p-4 text-left shadow-card ${on ? "border-terracotta" : "border-warm-border"} ${dark ? "bg-navy text-on-dark" : "bg-on-dark text-navy"}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0">{best && id === "trip_pass" && <span className="mb-2 inline-block rounded bg-sand px-2 py-1 text-xs text-navy">{COPY.best}</span>}{id === "yearly" && launchEnabled(settings) && <span className="mb-2 inline-block rounded bg-sand px-2 py-1 text-xs text-terracotta-text">{COPY.launchBadge}</span>}<h2 className="text-xl">{PLANS[id].name}</h2></div><span className={`mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${on ? "border-terracotta bg-terracotta" : dark ? "border-on-dark" : "border-input-border"}`} /></div><p className="mt-2 text-lg font-bold leading-snug">{priceLabel(id, settings)}</p>{id === "yearly" && <p className="mt-2 text-xs leading-relaxed text-pgn-muted">{yearlySaving(settings)}</p>}<Checklist plan={id} settings={settings} extras={planExtras(id, settings)} dark={dark} /><p className={`mt-4 border-t pt-3 text-xs leading-relaxed ${dark ? "border-on-dark/25" : "border-warm-border"}`}>{disclosure(id, settings)}</p>{id !== "trip_pass" && <p className="mt-2 text-xs text-pgn-muted">{COPY.cancellation}</p>}</Action>;
}
function Status({ kind, plan, settings, accent, notified, onBack, onPlans, onMap }: { kind: "active" | "expired" | "success"; plan: PlanId; settings: OfferSettings; accent: PremiumAccent; notified: boolean; onBack: () => void; onPlans: () => void; onMap: () => void }) {
  const expired = kind === "expired";
  const title = kind === "success" ? "Welcome to Premium" : expired ? "Premium expired" : "Premium active";
  const date = expired ? `${PLANS[plan].name} ended on ${fmtDate(-3)}` : plan === "trip_pass" ? `Access ends on ${fmtDate(PLANS.trip_pass.days)}` : `Renews on ${fmtDate(plan === "monthly" ? 30 : settings.trial ? PLANS.yearly.trialDays : 365)}`;
  return <div className="p-5"><Back title={title} onBack={onBack} /><div className="mt-8 flex flex-col items-center text-center"><PremiumStar accent={accent} large /><h2 className="mt-5 text-2xl">{expired ? plan === "trip_pass" ? COPY.expiredPass : COPY.expiredPremium : kind === "success" ? title : "You're a Premium user"}</h2><p className="mt-2 font-display text-lg text-warm-brown">{PLANS[plan].name}</p><p className="mt-3 w-full rounded-lg border border-warm-border bg-sand p-3 text-sm">{date}</p></div><div className={`mt-5 ${expired ? "opacity-60" : ""}`}><Checklist plan={plan} settings={settings} /></div>{notified && <p className="mt-4 text-sm text-pgn-muted">{COPY.notifyRow}</p>}<Primary className="mt-7" onClick={expired ? onPlans : onMap}>{expired ? plan === "trip_pass" ? COPY.anotherPass : "Renew Premium" : "Explore Premium features"}</Primary>{expired ? <Action className="mt-2 min-h-11 w-full text-link underline" onClick={onPlans}>{COPY.viewPlans}</Action> : <Action className="mt-2 min-h-11 w-full text-link underline" onClick={plan === "trip_pass" ? onBack : () => toast("Opens App Store / Google Play subscription settings")}>{plan === "trip_pass" ? "View access details" : "Manage subscription"}</Action>}<div className="text-center"><Restore /></div></div>;
}
function RentalForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return <div className="p-5"><Back title={COPY.rentalTitle} onBack={onBack} /><form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="mt-7 space-y-5">{[["Name", "text"], ["Pick-up date", "date"], ["Return date", "date"]].map(([label, type]) => <label className="block text-sm text-warm-brown" key={label}>{label}<input required name={label} type={type} className="mt-2 h-12 w-full rounded-lg border border-input-border bg-on-dark px-3 text-navy" /></label>)}<Primary type="submit">Submit</Primary></form></div>;
}
function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return <fieldset className="mt-4"><legend className="mb-1.5 text-xs text-ctl-sub">{label}</legend><div className="flex flex-wrap gap-1.5">{options.map(([v, l]) => <Action key={v} onClick={() => onChange(v)} aria-pressed={value === v} className={`min-h-9 rounded-full border px-3 text-sm ${value === v ? "border-ctl-ink bg-ctl-ink text-ctl-panel" : "border-ctl-line bg-ctl-panel text-ctl-ink"}`}>{l}</Action>)}</div></fieldset>;
}
function Controls(p: { trigger: Trigger; applyTrigger: (t: Trigger) => void; settings: OfferSettings; changeSetting: <K extends keyof OfferSettings>(k: K, v: OfferSettings[K]) => void; highlight: PlanId; setHighlight: (p: PlanId) => void; showMonthly: boolean; setShowMonthly: (b: boolean) => void; userState: UserState; applyUser: (u: UserState) => void; accent: PremiumAccent; setAccent: (a: PremiumAccent) => void; resetNotify: () => void; onStyle: () => void }) {
  const [open, setOpen] = useState(true);
  return <aside className="m-4 rounded-lg bg-ctl-panel p-5 text-ctl-ink shadow-card md:m-0 md:w-80"><Action onClick={() => setOpen(!open)} aria-expanded={open} className="min-h-11 w-full justify-between px-0 text-ctl-ink"><h2 className="text-lg">Prototype controls</h2><ChevronDown className={open ? "rotate-180" : ""} /></Action>{open && <><Seg label="Trigger context" value={p.trigger} onChange={p.applyTrigger} options={[["sidebar", "Sidebar"], ["trip3", "Trip #3"], ["pdf", "PDF export"], ["alerts", "Live alerts"], ["nudge", "Post-save nudge"], ["map", "Map filter"], ["rental", "Rental inquiry"]]} /><Seg label="Highlighted plan" value={p.highlight} onChange={p.setHighlight} options={[["trip_pass", "Trip Pass"], ["yearly", "Yearly"], ["monthly", "Monthly"]]} />{([["launch", "Yearly launch price"], ["trial", "Yearly free trial"], ["rental", "Rental discount line"]] as const).map(([key, label]) => <div key={key} className="mt-4 flex items-center justify-between text-sm"><span>{label}</span><Toggle label={label} on={p.settings[key]} onChange={on => p.changeSetting(key, on)} /></div>)}<div className="mt-4 flex items-center justify-between text-sm"><span>Show monthly plan</span><Toggle label="Show monthly plan" on={p.showMonthly} onChange={p.setShowMonthly} /></div><Seg<AlertsStatus> label="Live alerts status" value={p.settings.alerts} onChange={v => p.changeSetting("alerts", v)} options={[["coming_soon", "Coming soon"], ["early_access", "Early access"], ["released", "Released"]]} /><Seg label="Premium accent" value={p.accent} onChange={p.setAccent} options={[["gold", "Gold"], ["terracotta", "Terracotta"]]} /><Seg label="User state" value={p.userState} onChange={p.applyUser} options={[["free", "Free"], ["active", "Premium active"], ["expired", "Expired"]]} /><Action onClick={p.resetNotify} className="mt-4 min-h-11 w-full rounded-full border border-ctl-line text-ctl-ink">Reset Notify me</Action><Action onClick={p.onStyle} className="mt-2 min-h-11 w-full rounded-full border border-ctl-ink text-ctl-ink">Open Style preview</Action><p className="mt-4 text-xs text-ctl-sub">Design mock only. No real payments or notification signup.</p></>}</aside>;
}
