import { NextResponse } from "next/server";
import {
  createItemFromTitle,
  type Item,
  type ItemPayload
} from "@agentweaverlab/shared";

const items: Item[] = [
  createItemFromTitle("Proof-of-life item"),
  createItemFromTitle("Codex-ready verify flow")
];

export async function GET() {
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ItemPayload>;

  try {
    const item = createItemFromTitle(body.title ?? "");
    items.unshift(item);

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create item.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
