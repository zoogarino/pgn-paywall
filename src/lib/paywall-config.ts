// Final prototype copy and offers. Store offer compatibility must be confirmed before launch.
export const CURRENCY = "$";
export const money = (n: number) => `${CURRENCY}${n.toFixed(2)}`;
export type PlanId = "trip_pass" | "yearly" | "monthly";
export type AlertsStatus = "coming_soon" | "early_access" | "released";
export type PremiumAccent = "gold" | "terracotta";
export type Trigger = "sidebar" | "trip3" | "pdf" | "alerts" | "nudge" | "map" | "rental";
export type UserState = "free" | "active" | "expired";
export const PLANS = {
  trip_pass: { id: "trip_pass", name: "90-Day Trip Pass", price: 24.99, days: 90, renews: false },
  yearly: { id: "yearly", name: "Yearly Premium", price: 49.99, firstYearPrice: 19.99, trialDays: 5, renews: true },
  monthly: { id: "monthly", name: "Monthly Premium", price: 9.99, renews: true },
} as const;
export const PLAN_ORDER: PlanId[] = ["trip_pass", "yearly", "monthly"];
export const DEFAULT_HIGHLIGHTED_PLAN: PlanId = "trip_pass";
export const YEARLY_LAUNCH_PRICE_ON = true;
export const YEARLY_FREE_TRIAL_ON = true;
export const RENTAL_DISCOUNT_ON = true;
export const RENTAL_DISCOUNT_PLANS: PlanId[] = ["trip_pass", "yearly"];
export const RENTAL_DISCOUNT_PERCENT = 3;
export const LIVE_ALERTS_STATUS: AlertsStatus = "coming_soon";
export const LIVE_ALERTS_RELEASE_LABEL = "February 2027";
export const PREMIUM_ACCENT: PremiumAccent = "gold";
export const FREE_CAP_TRIPS = 2;
export const PREMIUM_CAP_TRIPS = 20;
export type OfferSettings = { launch: boolean; trial: boolean; rental: boolean; alerts: AlertsStatus };
export const DEFAULT_SETTINGS: OfferSettings = { launch: YEARLY_LAUNCH_PRICE_ON, trial: YEARLY_FREE_TRIAL_ON, rental: RENTAL_DISCOUNT_ON, alerts: LIVE_ALERTS_STATUS };
export const launchEnabled = (s: OfferSettings) => s.launch && s.alerts !== "released";
export const saving = (price: number) => Math.round((1 - price / (PLANS.monthly.price * 12)) * 100);
export const COPY = {
  best: "Best for your trip", launchBadge: "Launch price - first year only",
  cancellation: "Cancel anytime in your App Store or Google Play account settings",
  sharedCancellation: "Subscriptions can be cancelled anytime in your App Store or Google Play account settings.",
  alwaysFree: "Still free for everyone: the offline map with all pins and search, 5 curated trips, road conditions forum, travel advice and emergency numbers.",
  conservation: "A portion of every subscription supports conservation and community partners in Namibia.",
  // Placeholder wording: pending legal review.
  alertsDisclaimer: "Location alerts depend on your device's GPS and settings and may be delayed or unavailable in some conditions.",
  alertsBody: "Get alerts when you're near park gates and safety zones. We'll let you know the moment they launch.",
  notify: "Notify me", notified: "You're on the list", notifyRow: "Live alerts: you'll be notified when they launch",
  notNow: "Not now", seePremium: "See Premium", seePlans: "See Premium plans",
  rentalNudge: "Planning to self-drive? Premium members get an exclusive rate on their rental quote.",
  rentalTitle: "Rental inquiry", rentalSent: "Inquiry sent", rentalConfirmation: "Your rental inquiry has been sent.",
  expiredPass: "Your Trip Pass has ended", expiredPremium: "Your Premium access has ended",
  anotherPass: "Get another Trip Pass", viewPlans: "View plans",
  search: "Search places", filterTitle: "Filter the map", filterTrip: "Only along my trip", showAll: "Show all", apply: "Apply",
  restore: "Restore purchases", terms: "Terms of Use", privacy: "Privacy Policy", eula: "EULA",
};
export const TRIGGER_COPY: Record<Trigger, { headline: string; sub: string }> = {
  sidebar: { headline: "Your Namibia, without limits.", sub: "Plan more, print it, and stay informed on the road." },
  trip3: { headline: `You've reached your ${FREE_CAP_TRIPS} free trips.`, sub: `Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.` },
  pdf: { headline: "Take your itinerary offline, on paper.", sub: "Export and print any trip with Premium." },
  alerts: { headline: "Stay informed as you drive.", sub: "Get alerts when you're near park gates and safety zones." },
  map: { headline: "Filter the map to what matters.", sub: "Premium members see only what's relevant to their trip." },
  nudge: { headline: "Your Namibia, without limits.", sub: "Plan more, print it, and stay informed on the road." },
  rental: { headline: "Your Namibia, without limits.", sub: "Plan more, print it, and stay informed on the road." },
};
export function alertsLabel(status: AlertsStatus) {
  return status === "coming_soon" ? `Live location alerts (coming ${LIVE_ALERTS_RELEASE_LABEL})` : status === "early_access" ? "Live location alerts (early access)" : "Live location alerts";
}
export const alertsTag = (status: AlertsStatus) => status === "coming_soon" ? "Coming soon" : status === "early_access" ? "Early access" : "";
export const alertsSheetTitle = () => `Live alerts are coming ${LIVE_ALERTS_RELEASE_LABEL}`;
export function features(id: PlanId, s: OfferSettings) {
  const items = [`Up to ${PREMIUM_CAP_TRIPS} custom trips`, "PDF export & print", "Pin filtering"];
  if (id !== "trip_pass" || s.alerts !== "coming_soon") items.push(alertsLabel(s.alerts));
  if (s.rental && RENTAL_DISCOUNT_PLANS.includes(id)) items.push(`${RENTAL_DISCOUNT_PERCENT}% discount on Pocket Guide-booked car rentals`);
  return items;
}
export function planExtras(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return [`Valid ${PLANS.trip_pass.days} days from purchase · one-time payment · no auto-renewal`];
  if (id === "monthly") return ["Renews monthly until you cancel"];
  return [...(s.trial ? [`${PLANS.yearly.trialDays}-day free trial`] : []), "Auto-renews yearly until you cancel"];
}
export function disclosure(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `One-time payment of ${money(PLANS.trip_pass.price)} for ${PLANS.trip_pass.days} days of Premium. Does not auto-renew.`;
  if (id === "monthly") return `${money(PLANS.monthly.price)} per month. Renews automatically each month until you cancel.`;
  return `${s.trial ? `${PLANS.yearly.trialDays}-day free trial, then ` : ""}${launchEnabled(s) ? `${money(PLANS.yearly.firstYearPrice)} for the first year, then ` : ""}${money(PLANS.yearly.price)} per year. Renews automatically until you cancel.`;
}
export function ctaLabel(id: PlanId, s: OfferSettings) {
  return id === "trip_pass" ? "Get Trip Pass" : id === "monthly" ? "Subscribe monthly" : s.trial ? `Start ${PLANS.yearly.trialDays}-day free trial` : "Start yearly Premium";
}
export function priceLabel(id: PlanId, s: OfferSettings) {
  if (id === "trip_pass") return `${money(PLANS.trip_pass.price)} · one-time payment · ${PLANS.trip_pass.days} days`;
  if (id === "monthly") return `${money(PLANS.monthly.price)}/month`;
  return launchEnabled(s) ? `${money(PLANS.yearly.firstYearPrice)} first year · then ${money(PLANS.yearly.price)}/year` : `${money(PLANS.yearly.price)}/year`;
}
// Summary shares the exact card disclosure so billing promises never diverge.
export const summary = disclosure;
export function yearlySaving(s: OfferSettings) {
  return launchEnabled(s) ? `Launch price, available until live alerts launch. Save ${saving(PLANS.yearly.firstYearPrice)}% vs monthly in year one, ${saving(PLANS.yearly.price)}% after.` : `Save ${saving(PLANS.yearly.price)}% vs monthly.`;
}
export function nudgeCopy(s: OfferSettings) {
  const prefix = `Trip saved. You've used 1 of ${FREE_CAP_TRIPS} free trips. Premium includes up to ${PREMIUM_CAP_TRIPS} trips`;
  return s.alerts === "coming_soon" ? `${prefix}, PDF export and pin filtering. Live location alerts are coming ${LIVE_ALERTS_RELEASE_LABEL}.` : `${prefix} and live location alerts for drives like this.`;
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
