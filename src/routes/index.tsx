import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Clock, Heart, Map, RefreshCw, Compass, Construction, HelpCircle, Info, Settings, LogOut, Leaf, ShieldCheck, ChevronDown, Loader2, X, Wifi, BatteryFull, Signal, BadgeCheck, SlidersHorizontal } from "lucide-react";
import logo from "@/assets/pgnlogo.png.asset.json";
import hero from "@/assets/hero.jpg.asset.json";
import { StylePreview } from "@/components/StylePreview";
import { Action, Primary, Back, Checklist, PremiumStar, PurchaseLinks, Restore, Sheet, Toggle } from "@/components/PremiumUI";
import { MapScreen, FilterSheet, type MapFilter } from "@/components/PremiumMap";
import { PLANS, DEFAULT_SETTINGS, LIVE_ALERTS_RELEASE_LABEL, RENEWAL_REMINDER_DAYS, FEATURE_NAMES, COPY, TRIGGER_COPY, ctaLabel, disclosure, priceParts, priceLabel, summary, nudgeCopy, alertsSheetTitle, fmtDate, visiblePlans, resolveHighlight, finePrint, badgeText, trialLine, paywallCopy, paywallFeatures, type PaywallFeature, renewalLine, reminderLine, money, type PlanId, type Trigger, type UserState, type OfferSettings, type AlertsStatus, type SkyStatus } from "@/lib/paywall-config";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Pocket Guide Premium — Namibia travel plans" },
    { name: "description", content: "Explore the Pocket Guide Namibia Premium founding-member offer: custom trips, PDF export, Location filter and Sky Outlook." },
    { property: "og:title", content: "Pocket Guide Premium — Namibia travel plans" },
    { property: "og:description", content: "Explore Namibia with custom trips, printable itineraries, map filtering and Sky Outlook." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Prototype,
});
type Screen = "sidebar" | "paywall" | "success" | "active" | "expired" | "saved" | "style" | "map" | "alerts" | "rental" | "inquiry_sent";
type SheetKind = "none" | "checkout" | "processing" | "notify" | "sky_notify" | "map_locked" | "filter" | "nudge" | "manage";
type Notified = { alerts: boolean; sky: boolean };
function Prototype() {
  const [trigger, setTrigger] = useState<Trigger>("sidebar");
  const [settings, setSettings] = useState<OfferSettings>(DEFAULT_SETTINGS);
  const [highlightPref, setHighlightPref] = useState<PlanId | null>(null);
  const [userState, setUserState] = useState<UserState>("free");
  const [screen, setScreen] = useState<Screen>("sidebar");
  const [returnScreen, setReturnScreen] = useState<Screen>("sidebar");
  const plans = visiblePlans(settings);
  const highlight = resolveHighlight(highlightPref, settings);
  const [selectedPref, setSelected] = useState<PlanId | null>(null);
  const selected = selectedPref && plans.includes(selectedPref) ? selectedPref : highlight;
  const [purchased, setPurchased] = useState<PlanId>("yearly");
  const [sheet, setSheet] = useState<SheetKind>("none");
  const [notified, setNotified] = useState<Notified>({ alerts: false, sky: false });
  const [alertsOn, setAlertsOn] = useState(false);
  const [skyOn, setSkyOn] = useState(false);
  const [filter, setFilter] = useState<MapFilter>(null);
  const [rentalPopup, setRentalPopup] = useState(false);
  const [rentalShown, setRentalShown] = useState(false);
  const [reminderHidden, setReminderHidden] = useState(false);
  const paymentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (paymentTimer.current) clearTimeout(paymentTimer.current); }, []);
  useEffect(() => { if (userState !== "active") { setFilter(null); setAlertsOn(false); setSkyOn(false); } }, [userState]);
  useEffect(() => { if (settings.alerts === "coming_soon") setAlertsOn(false); if (sheet === "notify" && settings.alerts !== "coming_soon") setSheet("none"); }, [settings.alerts, sheet]);
  useEffect(() => { if (settings.sky === "coming_soon") setSkyOn(false); if (sheet === "sky_notify" && settings.sky !== "coming_soon") setSheet("none"); }, [settings.sky, sheet]);
  // Rental pop-up: immediately on the inquiry screen, once per session, free/expired only.
  useEffect(() => {
    if (screen === "rental" && userState !== "active" && !rentalShown) { setRentalPopup(true); setRentalShown(true); }
    if (screen !== "rental" || userState === "active") setRentalPopup(false);
  }, [screen, userState, rentalShown]);
  const dismiss = () => { if (paymentTimer.current) clearTimeout(paymentTimer.current); setSheet("none"); };
  const openPaywall = (t: Trigger, from: Screen = screen) => { dismiss(); setTrigger(t); setReturnScreen(from); setScreen("paywall"); };
  const tapAlerts = (on: boolean) => { if (settings.alerts === "coming_soon") setSheet("notify"); else if (userState !== "active") openPaywall("alerts", "alerts"); else setAlertsOn(on); };
  const tapSky = (on: boolean) => { if (settings.sky === "coming_soon") setSheet("sky_notify"); else if (userState !== "active") openPaywall("sky", "alerts"); else setSkyOn(on); };
  const applyTrigger = (t: Trigger) => {
    dismiss(); setTrigger(t);
    if (t === "sidebar") setScreen("sidebar");
    else if (t === "map") setScreen("map");
    else if (t === "rental") setScreen("rental");
    else if (t === "alerts") { setScreen("alerts"); if (settings.alerts === "coming_soon") setSheet("notify"); else if (userState !== "active") openPaywall(t, "alerts"); }
    else if (t === "sky") { setScreen("alerts"); if (settings.sky === "coming_soon") setSheet("sky_notify"); else if (userState !== "active") openPaywall(t, "alerts"); }
    else if (t === "nudge") { setScreen("saved"); if (userState === "free") setSheet("nudge"); }
    else if (userState === "active") { setScreen("saved"); toast(t === "pdf" ? "PDF export is available (simulated)" : "New trip created (simulated)"); }
    else openPaywall(t, "sidebar");
  };
  const applyUser = (u: UserState) => { setUserState(u); setSettings(st => ({ ...st, eligible: u !== "expired" })); dismiss(); if (u !== "active") { setFilter(null); setAlertsOn(false); setSkyOn(false); } setScreen(u === "active" ? "active" : u === "expired" ? "expired" : "sidebar"); };
  const confirm = () => { setSheet("processing"); paymentTimer.current = setTimeout(() => { setSheet("none"); setPurchased(selected); setUserState("active"); setScreen("success"); }, 1400); };
  const back = () => { dismiss(); setScreen("sidebar"); };
  const changeSetting = <K extends keyof OfferSettings>(key: K, value: OfferSettings[K]) => setSettings(s => ({ ...s, [key]: value }));
  // Active/expired copy uses the Trip Pass only when it is shown and was the plan bought.
  const statusPlan: PlanId = purchased === "trip_pass" && !settings.showTripPass ? "yearly" : purchased === "monthly" && !settings.showMonthly ? "yearly" : purchased;
  return <main className="min-h-screen bg-ctl-bg md:flex md:items-start md:justify-center md:gap-8 md:p-8">
    {/* Mobile: the phone fills the viewport, so the controls panel sits below the fold — floating button scrolls to it. */}
    <button type="button" onClick={() => document.getElementById("controls")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="fixed bottom-4 right-4 z-40 flex min-h-11 items-center gap-1.5 rounded-full bg-ctl-ink px-4 text-sm font-medium text-ctl-panel shadow-card md:hidden">Controls<SlidersHorizontal className="h-4 w-4" /></button>
    <div data-testid="phone" className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-parchment md:h-[844px] md:w-[390px] md:shrink-0 md:rounded-[44px] md:border-[10px] md:border-pgn-dark md:shadow-card">
      <div className="flex h-9 shrink-0 items-center justify-between bg-pgn-blue px-6 text-sm font-bold text-on-dark" aria-hidden="true"><span>9:41</span><span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /><Wifi className="h-4 w-4" /><BatteryFull className="h-5 w-5" /></span></div>
      <div key={screen} className="min-h-0 flex-1 overflow-y-auto">
        {screen === "sidebar" && <Sidebar userState={userState} onPremium={() => userState === "free" ? openPaywall("sidebar") : setScreen(userState === "active" ? "active" : "expired")} onMap={() => setScreen("map")} onAlerts={() => setScreen("alerts")} onRental={() => setScreen("rental")} />}
        {screen === "paywall" && <Paywall trigger={trigger} settings={settings} selected={selected} highlight={highlight} plans={plans} onSelect={setSelected} onClose={() => setScreen(returnScreen)} />}
        {(screen === "active" || screen === "expired" || screen === "success") && <Status kind={screen} plan={statusPlan} settings={settings} notified={notified} reminder={settings.reminder && !reminderHidden} hideReminder={() => setReminderHidden(true)} onManage={() => setSheet("manage")} onBack={back} onPlans={() => openPaywall("sidebar")} onMap={() => setScreen("map")} />}
        {screen === "saved" && <div><img src={hero.url} alt="Namib dunes" className="h-64 w-full object-cover" /><div className="p-5"><Back title="Trip saved" onBack={back} /><h2 className="mt-5 text-2xl">Swakopmund → Sossusvlei</h2><p className="text-pgn-muted">3 days · 4 stops · Custom trip</p></div></div>}
        {screen === "style" && <StylePreview onBack={back} />}
        {screen === "map" && <MapScreen onBack={back} filter={filter} clear={() => setFilter(null)} premium={userState === "active"} onFilter={() => setSheet(userState === "active" ? "filter" : "map_locked")} />}
        {screen === "alerts" && <div className="p-5"><Back title="Alerts" onBack={back} />
          <div className="mt-8 flex items-center justify-between gap-3"><div><p className="text-sm">{FEATURE_NAMES.live_alerts.name}</p><p className="text-xs text-pgn-muted">{settings.alerts === "coming_soon" ? COPY.alertsPlannedLine : FEATURE_NAMES.live_alerts.desc}</p></div><Toggle label={`Enable ${FEATURE_NAMES.live_alerts.name}`} on={alertsOn} onChange={tapAlerts} /></div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-warm-border pt-5"><div><p className="text-sm">{FEATURE_NAMES.sky_alerts.name}</p><p className="text-xs text-pgn-muted">{settings.sky === "coming_soon" ? COPY.comingSoon : FEATURE_NAMES.sky_alerts.desc}</p></div><Toggle label={`Enable ${FEATURE_NAMES.sky_alerts.name}`} on={skyOn} onChange={tapSky} /></div>
          {notified.alerts && <p className="mt-6 text-sm text-success">{COPY.notifyRow(FEATURE_NAMES.live_alerts.name)}</p>}
          {notified.sky && <p className="mt-2 text-sm text-success">{COPY.notifyRow(FEATURE_NAMES.sky_alerts.name)}</p>}</div>}
        {screen === "rental" && <RentalForm premium={userState === "active"} onBack={back} onSubmit={() => setScreen("inquiry_sent")} />}
        {screen === "inquiry_sent" && <div className="p-5"><Back title={COPY.rentalSent} onBack={back} /><ShieldCheck className="mx-auto mt-16 h-16 w-16 text-success" /><h2 className="mt-5 text-center text-2xl">{COPY.rentalSent}</h2><p className="mt-3 text-center text-pgn-muted">{COPY.rentalConfirmation}</p></div>}
      </div>
      {screen === "paywall" && <footer className="shrink-0 border-t border-warm-border bg-parchment px-4 pb-2 pt-3"><Primary onClick={() => setSheet("checkout")}>{ctaLabel(selected, settings)}</Primary><p className="mt-2 text-center text-[11px] leading-tight text-pgn-muted" aria-live="polite">{summary(selected, settings)}</p><PurchaseLinks /></footer>}
      {rentalPopup && screen === "rental" && <section aria-label="Rental Premium offer" className="absolute bottom-4 left-3 right-3 animate-in slide-in-from-bottom rounded-lg border border-warm-border bg-on-dark p-4 shadow-card motion-reduce:animate-none"><Action aria-label="Dismiss" className="absolute right-1 top-1 h-9 w-9 p-0 text-pgn-muted" onClick={() => setRentalPopup(false)}><X /></Action><p className="pr-6 text-sm text-navy">{COPY.rentalNudge}</p><div className="mt-3 flex gap-2"><Primary onClick={() => { setRentalPopup(false); openPaywall("rental"); }}>{COPY.seePremium}</Primary><Action className="shrink-0 text-link" onClick={() => setRentalPopup(false)}>{COPY.notNow}</Action></div></section>}
      {sheet === "notify" && <NotifySheet title={alertsSheetTitle()} body={COPY.alertsBody} done={notified.alerts} onNotify={() => setNotified(n => ({ ...n, alerts: true }))} onDismiss={dismiss} onPlans={userState !== "active" ? () => openPaywall("alerts") : undefined} />}
      {sheet === "sky_notify" && <NotifySheet title={COPY.skySheetTitle} body={COPY.skyBody} done={notified.sky} onNotify={() => setNotified(n => ({ ...n, sky: true }))} onDismiss={dismiss} onPlans={userState !== "active" ? () => openPaywall("sky") : undefined} />}
      {(sheet === "map_locked" || sheet === "nudge") && <Sheet label={sheet === "map_locked" ? TRIGGER_COPY.map.headline : "Trip saved"} onDismiss={dismiss}><h2 className="text-xl">{sheet === "map_locked" ? TRIGGER_COPY.map.headline : "Trip saved"}</h2>{sheet === "map_locked" && <p className="mt-1 text-xs text-warm-brown">{FEATURE_NAMES.pin_filter.name}</p>}<p className="mt-3 text-sm text-pgn-muted">{sheet === "map_locked" ? TRIGGER_COPY.map.sub : nudgeCopy(settings)}</p><Primary className="mt-5" onClick={() => openPaywall(sheet === "map_locked" ? "map" : "nudge")}>{COPY.seePremium}</Primary><Action className="mt-2 min-h-11 w-full text-navy" onClick={dismiss}>{COPY.notNow}</Action></Sheet>}
      {sheet === "manage" && <Sheet label={COPY.manageRenewal} onDismiss={dismiss}><h2 className="text-xl">{COPY.manageRenewal}</h2><p className="mt-3 text-sm text-pgn-muted">{COPY.manageSheet}</p><Primary className="mt-5" onClick={dismiss}>{COPY.gotIt}</Primary></Sheet>}
      {sheet === "filter" && userState === "active" && <FilterSheet filter={filter} apply={setFilter} onDismiss={dismiss} />}
      {(sheet === "checkout" || sheet === "processing") && <Sheet neutral label="Checkout" onDismiss={dismiss}>{sheet === "processing" ? <div role="status" className="flex flex-col items-center py-10"><Loader2 className="h-10 w-10 animate-spin motion-reduce:animate-none" /><p className="mt-3">Processing…</p></div> : <><p className="text-xs text-ctl-sub">App Store / Google Play checkout, simulated</p><div className="mt-4 flex items-center gap-3"><img src={logo.url} alt="" className="h-12 w-12" /><h2 className="text-xl">{PLANS[selected].name}</h2></div><p className="mt-3 font-bold">{priceLabel(selected, settings)}</p><p className="mt-3 text-xs text-ctl-sub">{disclosure(selected, settings)}</p><Primary className="mt-5" onClick={confirm}>Confirm</Primary><Action className="mt-2 min-h-11 w-full" onClick={dismiss}>Cancel</Action></>}</Sheet>}
    </div>
    <Controls trigger={trigger} applyTrigger={applyTrigger} settings={settings} changeSetting={changeSetting} highlight={highlight} plans={plans} setHighlight={p => { setHighlightPref(p); setSelected(p); }} userState={userState} applyUser={applyUser} resetNotify={() => setNotified({ alerts: false, sky: false })} resetRental={() => setRentalShown(false)} onStyle={() => { dismiss(); setScreen("style"); }} />
  </main>;
}
function NotifySheet({ title, body, done, onNotify, onDismiss, onPlans }: { title: string; body: string; done: boolean; onNotify: () => void; onDismiss: () => void; onPlans?: (() => void) | undefined }) {
  return <Sheet label={title} onDismiss={onDismiss}><h2 className="pr-3 text-xl">{title}</h2><p className="mt-3 text-sm text-pgn-muted">{body}</p><Primary className="mt-5" onClick={onNotify} disabled={done}>{done ? COPY.notified : COPY.notify}</Primary><Action className="mt-2 min-h-11 w-full text-navy" onClick={onDismiss}>{COPY.notNow}</Action>{onPlans && <Action className="w-full text-xs text-link underline" onClick={onPlans}>{COPY.seePlans}</Action>}</Sheet>;
}
function Sidebar({ userState, onPremium, onMap, onAlerts, onRental }: { userState: UserState; onPremium: () => void; onMap: () => void; onAlerts: () => void; onRental: () => void }) {
  const items = [[Heart, "Favorites"], [Map, "Map Options"], [RefreshCw, "Update Map"], [Compass, "Travel Advice"], [Construction, "Road Condition Updates"], [HelpCircle, "How to use the App"], [Info, "About app"], [Settings, "Settings"], [LogOut, "Logout"]] as const;
  return <div className="min-h-full"><div className="bg-navy px-5 pb-6 pt-8"><div className="flex items-center gap-3"><img src={logo.url} alt="Pocket Guide Namibia logo" className="h-14 w-14 rounded-full bg-on-dark p-1.5" /><div><p className="font-display text-lg text-on-dark">Traveller</p><p className="text-sm text-on-dark">{userState === "active" ? "Premium" : "Free plan"}</p></div></div></div><nav className="space-y-2 p-3"><Action onClick={onPremium} className="gold-outline min-h-12 w-full justify-start rounded-2xl px-4 text-navy"><PremiumStar /><span className="font-display">Pocket Guide Premium</span></Action>{items.map(([Icon, label]) => <Action key={label} onClick={label === "Map Options" ? onMap : label === "Settings" ? onAlerts : () => toast(`${label} (prototype)`)} className="relative min-h-12 w-full justify-start overflow-hidden rounded-2xl border border-warm-border bg-on-dark px-4 text-navy">{["Travel Advice", "How to use the App", "About app", "Settings"].includes(label) && <span className="absolute inset-y-0 left-0 w-1 bg-terracotta" />}<Icon className="text-warm-brown" />{label}</Action>)}<Action onClick={onMap} className="min-h-11 w-full text-link">Open map</Action><Action onClick={onRental} className="min-h-11 w-full text-link">{COPY.rentalTitle}</Action></nav></div>;
}
function Paywall({ trigger, settings, selected, highlight, plans, onSelect, onClose }: { trigger: Trigger; settings: OfferSettings; selected: PlanId; highlight: PlanId; plans: PlanId[]; onSelect: (p: PlanId) => void; onClose: () => void }) {
  const copy = paywallCopy(trigger, settings);
  const single = plans.length === 1;
  const id = single ? plans[0] ?? "yearly" : selected;
  const badge = badgeText(id, settings);
  const [main, then] = priceParts(id, settings);
  const trial = id === "yearly" ? trialLine(settings) : null;
  return <div className="pb-5"><div className="relative h-[20dvh] max-h-40 bg-sand [@media(max-height:700px)]:h-[13dvh]"><img src={hero.url} alt="Paraglider over Namib dunes" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/0 to-transparent" /><Action onClick={onClose} aria-label="Close paywall" className="absolute left-4 top-3 h-11 w-11 rounded-full bg-pgn-dark p-0 text-on-dark"><X /></Action><img src={logo.url} alt="Pocket Guide Namibia logo" className="absolute bottom-0 left-1/2 h-11 w-11 -translate-x-1/2 translate-y-1/3 rounded-full bg-on-dark p-1.5" /></div>
    <div className="px-4 pt-5"><h1 className="text-center text-[24px] leading-tight text-navy">{copy.headline}</h1><p className="mt-1 text-center text-sm text-pgn-muted">{copy.sub}</p>
    {single ? <section aria-label={PLANS[id].name} className="mt-4 rounded-lg border-2 border-warm-border bg-on-dark p-4 text-pgn-dark shadow-card">
      {badge && <span className="mb-1.5 inline-block rounded bg-gold-gradient px-2 py-0.5 text-xs text-pgn-dark">{badge}</span>}
      <h2 className="text-base text-pgn-dark">{PLANS[id].name}</h2>
      <p className="mt-0.5 text-lg font-bold leading-snug text-navy">{main}{then && <> <span className="whitespace-nowrap">{then}</span></>}</p>
      {trial && <p className="mt-0.5 text-xs text-pgn-muted">{trial}</p>}
      <FeatureList selected={id} settings={settings} trigger={trigger} />
      <p className="mt-3 border-t border-warm-border pt-2.5 text-[11px] leading-relaxed text-pgn-muted">{finePrint(id, settings)}</p>
    </section> : <>
      <div role="radiogroup" aria-label="Choose a plan" className="mt-4 space-y-2">{plans.map(p => <PlanRow key={p} id={p} settings={settings} on={selected === p} best={highlight === p} onSelect={() => onSelect(p)} />)}</div>
      <section aria-label="What's included" className="mt-3 rounded-lg border-2 border-warm-border bg-on-dark p-4 text-pgn-dark shadow-card">{trial && <p className="text-xs text-pgn-muted">{trial}</p>}<FeatureList selected={selected} settings={settings} trigger={trigger} /><p className="mt-3 border-t border-warm-border pt-2.5 text-[11px] leading-relaxed text-pgn-muted" aria-live="polite">{finePrint(selected, settings)}</p></section>
    </>}
    <div className="mt-5 flex gap-2 border-y border-warm-border py-4"><ShieldCheck className="h-5 w-5 shrink-0 text-warm-brown" /><p className="text-xs leading-relaxed text-pgn-dark">{COPY.alwaysFree}</p></div><div className="mt-4 flex gap-2"><Leaf className="h-4 w-4 shrink-0 text-warm-brown" /><p className="text-xs text-pgn-muted">{COPY.conservation}</p></div>
    <p className="mt-4 text-[11px] leading-relaxed text-pgn-muted">{COPY.alertsDisclaimer}</p></div></div>;
}
function PlanRow({ id, on, best, settings, onSelect }: { id: PlanId; on: boolean; best: boolean; settings: OfferSettings; onSelect: () => void }) {
  const badge = badgeText(id, settings);
  return <button type="button" role="radio" aria-checked={on} onClick={onSelect} className={`flex w-full items-start gap-3 rounded-lg border-2 bg-on-dark p-3 text-left text-pgn-dark ${on ? "border-terracotta" : "border-warm-border"}`}>
    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-terracotta" : "border-input-border"}`}>{on && <span className="h-2.5 w-2.5 rounded-full bg-terracotta" />}</span>
    <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-1.5"><span className="text-sm font-bold">{PLANS[id].name}</span>{best && id !== "yearly" && <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] text-pgn-dark">{COPY.best}</span>}{badge && <span className="rounded bg-gold-gradient px-1.5 py-0.5 text-[10px] text-pgn-dark">{badge}</span>}</span>
    <span className="block text-sm font-bold text-navy">{priceLabel(id, settings)}</span><span className="block text-[11px] text-pgn-muted">{summary(id, settings)}</span></span></button>;
}
function FeatureList({ selected, settings, trigger }: { selected: PlanId; settings: OfferSettings; trigger: Trigger }) {
  const g = paywallFeatures(selected, settings, trigger);
  const label = "mt-3 text-[11px] uppercase tracking-wide text-warm-brown";
  const row = (f: PaywallFeature, coming: boolean) => <li key={f.id} className={`flex items-start gap-2 rounded-md ${f.highlight ? "-mx-1.5 bg-sand px-1.5 py-1" : ""}`}>
    {coming ? <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warm-brown" /> : <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${f.available ? "bg-terracotta text-on-dark" : "bg-toggle-off text-pgn-dark"}`}><Check className="h-3 w-3" /></span>}
    <span className="min-w-0 flex-1"><span className={`${coming || !f.available ? "text-pgn-muted" : "text-pgn-dark"}`}>{f.name}</span>{f.tag && <span className="ml-1.5 inline-block rounded bg-sand px-1.5 py-0.5 text-[10px] text-warm-brown">{f.tag}</span>}
    {f.desc && <span className="block truncate text-[11px] text-pgn-muted">{f.desc}</span>}
    {!f.available && <span className="block text-[11px] text-pgn-muted">Not included in {PLANS[selected].name}</span>}</span></li>;
  return <div>{g.included.length > 0 && <><p className={label}>{COPY.includedToday}</p><ul className="mt-1.5 space-y-2 text-sm">{g.included.map(f => row(f, false))}</ul></>}
    {g.early.length > 0 && <><p className={label}>Early access</p><ul className="mt-1.5 space-y-2 text-sm">{g.early.map(f => row(f, false))}</ul></>}
    {g.coming.length > 0 && <><p className={label}>{COPY.comingSoon}</p><ul className="mt-1.5 space-y-2 text-sm">{g.coming.map(f => row(f, true))}</ul></>}</div>;
}
function Status({ kind, plan, settings, notified, reminder, hideReminder, onManage, onBack, onPlans, onMap }: { kind: "active" | "expired" | "success"; plan: PlanId; settings: OfferSettings; notified: Notified; reminder: boolean; hideReminder: () => void; onManage: () => void; onBack: () => void; onPlans: () => void; onMap: () => void }) {
  const expired = kind === "expired";
  const title = kind === "success" ? "Welcome to Premium" : expired ? "Premium expired" : "Premium active";
  const renewDate = fmtDate(settings.trial ? PLANS.yearly.trialDays : 365);
  const date = expired ? `${PLANS[plan].name} ended on ${fmtDate(-3)}` : plan === "trip_pass" ? `Access ends on ${fmtDate(PLANS.trip_pass.days)}` : plan === "monthly" ? `Renews on ${fmtDate(30)} at ${money(PLANS.monthly.price)}/month` : renewalLine(settings, renewDate);
  const manage = <Action className="min-h-9 px-1 text-sm text-link underline" onClick={onManage}>{COPY.manageRenewal}</Action>;
  return <div className="p-5"><Back title={title} onBack={onBack} />
    {kind === "active" && reminder && plan === "yearly" && <div className="relative mt-5 rounded-lg border border-warm-border bg-on-dark p-3 pr-10 text-sm shadow-card"><Action aria-label="Dismiss reminder" className="absolute right-1 top-1 h-9 w-9 p-0 text-pgn-muted" onClick={hideReminder}><X /></Action>{reminderLine(fmtDate(365))} {manage}</div>}
    <div className="mt-8 flex flex-col items-center text-center"><PremiumStar large /><h2 className="mt-5 text-2xl">{expired ? plan === "trip_pass" ? COPY.expiredPass : COPY.expiredPremium : kind === "success" ? title : "You're a Premium user"}</h2><p className="mt-2 font-display text-lg text-warm-brown">{PLANS[plan].name}</p><p className="mt-3 w-full rounded-lg border border-warm-border bg-sand p-3 text-sm">{date}{!expired && plan !== "trip_pass" && <><br />{manage}</>}</p></div>
    {kind === "success" && plan === "yearly" && <div className="mt-4 rounded-lg bg-sand p-3 text-sm">{COPY.onceVisiting} {manage}</div>}
    {!expired && kind === "active" && <><div className="mt-5"><Checklist plan={plan} settings={settings} /></div>{notified.alerts && <p className="mt-4 text-sm text-pgn-muted">{COPY.notifyRow(FEATURE_NAMES.live_alerts.name)}</p>}{notified.sky && <p className="mt-1 text-sm text-pgn-muted">{COPY.notifyRow(FEATURE_NAMES.sky_alerts.name)}</p>}</>}
    <Primary className="mt-7" onClick={expired ? onPlans : onMap}>{expired ? plan === "trip_pass" ? COPY.anotherPass : COPY.renew : "Explore Premium features"}</Primary><div className="text-center"><Restore /></div></div>;
}
function RentalForm({ premium, onBack, onSubmit }: { premium: boolean; onBack: () => void; onSubmit: () => void }) {
  // In production the app attaches a Premium-entitlement flag to the inquiry sent to the booking agent; payload to be confirmed with the dev team and the agent.
  return <div className="p-5 pb-48"><Back title={COPY.rentalTitle} onBack={onBack} />{premium && <p className="mt-5 flex items-center gap-2 rounded-full bg-sand px-3 py-2 text-xs text-navy"><BadgeCheck className="h-4 w-4 shrink-0 text-warm-brown" />{COPY.rentalChip}</p>}<form onSubmit={e => { e.preventDefault(); onSubmit(); }} className="mt-7 space-y-5">{[["Name", "text"], ["Pick-up date", "date"], ["Return date", "date"]].map(([label, type]) => <label className="block text-sm text-warm-brown" key={label}>{label}<input required name={label} type={type} className="mt-2 h-12 w-full rounded-lg border border-input-border bg-on-dark px-3 text-navy" /></label>)}<Primary type="submit">Submit</Primary></form></div>;
}
function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return <fieldset className="mt-4"><legend className="mb-1.5 text-xs text-ctl-sub">{label}</legend><div className="flex flex-wrap gap-1.5">{options.map(([v, l]) => <button type="button" key={v} onClick={() => onChange(v)} aria-pressed={value === v} className={`min-h-9 rounded-full border px-3 text-sm ${value === v ? "border-ctl-ink bg-ctl-ink text-ctl-panel" : "border-ctl-line bg-ctl-panel text-ctl-ink"}`}>{l}</button>)}</div></fieldset>;
}
const PLAN_LABEL: Record<PlanId, string> = { trip_pass: "Trip Pass", yearly: "Yearly", monthly: "Monthly" };
function Controls(p: { trigger: Trigger; applyTrigger: (t: Trigger) => void; settings: OfferSettings; changeSetting: <K extends keyof OfferSettings>(k: K, v: OfferSettings[K]) => void; highlight: PlanId; plans: PlanId[]; setHighlight: (p: PlanId) => void; userState: UserState; applyUser: (u: UserState) => void; resetNotify: () => void; resetRental: () => void; onStyle: () => void }) {
  const [open, setOpen] = useState(true);
  const toggles = [["launch", `Launch offer (${money(PLANS.yearly.firstYearPrice)} then ${money(PLANS.yearly.price)})`], ["eligible", "Intro price eligible"], ["trial", "Yearly free trial (demo only)"], ["rental", "Rental discount line"], ["showTripPass", "Show Trip Pass"], ["showMonthly", "Show Monthly"], ["reminder", "Pre-renewal reminder"]] as const;
  return <aside className="m-4 rounded-lg bg-ctl-panel p-5 text-ctl-ink shadow-card md:m-0 md:max-h-[844px] md:w-80 md:overflow-y-auto"><Action onClick={() => setOpen(!open)} aria-expanded={open} className="min-h-11 w-full justify-between px-0 text-ctl-ink"><h2 className="text-lg">Prototype controls</h2><ChevronDown className={open ? "rotate-180" : ""} /></Action>{open && <>
    <Seg label="Trigger context" value={p.trigger} onChange={p.applyTrigger} options={[["sidebar", "Sidebar"], ["trip3", "Trip #3"], ["pdf", "PDF export"], ["alerts", FEATURE_NAMES.live_alerts.name], ["sky", FEATURE_NAMES.sky_alerts.name], ["nudge", "Post-save nudge"], ["map", "Map filter"], ["rental", "Rental inquiry"]]} />
    {toggles.map(([key, label]) => <div key={key} className="mt-4 flex items-center justify-between gap-2 text-sm"><span>{label}</span><Toggle label={label} on={key === "trial" ? p.settings.trial && p.settings.eligible : p.settings[key]} disabled={(key === "eligible" && p.userState === "expired") || (key === "trial" && !p.settings.eligible)} onChange={on => p.changeSetting(key, on)} /></div>)}
    {p.plans.length > 1 && <Seg label="Highlighted plan" value={p.highlight} onChange={p.setHighlight} options={p.plans.map(id => [id, PLAN_LABEL[id]] as [PlanId, string])} />}
    <label className="mt-4 block text-xs text-ctl-sub">Offer end date (blank = none)<input value={p.settings.offerEnd ?? ""} onChange={e => p.changeSetting("offerEnd", e.target.value || null)} placeholder="e.g. 31 March 2027" className="mt-1.5 h-10 w-full rounded-lg border border-ctl-line bg-ctl-panel px-3 text-sm text-ctl-ink" /></label>
    <Seg<AlertsStatus> label={COPY.liveGuideStatus} value={p.settings.alerts} onChange={v => p.changeSetting("alerts", v)} options={[["coming_soon", COPY.comingSoon], ["early_access", "Early access"], ["released", "Released"]]} />
    <Seg<SkyStatus> label={COPY.skyStatus} value={p.settings.sky} onChange={v => p.changeSetting("sky", v)} options={[["released", "Released"], ["coming_soon", COPY.comingSoon]]} />
    <Seg label="User state" value={p.userState} onChange={p.applyUser} options={[["free", "Free"], ["active", "Premium active"], ["expired", "Expired"]]} />
    <Action onClick={p.resetNotify} className="mt-4 min-h-11 w-full rounded-full border border-ctl-line text-ctl-ink">Reset Notify me</Action>
    <Action onClick={p.resetRental} className="mt-2 min-h-11 w-full rounded-full border border-ctl-line text-ctl-ink">Reset rental pop-up</Action>
    <Action onClick={p.onStyle} className="mt-2 min-h-11 w-full rounded-full border border-ctl-ink text-ctl-ink">Open Style preview</Action><p className="mt-4 text-xs text-ctl-sub">Design mock only. No real payments or notification signup. Reminder days: {RENEWAL_REMINDER_DAYS}.</p></>}</aside>;
}
