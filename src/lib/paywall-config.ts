// Phase 1 prototype copy and offers (annual-only founding-member offer).
// Store offer compatibility must be confirmed before launch.
export const CURRENCY = "$";
export const money = (n: number) => `${CURRENCY}${n.toFixed(2)}`;
export type PlanId = "trip_pass" | "yearly" | "monthly";
export type AlertsStatus = "coming_soon" | "early_access" | "released";
export type SkyStatus = "coming_soon" | "released";
export type Trigger = "sidebar" | "trip3" | "pdf" | "alerts" | "sky" | "nudge" | "map" | "rental";
export type UserState = "free" | "active" | "expired";
export const PLANS = {
  trip_pass: { id: "trip_pass", name: "90-Day Trip Pass", price: 24.99, days: 90, renews: false },
  yearly: { id: "yearly", name: "Pocket Guide Premium", price: 44.99, firstYearPrice: 9.99, trialDays: 5, renews: true },
  monthly: { id: "monthly", name: "Monthly Premium", price: 9.99, renews: true },
} as const;
export const PLAN_ORDER: PlanId[] = ["trip_pass", "yearly", "monthly"];
export const SHOW_TRIP_PASS = false;
export const SHOW_MONTHLY = false;
export const YEARLY_LAUNCH_PRICE_ON = true;
export const YEARLY_FREE_TRIAL_ON = false;
export const OFFER_END_DATE: string | null = null;
export const FOUNDING_BADGE = "Founding member price";
export const RENTAL_DISCOUNT_ON = true;
export const RENTAL_DISCOUNT_PLANS: PlanId[] = ["trip_pass", "yearly"];
export const RENTAL_DISCOUNT_PERCENT = 3;
export const LIVE_ALERTS_STATUS: AlertsStatus = "coming_soon";
export const LIVE_ALERTS_RELEASE_LABEL = "February 2027";
export const SKY_ALERTS_STATUS: SkyStatus = "released";
export const PRE_RENEWAL_REMINDER_ON = false;
export const RENEWAL_REMINDER_DAYS = 14;
export const FREE_CAP_TRIPS = 2;
export const PREMIUM_CAP_TRIPS = 20;
export const FEATURE_NAMES = {
  pin_filter: { name: "Location filter", desc: "Filter the map to what matters" }, // placeholder name
  sky_alerts: { name: "Sky Outlook", desc: "Alerts for meteor showers and other sky events, plus multi-day weather forecasts" }, // placeholder name
  live_alerts: { name: "Live location alerts", desc: "Alerts when you're near park gates and safety zones" },
} as const;
export type OfferSettings = { launch: boolean; trial: boolean; rental: boolean; alerts: AlertsStatus; sky: SkyStatus; showTripPass: boolean; showMonthly: boolean; reminder: boolean; offerEnd: string | null };
export const DEFAULT_SETTINGS: OfferSettings = { launch: YEARLY_LAUNCH_PRICE_ON, trial: YEARLY_FREE_TRIAL_ON, rental: RENTAL_DISCOUNT_ON, alerts: LIVE_ALERTS_STATUS, sky: SKY_ALERTS_STATUS, showTripPass: SHOW_TRIP_PASS, showMonthly: SHOW_MONTHLY, reminder: PRE_RENEWAL_REMINDER_ON, offerEnd: OFFER_END_DATE };
export const launchEnabled = (s: OfferSettings) => s.launch;
export const visiblePlans = (s: OfferSettings) => PLAN_ORDER.filter(p => p === "yearly" || (p === "trip_pass" ? s.showTripPass : s.showMonthly));
export const resolveHighlight = (wanted: PlanId | null, s: OfferSettings): PlanId => { const v = visiblePlans(s); return wanted && v.includes(wanted) ? wanted : v[0] ?? "yearly"; };
export const COPY = {
  best: "Best for your trip",
  cancellation: "Cancel anytime in your App Store or Google Play account settings",
  sharedCancellation: "Subscriptions can be cancelled anytime in your App Store or Google Play account settings.",
  alwaysFree: "Still free for everyone: the offline map with all pins and search, 5 curated trips, road conditions forum, travel advice and emergency numbers.",
  conservation: "A portion of every subscription supports conservation and community partners in Namibia.",
  // Placeholder wording: pending legal review (and a check of the weather data provider's terms).
  alertsDisclaimer: "Alerts and forecasts depend on your device's GPS, connection and settings and on third-party data, and may be delayed, change, or be unavailable in some conditions.",
  foundingLine: "Founding member price for early Premium members.",
  includedToday: "Included today", comingSoon: "Coming soon",
  alertsBody: "Get alerts when you're near park gates and safety zones. We'll let you know the moment they launch.",
  skySheetTitle: `${FEATURE_NAMES.sky_alerts.name} is coming soon`,
  skyBody: "Get alerts for meteor showers and other sky events, plus multi-day weather forecasts. We'll let you know when it's ready.",
  notify: "Notify me", notified: "You're on the list",
  notifyRow: (feature: string) => `${feature}: you'll be notified when it launches`,
  notNow: "Not now", seePremium: "See Premium", seePlans: "See Premium plans", getPremium: "Get Premium",
  rentalNudge: `Planning to self-drive? Premium members get ${RENTAL_DISCOUNT_PERCENT}% off car rentals booked through Pocket Guide.`,
  rentalChip: `Premium member: your ${RENTAL_DISCOUNT_PERCENT}% discount will be noted on this inquiry.`,
  rentalTitle: "Rental inquiry", rentalSent: "Inquiry sent", rentalConfirmation: "Your rental inquiry has been sent.",
  expiredPass: "Your Trip Pass has ended", expiredPremium: "Your Premium has ended",
  anotherPass: "Get another Trip Pass", viewPlans: "View plans", renew: "Renew Premium",
  onceVisiting: "Only visiting once? You can turn off auto-renew now and keep Premium for your full first year.",
  manageRenewal: "Manage renewal", manageSheet: "This opens your App Store or Google Play subscription settings.", gotIt: "Got it",
  search: "Search places", filterTitle: "Filter the map", filterTrip: "Only along my trip", showAll: "Show all", apply: "Apply",
  restore: "Restore purchases", terms: "Terms of Use", privacy: "Privacy Policy", eula: "EULA",
};
const base = { headline: "Your Namibia, without limits.", sub: "Plan more, print it, and stay informed on the road." };
export const TRIGGER_COPY: Record<Trigger, { headline: string; sub: string }> = {
  sidebar: base, nudge: base, rental: base,
  trip3: { headline: `You've reached your ${FREE_CAP_TRIPS} free trips.`, sub: `Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.` },
  pdf: { headline: "Take your itinerary offline, on paper.", sub: "Export and print any trip with Premium." },
  alerts: { headline: "Stay informed as you drive.", sub: "Get alerts when you're near park gates and safety zones." },
  sky: { headline: "Know what's overhead and ahead.", sub: "Get alerts for meteor showers and other sky events, plus multi-day weather forecasts." },
  map: { headline: "Filter the map to what matters.", sub: "Premium members see only what's relevant to their trip." },
};
export const alertsSheetTitle = () => `Live alerts are coming ${LIVE_ALERTS_RELEASE_LABEL}`;
export type FeatureItem = { name: string; desc?: string; tag?: string };
export function featureGroups(id: PlanId, s: OfferSettings) {
  const included: FeatureItem[] = [{ name: `Up to ${PREMIUM_CAP_TRIPS} custom trips` }, { name: "PDF export & print" }, { ...FEATURE_NAMES.pin_filter }];
  const coming: FeatureItem[] = [];
  if (s.sky === "released") included.push({ ...FEATURE_NAMES.sky_alerts });
  if (s.rental && RENTAL_DISCOUNT_PLANS.includes(id)) included.push({ name: `${RENTAL_DISCOUNT_PERCENT}% discount on Pocket Guide-booked car rentals` });
  if (s.alerts === "released") included.splice(3, 0, { ...FEATURE_NAMES.live_alerts });
  else if (!(id === "trip_pass" && s.alerts === "coming_soon")) coming.push({ ...FEATURE_NAMES.live_alerts, tag: s.alerts === "coming_soon" ? LIVE_ALERTS_RELEASE_LABEL : "Early access" });
  if (s.sky === "coming_soon") coming.push({ ...FEATURE_NAMES.sky_alerts, tag: "Coming soon" });
  return { included, coming };
}
export function planExtras(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return [`Valid ${PLANS.trip_pass.days} days from purchase · one-time payment · no auto-renewal`];
  if (id === "monthly") return ["Renews monthly until you cancel"];
  return [...(s.trial ? [`${PLANS.yearly.trialDays}-day free trial`] : []), `Auto-renews yearly at ${money(PLANS.yearly.price)} until you cancel`];
}
const yearlyIntro = (s: OfferSettings) => `${s.trial ? `${PLANS.yearly.trialDays}-day free trial, then ` : ""}${launchEnabled(s) ? `${money(PLANS.yearly.firstYearPrice)} for the first year, then ` : ""}`;
export function disclosure(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `One-time payment of ${money(PLANS.trip_pass.price)} for ${PLANS.trip_pass.days} days of Premium. Does not auto-renew.`;
  if (id === "monthly") return `${money(PLANS.monthly.price)} per month. Renews automatically each month until you cancel.`;
  return `${yearlyIntro(s)}${money(PLANS.yearly.price)} per year. Renews automatically until you cancel.`.replace(/^./, c => c.toUpperCase());
}
// Sticky-bar summary, built from the same pieces as the card's terms line.
export function summary(id: PlanId, s: OfferSettings) {
  if (id !== "yearly") return disclosure(id, s);
  return `${yearlyIntro(s)}${money(PLANS.yearly.price)}/year. Auto-renews until you cancel.`.replace(/^./, c => c.toUpperCase());
}
export function ctaLabel(id: PlanId, _s: OfferSettings) {
  return id === "trip_pass" ? "Get Trip Pass" : id === "monthly" ? "Subscribe monthly" : COPY.getPremium;
}
export function priceParts(id: PlanId, s: OfferSettings): [string, string?] {
  if (id === "trip_pass") return [`${money(PLANS.trip_pass.price)} · one-time payment · ${PLANS.trip_pass.days} days`];
  if (id === "monthly") return [`${money(PLANS.monthly.price)}/month`];
  return launchEnabled(s) ? [`${money(PLANS.yearly.firstYearPrice)} first year`, `then ${money(PLANS.yearly.price)}/year`] : [`${money(PLANS.yearly.price)}/year`];
}
export const priceLabel = (id: PlanId, s: OfferSettings) => priceParts(id, s).join(" · ");
export const offerEndLine = (s: OfferSettings) => s.offerEnd?.trim() ? ` Available until ${s.offerEnd.trim()}.` : "";
export const renewalLine = (s: OfferSettings, date: string) => `Renews on ${date} at ${money(PLANS.yearly.price)}/year`;
// In production: a local or push notification plus this in-app card, scheduled RENEWAL_REMINDER_DAYS before renewal.
export const reminderLine = (date: string) => `Your Premium renews in ${RENEWAL_REMINDER_DAYS} days, on ${date}, for ${money(PLANS.yearly.price)}.`;
export function nudgeCopy(s: OfferSettings) {
  const prefix = `Trip saved. You've used 1 of ${FREE_CAP_TRIPS} free trips. Premium includes up to ${PREMIUM_CAP_TRIPS} trips, PDF export, the ${FEATURE_NAMES.pin_filter.name}`;
  const inc: string[] = []; const coming: string[] = [];
  (s.sky === "released" ? inc : coming).push(FEATURE_NAMES.sky_alerts.name);
  if (s.alerts === "coming_soon") coming.push(`live location alerts`); else inc.push("live location alerts");
  const list = inc.length ? `${inc.length > 1 ? ", " + inc.slice(0, -1).join(", ") : ""} and ${inc[inc.length - 1]}` : "";
  const included = inc.length ? `${prefix}${list}.` : `${prefix.replace(/, the /, " and the ")}.`;
  if (!coming.length) return included;
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  const comingText = coming.map(c => c === "live location alerts" ? `Live location alerts are coming ${LIVE_ALERTS_RELEASE_LABEL}` : `${cap(c)} is coming soon`).join(". ");
  return `${included} ${comingText}.`;
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
