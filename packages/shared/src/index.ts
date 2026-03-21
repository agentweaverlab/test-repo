export type Item = {
  id: string;
  title: string;
};

export type ItemPayload = {
  title: string;
};

export function normalizeItemTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}

export function createItemFromTitle(title: string): Item {
  const normalizedTitle = normalizeItemTitle(title);

  if (!normalizedTitle) {
    throw new Error("Please enter a title before saving.");
  }

  const id = normalizedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    id: `${id}-${Date.now()}`,
    title: normalizedTitle
  };
}

export function mergeItemsPreservingOptimistic(
  currentItems: Item[],
  fetchedItems: Item[]
) {
  const fetchedIds = new Set(fetchedItems.map((item) => item.id));
  const optimisticItems = currentItems.filter((item) => !fetchedIds.has(item.id));

  return [...optimisticItems, ...fetchedItems];
}

export function buildHeroMessage(repoName: string) {
  return `Make ${repoName} easy for agents to change.`;
}
