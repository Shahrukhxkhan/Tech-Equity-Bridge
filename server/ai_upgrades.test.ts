import { describe, it, expect } from "vitest";
import * as db from "./db";

describe("AI & Matching Intelligence Upgrades (v2)", () => {
  it("should compute multi-dimensional semantic match score with dimensional breakdown", () => {
    const nonprofit = {
      organizationName: "Community Health Access Coalition",
      sector: "Healthcare & Immigration",
      mission: "Providing multilingual medical intake and health literacy to vulnerable families.",
      primaryNeeds: ["Multilingual AI Translation", "GPU Compute"],
      technicalProficiency: "intermediate",
    };

    const resource = {
      id: 1,
      title: "Multilingual Health Translation Agent",
      description: "Autonomous real-time translation agent supporting 42 languages with medical terminology accuracy.",
      category: "ai_agent",
      donor: "Nexus DeepMind Labs",
      donorTier: "founding_partner",
      targetSectors: ["Healthcare", "Community", "Immigration"],
      availability: "available",
    };

    const match = db.computeSemanticMatch(nonprofit, resource);

    expect(match).toBeDefined();
    expect(match.overallScore).toBeGreaterThanOrEqual(85);
    expect(match.dimensions.missionAlignment).toBeGreaterThanOrEqual(80);
    expect(match.dimensions.sectorRelevance).toBeGreaterThanOrEqual(90);
    expect(match.synergyRationale).toContain("alignment");
    expect(match.suggestedUseCases.length).toBeGreaterThan(0);
  });

  it("should retrieve ranked semantic matches for a non-profit organization", async () => {
    const matches = await db.getSemanticMatchesForNonprofit(1);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].overallScore).toBeGreaterThanOrEqual(matches[matches.length - 1].overallScore);
  });

  it("should execute AI sandbox agents and provide latency and token telemetry", async () => {
    const translationResult = await db.executeSandboxAgent(
      "multilingual_health",
      "Patient requires appointment scheduling in Spanish.",
      { language: "Spanish" }
    );

    expect(translationResult.output).toContain("Multilingual Health Intake Agent");
    expect(translationResult.latencyMs).toBeGreaterThan(0);
    expect(translationResult.tokenCount).toBeGreaterThan(50);

    const etlResult = await db.executeSandboxAgent(
      "data_extractor",
      "Survey of Tract 06075017802 shows 38% limited English proficiency."
    );
    expect(etlResult.output).toContain("Census & Demographic ETL Agent");
    expect(etlResult.output).toContain("tractId");
  });

  it("should parse RFP solicitation text into structured opportunity requirements", () => {
    const sampleRfp = `Metropolitan Health Foundation - Community Health Access Grant 2026
Deadline: October 15, 2026 | Maximum Award: $150,000
Eligibility: Verified 501(c)(3) organizations serving health deserts.
Required Sections:
1. Executive Summary (250 words)
2. Statement of Need & Demographics (500 words)
3. Program Design & Technology Deployment (750 words)
4. Measurable Impact & Evaluation Plan (400 words)
5. Budget Narrative & Sustainability Plan (300 words)`;

    const parsed = db.parseRfpText(sampleRfp);

    expect(parsed.opportunityTitle).toContain("Community Health");
    expect(parsed.funderName).toBe("Metropolitan Health Foundation");
    expect(parsed.maxAwardAmount).toBe("$150,000");
    expect(parsed.submissionDeadline).toBe("October 15, 2026");
    expect(parsed.requiredSections.length).toBe(5);
    expect(parsed.eligibilityCriteria.length).toBeGreaterThanOrEqual(3);
  });

  it("should generate context-aware grant proposal sections merging RFP and nonprofit profile", () => {
    const rfpContext = {
      opportunityTitle: "Community Health Access Grant 2026",
      funderName: "Metropolitan Health Foundation",
      maxAwardAmount: "$150,000",
    };

    const nonprofitProfile = {
      organizationName: "Civic Health & Literacy Initiative",
      mission: "Bridging the healthcare divide for vulnerable immigrant families.",
    };

    const execSummary = db.generateContextAwareGrantSection(
      "Executive Summary",
      rfpContext,
      nonprofitProfile,
      "formal"
    );

    expect(execSummary).toContain("Civic Health & Literacy Initiative");
    expect(execSummary).toContain("Metropolitan Health Foundation");
    expect(execSummary).toContain("$150,000");

    const budgetNarrative = db.generateContextAwareGrantSection(
      "Budget Narrative & Sustainability",
      rfpContext,
      nonprofitProfile,
      "data_driven"
    );

    expect(budgetNarrative).toContain("Total Project Budget");
    expect(budgetNarrative).toContain("Corporate In-Kind Tech Matching");
  });
});
