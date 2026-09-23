// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Home from "./page";
import { newsData as fallbackNews } from "@/data/news";

const REAL_NEWS = [
  {
    id: "https://example.org/real-1",
    title: "Noticia real vinda da API de verdade",
    summary: "Resumo real",
    source: "Fonte Real",
    category: "Mundo",
    date: new Date().toISOString(),
    url: "https://example.org/real-1",
  },
];

describe("Home page", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renderiza os dados reais de /api/news, nao os dados mockados de fallback", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            success: true,
            count: REAL_NEWS.length,
            data: REAL_NEWS,
          }),
      })
    );

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(REAL_NEWS[0].title)).toBeInTheDocument();
    });

    expect(screen.queryByText(fallbackNews[0].title)).not.toBeInTheDocument();
  });

  it("cai para o fallback local se a chamada a /api/news falhar", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network fail")));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(fallbackNews[0].title)).toBeInTheDocument();
    });
  });
});
