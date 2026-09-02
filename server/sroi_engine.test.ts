import { describe, it, expect } from "vitest";
import * as sroiEngine from "./sroiEngine";

describe("Predictive Social Return on Investment (SROI) ML Engine & Co-Funding", () => {
  it("should calculate SROI forecast for healthcare triage with ER diversion metrics", () => {
    const forecast = sroiEngine.calculateSroiForecast("healthcare", 1500, 15000, 1.0);

    expect(forecast).toBeDefined();
    expect(forecast.sroiMultiplier).toBeGreaterThanOrEqual(4.0);
    expect(forecast.totalEconomicValueCreated).toBeGreaterThan(1000000);
    expect(forecast.netSocialReturn).toBeGreaterThan(0);
    expect(forecast.primaryOutcomeMetric.name).toContain("Emergency Room (ER) Diversions");
    expect(forecast.primaryOutcomeMetric.quantity).toBeGreaterThan(0);
    expect(forecast.threeYearProjection.cumulativeTotalUsd).toBeGreaterThan(forecast.threeYearProjection.year1Usd);
    expect(forecast.confidenceInterval.confidencePct).toBe(95);
  });

  it("should calculate SROI forecast across education, transit, and legal sectors with verified benchmarks", () => {
    const edu = sroiEngine.calculateSroiForecast("education", 1200, 8000, 1.0);
    expect(edu.sroiMultiplier).toBeGreaterThanOrEqual(3.5);

    const legal = sroiEngine.calculateSroiForecast("legal", 800, 5000, 1.0);
    expect(legal.sroiMultiplier).toBeGreaterThanOrEqual(4.0);

    const transit = sroiEngine.calculateSroiForecast("transit", 1000, 20000, 1.0);
    expect(transit.sroiMultiplier).toBeGreaterThanOrEqual(3.0);
  });

  it("should list active co-funding campaigns and process foundation cash match pledges", () => {
    const campaigns = sroiEngine.getCoFundingCampaignsList();
    expect(campaigns.length).toBeGreaterThanOrEqual(3);

    const campaign = campaigns[0];
    const initialMatched = campaign.foundationGrantFunding.currentMatchedUsd;

    const updated = sroiEngine.pledgeFoundationCoFundingMatch(
      campaign.id,
      10000,
      "Rockefeller Philanthropy Advisors"
    );

    expect(updated.foundationGrantFunding.currentMatchedUsd).toBe(initialMatched + 10000);
  });
});
