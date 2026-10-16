import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, PLAN_ORDER, features, disclosure, priceLabel, saving, launchEnabled, ctaLabel } from "@/lib/paywall-config";
describe("Final Premium offers", () => {
  it("leads with the non-renewing 90-day pass", () => {
    expect(PLAN_ORDER).toEqual(["trip_pass", "yearly", "monthly"]);
    expect(disclosure("trip_pass", DEFAULT_SETTINGS)).toBe("One-time payment of $24.99 for 90 days of Premium. Does not auto-renew.");
  });
  it("never sells coming-soon alerts on the Trip Pass", () => {
    expect(features("trip_pass", DEFAULT_SETTINGS).some(f => f.includes("alerts"))).toBe(false);
    expect(features("yearly", DEFAULT_SETTINGS).some(f => f.includes("coming February 2027"))).toBe(true);
    expect(features("trip_pass", { ...DEFAULT_SETTINGS, alerts: "early_access" }).some(f => f.includes("early access"))).toBe(true);
  });
  it("pairs launch and renewal prices and derives savings", () => {
    expect(priceLabel("yearly", DEFAULT_SETTINGS)).toContain("$19.99 first year · then $49.99/year");
    expect(saving(19.99)).toBe(83);
    expect(saving(49.99)).toBe(58);
  });
  it("ends the launch price on release and respects trial controls", () => {
    const settings = { ...DEFAULT_SETTINGS, alerts: "released" as const, trial: false };
    expect(launchEnabled(settings)).toBe(false);
    expect(priceLabel("yearly", settings)).toBe("$49.99/year");
    expect(disclosure("yearly", settings)).not.toContain("trial");
    expect(ctaLabel("yearly", settings)).toBe("Start yearly Premium");
  });
  it("limits rental discounts to eligible plans and the live switch", () => {
    expect(features("monthly", DEFAULT_SETTINGS).some(f => f.includes("rentals"))).toBe(false);
    expect(features("yearly", DEFAULT_SETTINGS).some(f => f.includes("3%"))).toBe(true);
    expect(features("yearly", { ...DEFAULT_SETTINGS, rental: false }).some(f => f.includes("rentals"))).toBe(false);
  });
});