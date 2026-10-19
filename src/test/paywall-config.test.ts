import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, visiblePlans, resolveHighlight, featureGroups, disclosure, summary, priceLabel, ctaLabel, nudgeCopy, offerEndLine } from "@/lib/paywall-config";
const S = DEFAULT_SETTINGS;
describe("Phase 1 annual-only offer", () => {
  it("shows only the yearly plan by default and falls back to it", () => {
    expect(visiblePlans(S)).toEqual(["yearly"]);
    expect(resolveHighlight("trip_pass", S)).toBe("yearly");
    expect(visiblePlans({ ...S, showTripPass: true, showMonthly: true })).toEqual(["trip_pass", "yearly", "monthly"]);
  });
  it("pairs $9.99 with the $44.99 renewal everywhere", () => {
    expect(priceLabel("yearly", S)).toBe("$9.99 first year · then $44.99/year");
    expect(disclosure("yearly", S)).toBe("$9.99 for the first year, then $44.99 per year. Renews automatically until you cancel.");
    expect(summary("yearly", S)).toBe("$9.99 for the first year, then $44.99/year. Auto-renews until you cancel.");
    expect(ctaLabel("yearly", S)).toBe("Get Premium");
  });
  it("handles intro price off and trial on", () => {
    expect(disclosure("yearly", { ...S, launch: false })).toBe("$44.99 per year. Renews automatically until you cancel.");
    expect(disclosure("yearly", { ...S, trial: true })).toMatch(/^5-day free trial, then \$9\.99/);
  });
  it("groups features by status", () => {
    const g = featureGroups("yearly", S);
    expect(g.included.map(i => i.name)).toContain("Sky Outlook");
    expect(g.coming).toEqual([expect.objectContaining({ name: "Live location alerts", tag: "February 2027" })]);
    const g2 = featureGroups("yearly", { ...S, sky: "coming_soon", alerts: "released" });
    expect(g2.coming.map(i => i.name)).toEqual(["Sky Outlook"]);
    expect(g2.included.map(i => i.name)).toContain("Live location alerts");
    expect(featureGroups("trip_pass", S).coming).toEqual([]);
  });
  it("only claims an end date when set", () => {
    expect(offerEndLine(S)).toBe("");
    expect(offerEndLine({ ...S, offerEnd: "31 March 2027" })).toBe(" Available until 31 March 2027.");
  });
  it("builds the nudge from statuses", () => {
    expect(nudgeCopy(S)).toBe("Trip saved. You've used 1 of 2 free trips. Premium includes up to 20 trips, PDF export, the Location filter and Sky Outlook. Live location alerts are coming February 2027.");
    expect(nudgeCopy({ ...S, alerts: "released" })).toBe("Trip saved. You've used 1 of 2 free trips. Premium includes up to 20 trips, PDF export, the Location filter, Sky Outlook and live location alerts.");
  });
});
