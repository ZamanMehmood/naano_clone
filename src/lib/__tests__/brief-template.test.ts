import { describe, expect, it } from "vitest";
import { generateBrief } from "@/lib/brief-template";

const baseInput = {
  campaignName: "Test Campaign",
  objective: "leads" as const,
  targetAudience: "RevOps leaders at Series B SaaS companies",
  keyMessages: ["Cut reporting time in half", "Built by former operators"],
  niches: ["Sales" as const, "SaaS" as const],
};

describe("generateBrief", () => {
  it("is deterministic: same input produces the same output", () => {
    expect(generateBrief(baseInput)).toBe(generateBrief(baseInput));
  });

  it("includes the campaign name, audience, and every key message", () => {
    const brief = generateBrief(baseInput);
    expect(brief).toContain("Test Campaign");
    expect(brief).toContain("RevOps leaders at Series B SaaS companies");
    expect(brief).toContain("Cut reporting time in half");
    expect(brief).toContain("Built by former operators");
  });

  it("varies tone and CTA by objective", () => {
    const leads = generateBrief({ ...baseInput, objective: "leads" });
    const awareness = generateBrief({ ...baseInput, objective: "awareness" });
    expect(leads).not.toBe(awareness);
  });

  it("falls back to placeholder guidance when audience/messages are empty", () => {
    const brief = generateBrief({ ...baseInput, targetAudience: "", keyMessages: [] });
    expect(brief).toContain("Not specified yet");
  });

  it("never mentions AI or an LLM — it's an honest template, not a fake AI feature", () => {
    const brief = generateBrief(baseInput);
    expect(brief.toLowerCase()).not.toContain("ai-generated");
    expect(brief.toLowerCase()).not.toMatch(/\bllm\b/);
  });
});
