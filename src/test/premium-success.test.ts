import { describe, expect, it } from "vitest";
import { billingDate, DEFAULT_SETTINGS, successDetails, successContinuation, successPlanned, type SuccessPurchase } from "@/lib/paywall-config";
const purchase: SuccessPurchase = { plan: "yearly", settings: { ...DEFAULT_SETTINGS }, trigger: "sidebar", purchasedAt: "2026-10-20T08:38:00.000Z" };
describe("Success purchase rules", () => {
  it("charges the yearly renewal one calendar year from purchase", () => {
    expect(successDetails(purchase).nextChargeAt).toBe("2027-10-20T08:38:00.000Z");
  });
  it("ends a Trip Pass after 90 days", () => {
    expect(successDetails({ ...purchase, plan: "trip_pass" }).nextChargeAt).toBe("2027-01-18T08:38:00.000Z");
  });
  it("renews monthly after one calendar month, not 30 days", () => {
    expect(successDetails({ ...purchase, plan: "monthly" }).nextChargeAt).toBe("2026-11-20T08:38:00.000Z");
    expect(billingDate("2027-01-31T08:38:00.000Z", "month", 1)).toBe("2027-02-28T08:38:00.000Z");
  });
  it("clamps leap day yearly renewals to the end of February", () => {
    expect(billingDate("2028-02-29T08:38:00.000Z", "year", 1)).toBe("2029-02-28T08:38:00.000Z");
  });
  it("starts yearly billing after the eligible five-day trial", () => {
    expect(successDetails({ ...purchase, settings: { ...purchase.settings, trial: true } }).nextChargeAt).toBe("2027-10-25T08:38:00.000Z");
  });
  it("never grants a trial to an ineligible purchase", () => {
    expect(successDetails({ ...purchase, settings: { ...purchase.settings, trial: true, eligible: false } }).nextChargeAt).toBe("2027-10-20T08:38:00.000Z");
  });
  it("only continues into Live Guide when early access or released", () => {
    expect(successContinuation({ ...purchase, trigger: "alerts" }).destination).toBe("main");
    for (const alerts of ["early_access", "released"] as const) expect(successContinuation({ ...purchase, trigger: "alerts", settings: { ...purchase.settings, alerts } }).destination).toBe("alerts");
  });
  it("routes the map purchase to its filter sheet", () => {
    expect(successContinuation({ ...purchase, trigger: "map" }).destination).toBe("map_filter");
  });
  it("offers planned-feature notifications to Trip Pass purchases too", () => {
    expect(successPlanned({ ...purchase, plan: "trip_pass" }).map(f => f.id)).toEqual(["live_guide", "emergency_support"]);
  });
  it("lists only planned features and hides the group when none remain", () => {
    expect(successPlanned(purchase).map(f => f.id)).toEqual(["live_guide", "emergency_support"]);
    expect(successPlanned({ ...purchase, settings: { ...purchase.settings, alerts: "released", emergency: "released" } })).toEqual([]);
    expect(successPlanned({ ...purchase, settings: { ...purchase.settings, sky: "coming_soon" } }).map(f => f.id)).toEqual(["live_guide", "emergency_support", "sky_outlook"]);
  });
});