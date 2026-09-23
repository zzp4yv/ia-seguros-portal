import { describe, expect, it, vi } from "vitest";

vi.mock("rss-parser", () => ({
  default: vi.fn().mockImplementation(() => ({
    parseURL: vi.fn().mockRejectedValue(new Error("network unreachable")),
  })),
}));

import { getNews } from "./newsService";
import { newsData } from "@/data/news";

describe("getNews", () => {
  it("cai para os dados mockados quando todas as fontes RSS falham", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await getNews();
    expect(result).toEqual(newsData);
    errorSpy.mockRestore();
  });
});
