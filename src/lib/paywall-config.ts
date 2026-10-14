// Edit prices, plans and copy here. Everything in the prototype reads from this file.
export const CURRENCY = "$";
export const money = (n: number) => `${CURRENCY}${n.toFixed(2)}`;

export type PlanId = "trip_pass" | "yearly" | "monthly";

export const PLANS: Record<PlanId, { id: PlanId; name: string; price: number; period: string; renews: boolean; days?: number; trialDays?: number }> = {
  yearly: { id: "yearly", name: "Yearly Premium", price: 44.99, period: "year", renews: true, trialDays: 5 },
  trip_pass: { id: "trip_pass", name: "60-Day Trip Pass", price: 24.99, period: "once", renews: false, days: 60 },
  monthly: { id: "monthly", name: "Monthly Premium", price: 9.99, period: "month", renews: true },
};

export const PLAN_ORDER: PlanId[] = ["yearly", "trip_pass", "monthly"];

export const LAUNCH_OFFER = { label: "Launch offer", percentOff: 80, firstYearPrice: 8.99 };
export const DEFAULT_HIGHLIGHTED_PLAN: PlanId = "yearly";
export const FREE_CAP_TRIPS = 2;
export const PREMIUM_CAP_TRIPS = 20;

export type Trigger = "sidebar" | "trip3" | "pdf" | "alerts" | "nudge";

export const TRIGGER_COPY: Record<Exclude<Trigger, "nudge">, { headline: string; sub: string }> = {
  sidebar: { headline: "Your Namibia, without limits.", sub: "Plan more, print it, and stay informed on the road." },
  trip3: { headline: `You've reached your ${FREE_CAP_TRIPS} free trips.`, sub: `Premium lets you plan up to ${PREMIUM_CAP_TRIPS}.` },
  pdf: { headline: "Take your itinerary offline, on paper.", sub: "Export and print any trip with Premium." },
  alerts: { headline: "Stay informed as you drive.", sub: "Get gate times, safety zones and local tips along your route." },
};

export const BENEFITS = [
  { key: "trips", title: `Up to ${PREMIUM_CAP_TRIPS} custom trips`, note: `Free plan: ${FREE_CAP_TRIPS}` },
  { key: "pdf", title: "PDF export and print of your itineraries" },
  { key: "alerts", title: "Live location alerts", note: "Park gate times, safety zones and local recommendations as you drive" },
  { key: "emergency", title: "Emergency tools", note: "One-tap emergency call, share your GPS position, nearest hospitals" },
] as const;

export function ctaLabel(id: PlanId) {
  return id === "yearly" ? `Start ${PLANS.yearly.trialDays}-day free trial` : id === "trip_pass" ? "Get Trip Pass" : "Subscribe monthly";
}

const CANCEL = "Cancel anytime in your App Store or Google Play account settings.";

export function disclosure(id: PlanId, launch: boolean) {
  const p = PLANS[id];
  if (id === "trip_pass") return `One-time payment of ${money(p.price)}. Gives ${p.days} days of Premium access. Does not auto-renew.`;
  if (id === "monthly") return `${money(p.price)} per month. Renews automatically each month until you cancel. ${CANCEL}`;
  return launch
    ? `${p.trialDays}-day free trial, then ${money(LAUNCH_OFFER.firstYearPrice)} for the first year, then ${money(p.price)} per year. Renews automatically until you cancel. ${CANCEL}`
    : `${p.trialDays}-day free trial, then ${money(p.price)} per year. Renews automatically until you cancel. ${CANCEL}`;
}

export function checkoutPrice(id: PlanId, launch: boolean) {
  const p = PLANS[id];
  if (id === "yearly") return `Free for ${p.trialDays} days, then ${money(launch ? LAUNCH_OFFER.firstYearPrice : p.price)}/year`;
  if (id === "trip_pass") return `${money(p.price)} one-time`;
  return `${money(p.price)}/month`;
}

export const fmtDate = (daysOut: number) =>
  new Date(Date.now() + daysOut * 864e5).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
