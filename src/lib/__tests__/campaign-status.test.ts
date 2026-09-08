import { describe, expect, it } from "vitest";
import { nextCollaborationStatus, statusIndex } from "@/lib/campaign-status";

describe("statusIndex", () => {
  it("orders the pipeline invited -> paid", () => {
    expect(statusIndex("invited")).toBe(0);
    expect(statusIndex("paid")).toBe(5);
    expect(statusIndex("live")).toBeLessThan(statusIndex("paid"));
  });
});

describe("nextCollaborationStatus", () => {
  it("advances one step at a time", () => {
    expect(nextCollaborationStatus("invited")).toBe("accepted");
    expect(nextCollaborationStatus("accepted")).toBe("draft_submitted");
    expect(nextCollaborationStatus("scheduled")).toBe("live");
  });

  it("returns null once paid (end of pipeline)", () => {
    expect(nextCollaborationStatus("paid")).toBeNull();
  });
});
