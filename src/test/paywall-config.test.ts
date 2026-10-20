import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, visiblePlans, resolveHighlight, featureGroups, finePrint, summary, priceLabel, ctaLabel, nudgeCopy, badgeText, paywallFeatures, paywallCopy, trialLine } from "@/lib/paywall-config";
const S = DEFAULT_SETTINGS;
const NE = { ...S, eligible: false };
describe("Paywall offer rules", () => {
  it("shows only the yearly plan by default and falls back to it", () => {
    expect(visiblePlans(S)).toEqual(["yearly"]);
    expect(resolveHighlight("trip_pass", S)).toBe("yearly");
  });
  it("fine print per plan and flags", () => {
    expect(finePrint("yearly", S)).toBe("$9.99 for the first year, then $44.99/year. Renews automatically until you cancel in your App Store or Google Play settings.");
    expect(finePrint("yearly", { ...S, launch: false })).toBe("$44.99/year. Renews automatically until you cancel in your App Store or Google Play settings.");
    expect(finePrint("yearly", { ...S, trial: true })).toBe("5-day free trial, then $9.99 for the first year, then $44.99/year. Renews automatically until you cancel in your App Store or Google Play settings.");
    expect(finePrint("trip_pass", S)).toBe("One-time payment of $24.99 for 90 days of Premium. Does not auto-renew.");
    expect(finePrint("monthly", S)).toBe("$9.99/month. Renews automatically each month until you cancel in your App Store or Google Play settings.");
  });
  it("CTA labels", () => {
    expect(ctaLabel("yearly", S)).toBe("Get Premium – $9.99 first year");
    expect(ctaLabel("yearly", { ...S, launch: false })).toBe("Get Premium – $44.99/year");
    expect(ctaLabel("yearly", { ...S, trial: true })).toBe("Start 5-day free trial");
    expect(ctaLabel("trip_pass", S)).toBe("Get Trip Pass – $24.99");
    expect(ctaLabel("monthly", S)).toBe("Get Monthly – $9.99/month");
  });
  it("$9.99 always pairs with $44.99", () => {
    expect(priceLabel("yearly", S)).toBe("$9.99 first year · then $44.99/year");
    expect(summary("yearly", S)).toContain("then $44.99/year");
  });
  it("ineligible users never see the intro price, badge or trial", () => {
    const T = { ...NE, trial: true, offerEnd: "x" };
    expect(finePrint("yearly", T)).toBe("$44.99/year. Renews automatically until you cancel in your App Store or Google Play settings.");
    expect(ctaLabel("yearly", T)).toBe("Renew Premium – $44.99/year");
    expect(badgeText("yearly", T)).toBeNull();
    expect(trialLine(T)).toBeNull();
    expect(paywallCopy("sidebar", NE).headline).toBe("Welcome back to Premium");
    expect(paywallCopy("pdf", NE).headline).toBe("Take your itinerary offline, on paper.");
  });
  it("badge shows end date only when set", () => {
    expect(badgeText("yearly", S)).toBe("Founding member price");
    expect(badgeText("yearly", { ...S, offerEnd: "1 May" })).toBe("Founding member price · until 1 May");
  });
  it("feature order, trigger highlight and status groups", () => {
    const g = paywallFeatures("yearly", S, "sidebar");
    expect(g.included.map(f => f.id)).toEqual(["rental_discount", "custom_trips", "pdf_export", "location_filter", "sky_outlook"]);
    expect(g.coming).toEqual([expect.objectContaining({ id: "live_alerts", tag: "February 2027" })]);
    expect(paywallFeatures("yearly", S, "pdf").included[0]).toMatchObject({ id: "pdf_export", highlight: true });
    const e = paywallFeatures("yearly", { ...S, alerts: "early_access" }, "sidebar");
    expect(e.early.map(f => f.id)).toEqual(["live_alerts"]); expect(e.coming).toEqual([]);
    const sky = paywallFeatures("yearly", { ...S, sky: "coming_soon" }, "sidebar");
    expect(sky.coming.find(f => f.id === "sky_outlook")?.tag).toBeUndefined();
  });
  it("marks features the selected plan lacks", () => {
    const M = { ...S, showMonthly: true, showTripPass: true };
    expect(paywallFeatures("monthly", M, "sidebar").included.find(f => f.id === "rental_discount")?.available).toBe(false);
    expect(paywallFeatures("trip_pass", M, "sidebar").coming.find(f => f.id === "live_alerts")?.available).toBe(false);
  });
  it("keeps planned Live Guide unavailable in the Trip Pass checklist", () => {
    expect(featureGroups("trip_pass", S).coming).toEqual([]);
  });
});
