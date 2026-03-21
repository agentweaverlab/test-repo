import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildHeroMessage,
  createItemFromTitle,
  mergeItemsPreservingOptimistic,
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

describe("mergeItemsPreservingOptimistic", () => {
  it("keeps optimistic items that are missing from a stale fetch", () => {
    const optimisticItem = {
      id: "fresh-item-3",
      title: "Fresh item"
    };
    const fetchedItems = [
      {
        id: "proof-of-life-item-1",
        title: "Proof-of-life item"
      },
      {
        id: "codex-ready-verify-flow-2",
        title: "Codex-ready verify flow"
      }
    ];

    expect(
      mergeItemsPreservingOptimistic([optimisticItem, ...fetchedItems], fetchedItems)
    ).toEqual([optimisticItem, ...fetchedItems]);
  });

  it("does not duplicate items that already exist in the fetched list", () => {
    const fetchedItems = [
      {
        id: "proof-of-life-item-1",
        title: "Proof-of-life item"
      },
      {
        id: "codex-ready-verify-flow-2",
        title: "Codex-ready verify flow"
      }
    ];

    expect(mergeItemsPreservingOptimistic(fetchedItems, fetchedItems)).toEqual(
      fetchedItems
    );
  });
});

describe("buildHeroMessage", () => {
  it("references the repo name", () => {
    expect(buildHeroMessage("test-repo")).toContain("test-repo");
  });
});
