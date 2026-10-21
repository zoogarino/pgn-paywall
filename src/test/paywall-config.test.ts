import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, visiblePlans, resolveHighlight, featureGroups, finePrint, summary, priceLabel, ctaLabel, nudgeCopy, badgeText, paywallFeatures, paywallCopy, rentalNudge, TRIGGER_COPY, COPY } from "@/lib/paywall-config";
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
    expect(finePrint("trip_pass", S)).toBe("One-time payment of $24.99 for 90 days of Premium. Does not auto-renew.");
    expect(finePrint("monthly", S)).toBe("$9.99/month. Renews automatically each month until you cancel in your App Store or Google Play settings.");
  });
  it("CTA labels", () => {
    expect(ctaLabel("yearly", S)).toBe("Get Premium – $9.99 first year");
    expect(ctaLabel("yearly", { ...S, launch: false })).toBe("Get Premium – $44.99/year");
    expect(ctaLabel("trip_pass", S)).toBe("Get Trip Pass – $24.99");
    expect(ctaLabel("monthly", S)).toBe("Get Monthly – $9.99/month");
  });
  it("$9.99 always pairs with $44.99", () => {
    expect(priceLabel("yearly", S)).toBe("$9.99 first year · then $44.99/year");
    expect(summary("yearly", S)).toContain("then $44.99/year");
  });
  it("ineligible users never see the intro price or badge", () => {
    expect(finePrint("yearly", NE)).toBe("$44.99/year. Renews automatically until you cancel in your App Store or Google Play settings.");
    expect(ctaLabel("yearly", NE)).toBe("Renew Premium – $44.99/year");
    expect(badgeText("yearly", NE)).toBeNull();
    expect(paywallCopy("sidebar", NE).headline).toBe("Welcome back to Premium");
    expect(paywallCopy("pdf", NE).headline).toBe("Take your itinerary offline, on paper.");
  });
  it("badge shows end date only when set", () => {
    expect(badgeText("yearly", S)).toBe("Founding member price");
    expect(badgeText("yearly", { ...S, offerEnd: "1 May" })).toBe("Founding member price · until 1 May");
  });
  it("feature order, trigger highlight and status groups", () => {
    const g = paywallFeatures("yearly", S, "sidebar");
    expect(g.included.map(f => f.id)).toEqual(["location_filter", "rental_discount", "custom_trips", "pdf_export", "sky_outlook"]);
    expect(g.coming).toEqual([expect.objectContaining({ id: "live_guide", tag: "February 2027" }), expect.objectContaining({ id: "emergency_support" })]);
    expect(paywallFeatures("yearly", S, "pdf").included[0]).toMatchObject({ id: "pdf_export", highlight: true });
    const e = paywallFeatures("yearly", { ...S, alerts: "early_access" }, "sidebar");
    expect(e.early.map(f => f.id)).toEqual(["live_guide"]); expect(e.coming.map(f => f.id)).toEqual(["emergency_support"]);
    const sky = paywallFeatures("yearly", { ...S, sky: "coming_soon" }, "sidebar");
    expect(sky.coming.find(f => f.id === "sky_outlook")?.tag).toBeUndefined();
  });
  it("moves the Early access group above Included today only for an early-access trigger", () => {
    const early = { ...S, alerts: "early_access" as const };
    const triggered = paywallFeatures("yearly", early, "alerts");
    expect(triggered.earlyFirst).toBe(true);
    expect(triggered.early[0]).toMatchObject({ id: "live_guide", highlight: true });
    expect(paywallFeatures("yearly", early, "sidebar").earlyFirst).toBe(false);
    expect(paywallFeatures("yearly", S, "alerts").earlyFirst).toBe(false);
  });
  it("marks only the rental discount as missing from Monthly", () => {
    const M = { ...S, showMonthly: true, showTripPass: true };
    expect(paywallFeatures("monthly", M, "sidebar").included.find(f => f.id === "rental_discount")?.available).toBe(false);
    expect(paywallFeatures("trip_pass", M, "sidebar").coming.find(f => f.id === "live_guide")?.available).toBe(true);
  });
  it("includes planned features in the Trip Pass checklist", () => {
    expect(featureGroups("trip_pass", S).coming.map(f => f.id)).toEqual(["live_guide", "emergency_support"]);
  });
  it("defaults Emergency Support to planned without a release date", () => {
    expect(S.emergency).toBe("coming_soon");
    expect(paywallFeatures("yearly", S, "sidebar").coming.find(f => f.id === "emergency_support")).toMatchObject({ available: true });
    expect(paywallFeatures("yearly", S, "sidebar").coming.find(f => f.id === "emergency_support")?.tag).toBeUndefined();
  });
  it("includes unreleased Emergency Support in the Trip Pass", () => {
    for (const emergency of ["coming_soon", "early_access"] as const) {
      const groups = paywallFeatures("trip_pass", { ...S, showTripPass: true, emergency }, "sidebar");
      expect([...groups.coming, ...groups.early].find(f => f.id === "emergency_support")?.available).toBe(true);
    }
  });
  it("includes released Emergency Support in Trip Pass and the active checklist", () => {
    const settings = { ...S, emergency: "released" as const };
    expect(paywallFeatures("trip_pass", settings, "sidebar").included.find(f => f.id === "emergency_support")?.available).toBe(true);
    expect(featureGroups("trip_pass", settings).included.some(f => f.name === "Emergency Support")).toBe(true);
  });
  it("places early-access Emergency Support in the active early group", () => {
    expect(featureGroups("yearly", { ...S, emergency: "early_access" }).early.some(f => f.name === "Emergency Support")).toBe(true);
  });
});
describe("Follow-up copy rules", () => {
  it("uses the updated Live Guide headline and subline", () => {
    expect(TRIGGER_COPY.alerts.headline).toBe("Stay informed as you travel.");
    expect(TRIGGER_COPY.alerts.sub).toBe("Tips and info based on live location");
  });
  it("post-save nudge bodies per save number", () => {
    expect(nudgeCopy(1)).toBe("You've used 1 of 2 free trips. Premium lets you plan up to 20.");
    expect(nudgeCopy(2)).toBe("That was your last free trip. Premium lets you plan up to 20.");
  });
  it("opens the nudge paywall in the trip context with custom trips on top", () => {
    expect(TRIGGER_COPY.nudge.headline).toBe("Plan up to 20 trips with Premium.");
    expect(TRIGGER_COPY.nudge.sub).toBe("You've used 1 of 2 free trips.");
    expect(paywallFeatures("yearly", S, "nudge").included[0]).toMatchObject({ id: "custom_trips", highlight: true });
  });
  it("rental banner and paywall subline switch between example and fallback", () => {
    expect(rentalNudge(S)).toBe("Planning to self-drive? Premium members save 3% on rentals booked through Pocket Guide. On a $1,500 rental, that's $45.");
    expect(rentalNudge({ ...S, rentalExample: false })).toBe("Planning to self-drive? Premium members save 3% on every rental booked through Pocket Guide. On a multi-day 4x4 hire, that adds up.");
    const row = (s: typeof S) => paywallFeatures("yearly", s, "sidebar").included.find(f => f.id === "rental_discount");
    expect(row(S)?.desc).toBe("e.g. $45 off a $1,500 rental");
    expect(row({ ...S, rentalExample: false })?.desc).toBe("On every rental booked through Pocket Guide");
  });
  it("uses the rental trigger headline", () => {
    expect(TRIGGER_COPY.rental.headline).toBe("Save on your self-drive.");
  });
  it("conservation line covers every purchase", () => {
    expect(COPY.conservation).toContain("every purchase");
  });
});
import { rentalEligible } from "@/lib/paywall-config";
describe("Rental discount eligibility", () => {
  it("requires the discount on and a Yearly or Trip Pass plan", () => {
    expect(rentalEligible("yearly", S)).toBe(true);
    expect(rentalEligible("trip_pass", S)).toBe(true);
    expect(rentalEligible("monthly", S)).toBe(false);
    expect(rentalEligible("yearly", { ...S, rental: false })).toBe(false);
  });
});
