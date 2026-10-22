// Phase 1 prototype copy and offers (annual-only founding-member offer).
// Store offer compatibility must be confirmed before launch.
export const CURRENCY = "$";
export const money = (n: number) => `${CURRENCY}${n.toFixed(2)}`;
export const whole = (n: number) => `${CURRENCY}${Math.round(n).toLocaleString("en-US")}`;
export type PlanId = "trip_pass" | "yearly" | "monthly";
export type AlertsStatus = "coming_soon" | "early_access" | "released";
export type SkyStatus = "coming_soon" | "released";
export type Trigger = "sidebar" | "trip3" | "pdf" | "alerts" | "sky" | "nudge" | "map" | "rental";
export type UserState = "free" | "active" | "expired";
export const PLANS = {
  trip_pass: { id: "trip_pass", name: "90-Day Trip Pass", price: 24.99, days: 90, renews: false },
  yearly: { id: "yearly", name: "Pocket Guide Premium", price: 44.99, firstYearPrice: 9.99, renews: true },
  monthly: { id: "monthly", name: "Monthly Premium", price: 9.99, renews: true },
} as const;
export const PLAN_ORDER: PlanId[] = ["trip_pass", "yearly", "monthly"];
export const SHOW_TRIP_PASS = false;
export const SHOW_MONTHLY = false;
export const YEARLY_LAUNCH_PRICE_ON = true;
export const OFFER_END_DATE: string | null = "28 February 2027";
export const FOUNDING_BADGE = "Founding member price";
export const RENTAL_DISCOUNT_ON = true;
export const RENTAL_DISCOUNT_PLANS: PlanId[] = ["trip_pass", "yearly"];
export const RENTAL_DISCOUNT_PERCENT = 3;
// Placeholder wording and example figures, pending legal review. Set RENTAL_EXAMPLE_ENABLED to false to use the percentage-only fallback.
export const RENTAL_EXAMPLE_ENABLED = true;
export const RENTAL_EXAMPLE_AMOUNT = 1500; // USD
export const rentalSavings = () => Math.round(RENTAL_EXAMPLE_AMOUNT * RENTAL_DISCOUNT_PERCENT / 100);
export const LIVE_ALERTS_STATUS: AlertsStatus = "coming_soon";
export const LIVE_ALERTS_RELEASE_LABEL = "February 2027";
export const SKY_ALERTS_RELEASE_LABEL: string | null = null;
export const SKY_ALERTS_STATUS: SkyStatus = "released";
export const EMERGENCY_SUPPORT_STATUS: AlertsStatus = "coming_soon";
export const EMERGENCY_SUPPORT_RELEASE_LABEL: string | null = null;
export const PRE_RENEWAL_REMINDER_ON = false;
export const RENEWAL_REMINDER_DAYS = 14;
export const FREE_CAP_TRIPS = 2;
export const PREMIUM_CAP_TRIPS = 20;
export const FEATURE_NAMES = {
  pdf_export: { name: "Print, export and share your trip.", short: "printing and export" },
  emergency_support: { name: "Emergency Assistance", desc: "One-tap calls to emergency contacts", short: "One-tap calls to emergency contacts" },
  pin_filter: { name: "Location filter", desc: "Customize map to your interests", short: "Customize map to your interests" }, // placeholder name
  sky_alerts: { name: "Sky Outlook", desc: "Alerts for meteor showers and other sky events, plus multi-day weather forecasts", short: "Sky events and multi-day forecasts" }, // placeholder name
  live_alerts: { name: "Live Guide", desc: "Tips and info based on live location", short: "Tips and info based on live location" }, // placeholder name
} as const;
// eligible: production reads intro-offer eligibility from the store / RevenueCat, never from user state.
export type OfferSettings = { eligible: boolean; launch: boolean; rental: boolean; rentalExample: boolean; alerts: AlertsStatus; sky: SkyStatus; emergency: AlertsStatus; showTripPass: boolean; showMonthly: boolean; reminder: boolean; offerEnd: string | null; autoRenewOff: boolean };
export const DEFAULT_SETTINGS: OfferSettings = { eligible: true, launch: YEARLY_LAUNCH_PRICE_ON, rental: RENTAL_DISCOUNT_ON, rentalExample: RENTAL_EXAMPLE_ENABLED, alerts: LIVE_ALERTS_STATUS, sky: SKY_ALERTS_STATUS, emergency: EMERGENCY_SUPPORT_STATUS, showTripPass: SHOW_TRIP_PASS, showMonthly: SHOW_MONTHLY, reminder: PRE_RENEWAL_REMINDER_ON, offerEnd: OFFER_END_DATE, autoRenewOff: false };
export const launchEnabled = (s: OfferSettings) => s.launch;
export const visiblePlans = (s: OfferSettings) => PLAN_ORDER.filter(p => p === "yearly" || (p === "trip_pass" ? s.showTripPass : s.showMonthly));
export const resolveHighlight = (wanted: PlanId | null, s: OfferSettings): PlanId => { const v = visiblePlans(s); return wanted && v.includes(wanted) ? wanted : v[0] ?? "yearly"; };
export const COPY = {
  best: "Best for your trip",
  cancellation: "Cancel anytime in your App Store or Google Play account settings",
  sharedCancellation: "Subscriptions can be cancelled anytime in your App Store or Google Play account settings.",
  alwaysFree: "Still free for everyone: the offline map with all pins and search, 5 curated trips, road conditions forum, travel advice and emergency numbers.",
  conservation: "A portion of every purchase supports conservation and community partners in Namibia.",
  // Placeholder wording: pending legal review.
  // Placeholder wording: pending legal review (and a check of the weather data provider's terms).
  // In production this feature needs an opt-in location permission prompt; no UI needed here.
  alertsDisclaimer: "Location-based recommendations and forecasts depend on your device's location settings, connection and third-party data, and may be delayed, change, or be unavailable in some conditions.",
  foundingLine: "Founding member price for early Premium members.",
  includedToday: "Included today", comingSoon: "Planned", earlyAccess: "Early access", released: "Released",
  emergencyStatus: `${FEATURE_NAMES.emergency_support.name} status`,
  // Placeholder wording, pending legal review.
  emergencyDisclaimer: "Emergency Assistance does not replace local emergency services.",
  alertsBody: "Get recommendations and information based on your location, as you travel. We'll let you know when it's ready.",
  liveGuideStatus: `${FEATURE_NAMES.live_alerts.name} status`,
  skyStatus: `${FEATURE_NAMES.sky_alerts.name} status`,
  alertsPlannedLine: `Planned for ${LIVE_ALERTS_RELEASE_LABEL}`,
  skySheetTitle: `${FEATURE_NAMES.sky_alerts.name} is planned`,
  skyBody: "Get alerts for meteor showers and other sky events, plus multi-day weather forecasts. We'll let you know when it's ready.",
  notify: "Notify me", notified: "You're on the list",
  notifyRow: (feature: string) => `${feature}: you'll be notified when it launches`,
  notNow: "Not now", seePremium: "See Premium", seePlans: "See Premium plans", getPremium: "Get Premium",
  filterLockedSub: "Show only what you need: fuel, campsites, viewpoints and more.",
  rentalChip: `Premium member: your ${RENTAL_DISCOUNT_PERCENT}% discount will be noted on this inquiry.`,
  rentalTitle: "Rental inquiry", rentalSent: "Inquiry sent", rentalConfirmation: "Your rental inquiry has been sent.",
  expiredPass: "Your Trip Pass has ended", expiredPremium: "Your Premium has ended",
  anotherPass: "Get another Trip Pass", renew: "Renew Premium",
  onceVisiting: "Only visiting once? You can turn off auto-renew now and keep Premium for your full first year.",
  manageRenewal: "Manage renewal", manageSheet: "This opens your App Store or Google Play subscription settings.", gotIt: "Got it",
  search: "Search places", filterTitle: "Filter the map", filterTrip: "Only along my trip", showAll: "Show all", apply: "Apply",
  restore: "Restore purchases", terms: "Terms of Use", privacy: "Privacy Policy", eula: "EULA",
};
// Placeholder wording and example figures, pending legal review.
export const rentalNudge = (s: OfferSettings) => s.rentalExample
  ? `Planning to self-drive? Premium members save ${RENTAL_DISCOUNT_PERCENT}% on rentals booked through Pocket Guide. On a ${whole(RENTAL_EXAMPLE_AMOUNT)} rental, that's ${whole(rentalSavings())}.`
  : `Planning to self-drive? Premium members save ${RENTAL_DISCOUNT_PERCENT}% on every rental booked through Pocket Guide. On a multi-day 4x4 hire, that adds up.`;
const base = { headline: "Your Namibia, without limits.", sub: "Your trips, your map, your way." };
export const TRIGGER_COPY: Record<Trigger, { headline: string; sub: string }> = {
  sidebar: base,
  nudge: { headline: `Plan up to ${PREMIUM_CAP_TRIPS} trips with Premium.`, sub: `You've used 1 of ${FREE_CAP_TRIPS} free trips.` },
  rental: { headline: "Save on your self-drive.", sub: `Premium members get ${RENTAL_DISCOUNT_PERCENT}% off rentals booked through Pocket Guide.` },
  trip3: { headline: `You've reached your ${FREE_CAP_TRIPS} free trips.`, sub: `Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.` },
  pdf: { headline: "Take your itinerary offline, on paper.", sub: "Export and print any trip with Premium." },
  alerts: { headline: "Stay informed as you travel.", sub: FEATURE_NAMES.live_alerts.desc },
  sky: { headline: "Know what's overhead and ahead.", sub: "Get alerts for meteor showers and other sky events, plus multi-day weather forecasts." },
  map: { headline: "Filter the map to what matters.", sub: COPY.filterLockedSub },
};
export const alertsSheetTitle = () => `${FEATURE_NAMES.live_alerts.name} is planned for ${LIVE_ALERTS_RELEASE_LABEL}`;
// Placeholder wording, pending legal review. Shown under the Planned group for the Trip Pass only.
export const TRIP_PASS_PLANNED_NOTE = "Planned features are available to Trip Pass holders while their pass is active.";
export type FeatureItem = { id?: FeatureId; name: string; desc?: string | undefined; tag?: string };
export function featureGroups(id: PlanId, s: OfferSettings) {
  const groups = paywallFeatures(id, s, "sidebar");
  const available = (items: PaywallFeature[]): FeatureItem[] => items.filter(f => f.available);
  return { included: available(groups.included), early: available(groups.early), coming: available(groups.coming) };
}
export function planExtras(id: PlanId) {
  if (id === "trip_pass") return [`Valid ${PLANS.trip_pass.days} days from purchase · one-time payment · no auto-renewal`];
  if (id === "monthly") return ["Renews monthly until you cancel"];
  return [`Auto-renews yearly at ${money(PLANS.yearly.price)} until you cancel`];
}
export const introShown = (s: OfferSettings) => s.eligible && s.launch;
const STORE_CANCEL = "Renews automatically until you cancel in your App Store or Google Play settings.";
export function finePrint(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `One-time payment of ${money(PLANS.trip_pass.price)} for ${PLANS.trip_pass.days} days of Premium. Does not auto-renew.`;
  if (id === "monthly") return `${money(PLANS.monthly.price)}/month. Renews automatically each month until you cancel in your App Store or Google Play settings.`;
  const intro = introShown(s) ? `${money(PLANS.yearly.firstYearPrice)} for the first year, then ` : "";
  return `${intro}${money(PLANS.yearly.price)}/year. ${STORE_CANCEL}`;
}
export const disclosure = finePrint;
// Short summary under the CTA, built from the same pieces as the fine print.
export function summary(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `One-time ${money(PLANS.trip_pass.price)} · ${PLANS.trip_pass.days} days · no auto-renewal`;
  if (id === "monthly") return `${money(PLANS.monthly.price)}/month. Auto-renews until you cancel.`;
  const intro = introShown(s) ? `${money(PLANS.yearly.firstYearPrice)} first year, then ` : "";
  return `${intro}${money(PLANS.yearly.price)}/year. Auto-renews until you cancel.`.replace(/^./, c => c.toUpperCase());
}
export function ctaLabel(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `Get Trip Pass – ${money(PLANS.trip_pass.price)}`;
  if (id === "monthly") return `Get Monthly – ${money(PLANS.monthly.price)}/month`;
  if (!s.eligible) return `Renew Premium – ${money(PLANS.yearly.price)}/year`;
  return introShown(s) ? `Get Premium – ${money(PLANS.yearly.firstYearPrice)} first year` : `Get Premium – ${money(PLANS.yearly.price)}/year`;
}
export function priceParts(id: PlanId, s: OfferSettings): [string, string?] {
  if (id === "trip_pass") return [`${money(PLANS.trip_pass.price)} · one-time · ${PLANS.trip_pass.days} days`];
  if (id === "monthly") return [`${money(PLANS.monthly.price)}/month`];
  return introShown(s) ? [`${money(PLANS.yearly.firstYearPrice)} first year`, `then ${money(PLANS.yearly.price)}/year`] : [`${money(PLANS.yearly.price)}/year`];
}
// Gold badge: only with the intro price; end date only when OFFER_END_DATE is set.
export function badgeText(id: PlanId, s: OfferSettings) {
  if (id !== "yearly" || !introShown(s)) return null;
  const end = s.offerEnd?.trim() ? ` · until ${s.offerEnd.trim()}` : "";
  return `${FOUNDING_BADGE}${end}`;
}
export const WELCOME_BACK = { headline: "Welcome back to Premium", sub: "Pick up where you left off." };
export function paywallCopy(t: Trigger, s: OfferSettings) {
  if (!s.eligible && t === "sidebar") return WELCOME_BACK;
  return TRIGGER_COPY[t];
}
// The order is a hypothesis; change it here only.
export const FEATURE_ORDER = ["location_filter", "rental_discount", "custom_trips", "pdf_export", "sky_outlook"] as const;
export const PLANNED_ORDER = ["live_guide", "emergency_support"] as const;
export type FeatureId = typeof FEATURE_ORDER[number] | typeof PLANNED_ORDER[number];
export const TRIGGER_FEATURE: Partial<Record<Trigger, FeatureId>> = { trip3: "custom_trips", nudge: "custom_trips", pdf: "pdf_export", map: "location_filter", rental: "rental_discount", sky: "sky_outlook", alerts: "live_guide" };
export type PaywallFeature = { id: FeatureId; name: string; desc?: string | undefined; tag?: string; plans: PlanId[]; available: boolean; highlight: boolean };
function catalogue(s: OfferSettings) {
  // The Trip Pass includes ALL Premium features, planned ones included; only the rental discount is plan-limited.
  const all: PlanId[] = ["trip_pass", "yearly", "monthly"];
  const list: { id: FeatureId; name: string; desc?: string; plans: PlanId[]; status: AlertsStatus; date: string | null; enabled: boolean }[] = [
    { id: "rental_discount", name: `${RENTAL_DISCOUNT_PERCENT}% discount on Pocket Guide-booked car rentals`, desc: s.rentalExample ? `e.g. ${whole(rentalSavings())} off a ${whole(RENTAL_EXAMPLE_AMOUNT)} rental` : "On every rental booked through Pocket Guide", plans: RENTAL_DISCOUNT_PLANS, status: "released", date: null, enabled: s.rental },
    { id: "custom_trips", name: `Up to ${PREMIUM_CAP_TRIPS} custom trips`, plans: all, status: "released", date: null, enabled: true },
    { id: "pdf_export", name: FEATURE_NAMES.pdf_export.name, plans: all, status: "released", date: null, enabled: true },
    { id: "location_filter", name: FEATURE_NAMES.pin_filter.name, desc: FEATURE_NAMES.pin_filter.short, plans: all, status: "released", date: null, enabled: true },
    { id: "sky_outlook", name: FEATURE_NAMES.sky_alerts.name, desc: FEATURE_NAMES.sky_alerts.short, plans: all, status: s.sky, date: SKY_ALERTS_RELEASE_LABEL, enabled: true },
    { id: "live_guide", name: FEATURE_NAMES.live_alerts.name, desc: FEATURE_NAMES.live_alerts.short, plans: all, status: s.alerts, date: LIVE_ALERTS_RELEASE_LABEL, enabled: true },
    { id: "emergency_support", name: FEATURE_NAMES.emergency_support.name, desc: FEATURE_NAMES.emergency_support.desc, plans: all, status: s.emergency, date: EMERGENCY_SUPPORT_RELEASE_LABEL, enabled: true },
  ];
  const order: readonly FeatureId[] = [...FEATURE_ORDER, ...PLANNED_ORDER];
  return list.filter(f => f.enabled).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
// Shared list for the paywall: features offered by any visible plan; ones the selected plan lacks are marked unavailable.
// earlyFirst: when the trigger's feature is in Early access, that whole group renders above Included today.
export function paywallFeatures(selected: PlanId, s: OfferSettings, trigger: Trigger) {
  const visible = visiblePlans(s); const top = TRIGGER_FEATURE[trigger];
  const groups = { included: [] as PaywallFeature[], early: [] as PaywallFeature[], coming: [] as PaywallFeature[] };
  for (const f of catalogue(s)) {
    if (!f.plans.some(p => visible.includes(p))) continue;
    const item: PaywallFeature = { id: f.id, name: f.name, desc: f.desc, plans: f.plans, available: f.plans.includes(selected), highlight: f.id === top };
    if (f.status === "released") groups.included.push(item);
    else if (f.status === "early_access") groups.early.push({ ...item, tag: "Early access" });
    else groups.coming.push(f.date ? { ...item, tag: f.date } : item);
  }
  const plannedRank = (f: PaywallFeature) => { const index = (PLANNED_ORDER as readonly FeatureId[]).indexOf(f.id); return index < 0 ? PLANNED_ORDER.length : index; };
  groups.coming.sort((a, b) => plannedRank(a) - plannedRank(b));
  for (const g of Object.values(groups)) { const i = g.findIndex(x => x.highlight); if (i > 0) g.unshift(...g.splice(i, 1)); }
  return { ...groups, earlyFirst: groups.early.some(f => f.highlight) };
}
export function featureDisclaimer(selected: PlanId, s: OfferSettings) {
  const groups = paywallFeatures(selected, s, "sidebar");
  const shown = Object.values(groups).some(group => Array.isArray(group) && group.some(f => f.id === "emergency_support"));
  return `${COPY.alertsDisclaimer}${shown ? ` ${COPY.emergencyDisclaimer}` : ""}`;
}
export const priceLabel = (id: PlanId, s: OfferSettings) => priceParts(id, s).join(" · ");
export const offerEndLine = (s: OfferSettings) => s.offerEnd?.trim() ? ` Available until ${s.offerEnd.trim()}.` : "";
export const renewalLine = (s: OfferSettings, date: string) => `Renews on ${date} at ${money(PLANS.yearly.price)}/year`;
// In production: a local or push notification plus this in-app card, scheduled RENEWAL_REMINDER_DAYS before renewal.
export const reminderLine = (date: string) => `Your Premium renews in ${RENEWAL_REMINDER_DAYS} days, on ${date}, for ${money(PLANS.yearly.price)}.`;
export function nudgeCopy(tripsUsed: 1 | 2) {
  return tripsUsed === 1
    ? `You've used 1 of ${FREE_CAP_TRIPS} free trips. Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.`
    : `That was your last free trip. Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.`;
}
export const fmtDate = (daysOut: number) => new Date(Date.now() + daysOut * 864e5).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export const CATEGORIES = [
  { id: "accommodation", label: "Accommodation", color: "bg-pin-blue" },
  { id: "activities", label: "Activities", color: "bg-pin-gold" },
  { id: "sites", label: "Sites", color: "bg-pin-brown" },
  { id: "fuel", label: "Fuel", color: "bg-success" },
  { id: "support", label: "Support", color: "bg-pin-orange" },
  { id: "emergencies", label: "Emergencies", color: "bg-danger" },
  { id: "namibia", label: "Support Namibia", color: "bg-pin-purple" },
] as const;
export type CategoryId = typeof CATEGORIES[number]["id"];
// Placeholder categories and icons, replace with the app's real pin categories and pin icons.
export const MAP_FILTER_PREVIEW_CATEGORIES = [
  { id: "fuel", label: "Fuel", icon: "fuel" },
  { id: "campsites", label: "Campsites", icon: "tent" },
  { id: "viewpoints", label: "Viewpoints", icon: "mountain" },
  { id: "lodges", label: "Lodges", icon: "bed" },
  { id: "water", label: "Water", icon: "droplets" },
] as const;
// Placeholder, scope to be confirmed with the dev team.
export const MOCK_TRIPS = ["Etosha & Damaraland, 10 days", "Sossusvlei weekend"];
export const MOCK_PINS: { name: string; category: CategoryId; x: number; y: number; trips: number[]; detail: string }[] = [
  { name: "Etosha camp", category: "accommodation", x: 61, y: 19, trips: [0], detail: "Accommodation near Etosha National Park." },
  { name: "Damaraland walk", category: "activities", x: 37, y: 32, trips: [0], detail: "A walking activity in Damaraland." },
  { name: "Sossusvlei dunes", category: "sites", x: 47, y: 73, trips: [1], detail: "Explore the dunes of the Namib." },
  { name: "Windhoek fuel", category: "fuel", x: 70, y: 50, trips: [0, 1], detail: "Mock fuel stop in Windhoek." },
  { name: "Swakopmund support", category: "support", x: 25, y: 48, trips: [0], detail: "Local traveller support in Swakopmund." },
  { name: "Windhoek hospital", category: "emergencies", x: 78, y: 54, trips: [0, 1], detail: "Mock hospital listing. Emergency numbers remain free." },
  { name: "Community craft centre", category: "namibia", x: 56, y: 36, trips: [0], detail: "Support a local community craft partner." },
  { name: "Sesriem camp", category: "accommodation", x: 58, y: 79, trips: [1], detail: "Accommodation near Sesriem." },
  { name: "Coastal activity", category: "activities", x: 29, y: 58, trips: [], detail: "A mock activity along the coast." },
];

export type NotificationState = { alerts: boolean; sky: boolean; emergency: boolean };
export const EMPTY_NOTIFICATIONS: NotificationState = { alerts: false, sky: false, emergency: false };
export const NOTIFICATION_FEATURES = [
  { key: "alerts", feature: "live_guide", name: FEATURE_NAMES.live_alerts.name },
  { key: "sky", feature: "sky_outlook", name: FEATURE_NAMES.sky_alerts.name },
  { key: "emergency", feature: "emergency_support", name: FEATURE_NAMES.emergency_support.name },
] as const;
export type SuccessDestination = "origin" | "main" | "trip_creation" | "pdf_export" | "map_filter" | "sky" | "alerts" | "rental";
export const SUCCESS_CONTINUATIONS: Record<Trigger, { label: string; destination: SuccessDestination }> = {
  trip3: { label: "Create your next trip", destination: "trip_creation" },
  pdf: { label: "Print or export your trip", destination: "pdf_export" },
  map: { label: "Open the Location filter", destination: "map_filter" },
  sky: { label: "Open Sky Outlook", destination: "sky" },
  alerts: { label: "Open Live Guide", destination: "alerts" },
  rental: { label: "Back to your inquiry", destination: "rental" },
  sidebar: { label: "Start exploring", destination: "main" },
  nudge: { label: "Start exploring", destination: "main" },
};
export const SUCCESS_COPY = {
  close: "Close", welcome: "Welcome to Premium", welcomeBack: "Welcome back to Premium",
  foundingThanks: "Thank you for being a founding member.", thanks: "Thank you for supporting Pocket Guide Namibia.",
  yourPlan: "Your plan", planned: "Also planned for Premium",
  paid: (amount: number) => `Paid ${money(amount)} today.`,
  nextCharge: (amount: number, date: string) => `Next charge ${money(amount)} on ${date}.`,
  passEnd: (date: string) => `Access ends on ${date}. Does not auto-renew.`,
  notifyLabel: (name: string) => `${COPY.notify}: ${name}`,
} as const;
export type SuccessPurchase = { plan: PlanId; settings: OfferSettings; trigger: Trigger; purchasedAt: string };
export function billingDate(start: string, unit: "year" | "month" | "day", amount: number) {
  const date = new Date(start);
  if (unit === "day") date.setUTCDate(date.getUTCDate() + amount);
  else {
    const day = date.getUTCDate();
    date.setUTCDate(1);
    if (unit === "year") date.setUTCFullYear(date.getUTCFullYear() + amount);
    else date.setUTCMonth(date.getUTCMonth() + amount);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
  }
  return date.toISOString();
}
const successDate = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
export function successDetails(p: SuccessPurchase) {
  const { plan, settings: s, purchasedAt: today } = p;
  const intro = plan === "yearly" && introShown(s);
  const next = plan === "trip_pass" ? billingDate(today, "day", PLANS.trip_pass.days) : plan === "monthly" ? billingDate(today, "month", 1) : billingDate(today, "year", 1);
  const firstPrice = intro ? PLANS.yearly.firstYearPrice : PLANS.yearly.price;
  const billing = plan === "trip_pass" ? `${SUCCESS_COPY.paid(PLANS.trip_pass.price)} ${SUCCESS_COPY.passEnd(successDate(next))}`
    : plan === "monthly" ? `${SUCCESS_COPY.paid(PLANS.monthly.price)} ${SUCCESS_COPY.nextCharge(PLANS.monthly.price, successDate(next))}`
    : `${SUCCESS_COPY.paid(firstPrice)} ${SUCCESS_COPY.nextCharge(PLANS.yearly.price, successDate(next))}`;
  return { headline: s.eligible ? SUCCESS_COPY.welcome : SUCCESS_COPY.welcomeBack, thanks: intro ? SUCCESS_COPY.foundingThanks : SUCCESS_COPY.thanks,
    name: PLANS[plan].name, badge: intro ? FOUNDING_BADGE : null, billing, nextChargeAt: next,
    tip: plan === "trip_pass" ? null : COPY.onceVisiting };
}
export function successContinuation(p: SuccessPurchase) {
  if (p.trigger === "alerts" && p.settings.alerts === "coming_soon") return SUCCESS_CONTINUATIONS.sidebar;
  return SUCCESS_CONTINUATIONS[p.trigger];
}
export function successPlanned(p: SuccessPurchase) {
  return paywallFeatures(p.plan, p.settings, "sidebar").coming.filter(f => f.available);
}

// Placeholder, pending a decision with the developers on what happens to trips beyond the free limit of 2.
export const EXPIRED_TRIPS_NOTE_ON = true;
export const STATUS_COPY = {
  close: "Close", endedOn: (date: string) => `Ended on ${date}.`, tripsSaved: "Your trips are saved.",
  autoRenewOff: "Auto-renew off",
  activeUntil: (date: string) => `Premium is active until ${date}. Auto-renew is off.`,
  turnOn: "Turn auto-renew back on", rentalLink: "Send a rental inquiry",
};
// Premium active rows reuse the Success screen destinations.
export const FEATURE_DESTINATIONS: Partial<Record<FeatureId, SuccessDestination>> = {
  location_filter: "map_filter", rental_discount: "rental", custom_trips: "trip_creation", pdf_export: "pdf_export", sky_outlook: "sky",
};
// Destination screens built in this prototype; others render as plain rows.
export const BUILT_DESTINATIONS: SuccessDestination[] = ["map_filter", "rental", "sky", "alerts", "main"];
export const featureDestination = (id?: FeatureId) => { const d = id ? FEATURE_DESTINATIONS[id] : undefined; return d && BUILT_DESTINATIONS.includes(d) ? d : null; };

/** Rental discount applies only when the discount is enabled and the plan includes it (Yearly or Trip Pass, never Monthly). */
export const rentalEligible = (plan: PlanId, settings: OfferSettings) => settings.rental && plan !== "monthly";
