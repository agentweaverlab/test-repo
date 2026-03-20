"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  buildHeroMessage,
  type Item,
  type ItemPayload,
  normalizeItemTitle
} from "@agentweaverlab/shared";

type ItemsResponse = {
  items: Item[];
};

type CreateResponse = {
  item?: Item;
  error?: string;
};

const initialItems: Item[] = [];

export function AppShell() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    void fetch("/api/items")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not load items.");
        }

        return (await response.json()) as ItemsResponse;
      })
      .then((payload) => {
        if (isMounted) {
          setItems(payload.items);
        }
      })
      .catch((fetchError: Error) => {
        if (isMounted) {
          setError(fetchError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function focusCreateForm() {
    inputRef.current?.focus();
  }

  async function createItem(payload: ItemPayload) {
    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = (await response.json()) as CreateResponse;

    if (!response.ok || !body.item) {
      throw new Error(body.error ?? "Unable to create item.");
    }

    setItems((currentItems) => [body.item!, ...currentItems]);
    setStatus(`Saved "${body.item.title}"`);
    setTitle("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    const normalizedTitle = normalizeItemTitle(title);

    if (!normalizedTitle) {
      setError("Please enter a title before saving.");
      return;
    }

    startTransition(() => {
      void createItem({ title: normalizedTitle }).catch((submitError: Error) => {
        setError(submitError.message);
      });
    });
  }

  return (
    <main className="page-shell">
      <div className="panel" data-testid="app-shell">
        <section className="hero">
          <div className="stack">
            <p className="eyebrow">Agent-first foundation</p>
            <h1 className="headline">{buildHeroMessage("test-repo")}</h1>
            <p className="lede">
              This sample app gives us a shared language for Codex work: one
              command to verify the repo, stable selectors for e2e, and a tiny
              user flow that is easy to change without breaking the workflow.
            </p>
            <div className="hero-actions">
              <a
                className="primary-link"
                data-testid="primary-cta"
                href="#create-flow"
              >
                Inspect the smoke path
              </a>
              <button
                className="secondary-button"
                data-testid="create-item"
                onClick={focusCreateForm}
                type="button"
              >
                Create a sample item
              </button>
            </div>
          </div>

          <div className="section-card">
            <h2 className="section-title">What this proves</h2>
            <ul className="meta-list">
              <li>The web app can render and build cleanly.</li>
              <li>Shared logic can be unit tested outside the UI.</li>
              <li>Playwright can execute a deterministic create flow.</li>
              <li>Codex and GitHub can point at the same verify contract.</li>
            </ul>
          </div>
        </section>

        <section className="content-grid">
          <div className="section-card stack">
            <h2 className="section-title">Self-verifying repo shape</h2>
            <p className="section-copy">
              We are deliberately keeping v1 small. Once this loop is green and
              reliable, we can add persistence, deployments, and more ambitious
              agent workflows with much lower risk.
            </p>
            <ul className="meta-list">
              <li>`pnpm verify` is the contract.</li>
              <li>`AGENTS.md` is the standing instruction file.</li>
              <li>`verify.yml` is the branch gate.</li>
              <li>`scripts/codex/setup.sh` is the cloud bootstrap entrypoint.</li>
            </ul>
          </div>

          <div className="section-card stack" id="create-flow">
            <h2 className="section-title">Create flow</h2>
            <p className="section-copy">
              This is the smoke test path. It is intentionally simple, visible,
              and quick to debug.
            </p>
            <form className="form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                className="input"
                data-testid="item-title"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title for the next proof-of-life item"
                value={title}
              />
              <button
                className="submit-button"
                data-testid="save-item"
                disabled={isPending}
                type="submit"
              >
                {isPending ? "Saving..." : "Save item"}
              </button>
            </form>
            <p
              className={error ? "status error" : "status"}
              data-testid={error ? "toast-error" : "toast-success"}
            >
              {error ?? status}
            </p>
          </div>

          <div className="section-card stack">
            <h2 className="section-title">Current items</h2>
            <p className="section-copy">
              This starts with in-memory data so the bootstrap stays secret-free.
              SQLite is a good next step once the workflow itself is proven.
            </p>
            <ul className="item-list" data-testid="item-list">
              {items.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
