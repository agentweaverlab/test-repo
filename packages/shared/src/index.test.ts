import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildHeroMessage,
  createItemFromTitle,
  normalizeItemTitle
} from "./index";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("normalizeItemTitle", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeItemTitle("  hello    from   tests  ")).toBe(
      "hello from tests"
    );
  });
});

describe("createItemFromTitle", () => {
  it("creates a deterministic title payload", () => {
    vi.spyOn(Date, "now").mockReturnValue(42);

    expect(createItemFromTitle("  shipped feature  ")).toEqual({
      id: "shipped-feature-42",
      title: "shipped feature"
    });
  });

  it("rejects empty titles", () => {
    expect(() => createItemFromTitle("   ")).toThrow(
      "Please enter a title before saving."
    );
  });
});

describe("buildHeroMessage", () => {
  it("references the repo name", () => {
    expect(buildHeroMessage("test-repo")).toContain("test-repo");
  });
});
