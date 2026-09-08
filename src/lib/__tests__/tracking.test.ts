import { describe, expect, it } from "vitest";
import { buildTrackingUrl, buildUtm, slugify } from "@/lib/tracking";

describe("slugify", () => {
  it("lowercases and dashes non-alphanumeric runs", () => {
    expect(slugify("Q3 Enterprise Awareness Push")).toBe("q3-enterprise-awareness-push");
  });

  it("strips accents", () => {
    expect(slugify("Adaeze Bianchi — Café Launch")).toBe("adaeze-bianchi-cafe-launch");
  });

  it("trims leading/trailing dashes", () => {
    expect(slugify("  --Weird Name--  ")).toBe("weird-name");
  });
});

describe("buildUtm / buildTrackingUrl", () => {
  it("builds consistent UTM params", () => {
    expect(buildUtm("my-campaign", "jane-doe")).toEqual({
      source: "linkedin",
      medium: "sponsored-post",
      campaign: "my-campaign",
      content: "jane-doe",
    });
  });

  it("produces a URL containing every UTM param", () => {
    const url = buildTrackingUrl("my-campaign", "jane-doe");
    expect(url).toContain("utm_source=linkedin");
    expect(url).toContain("utm_medium=sponsored-post");
    expect(url).toContain("utm_campaign=my-campaign");
    expect(url).toContain("utm_content=jane-doe");
    expect(url.startsWith("https://trk.naano.link/my-campaign/jane-doe")).toBe(true);
  });
});
