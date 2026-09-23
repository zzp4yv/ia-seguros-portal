import Parser from "rss-parser";
import { News } from "@/types";
import { newsData as fallbackNews } from "@/data/news";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "ia-seguros-portal/1.0" },
});

interface FeedSource {
  url: string;
  source: string;
  category: string;
}

const FEED_SOURCES: FeedSource[] = [
  {
    url: "https://www.cnnbrasil.com.br/feed/",
    source: "CNN Brasil",
    category: "Brasil",
  },
  {
    url: "https://www.infomoney.com.br/feed/",
    source: "InfoMoney",
    category: "Mercado",
  },
  {
    url: "https://www.insurancebusinessmag.com/us/rss/",
    source: "Insurance Business",
    category: "Mundo",
  },
  {
    url: "https://www.insurancejournal.com/feed/",
    source: "Insurance Journal",
    category: "Mundo",
  },
  {
    url: "https://techcrunch.com/feed/",
    source: "TechCrunch",
    category: "Tech",
  },
];

const KEYWORDS = [
  "ia",
  "inteligencia artificial",
  "inteligência artificial",
  "ai",
  "machine learning",
  "deep learning",
  "llm",
  "chatgpt",
  "openai",
  "generativa",
  "generative",
  "segur",
  "insurance",
  "insurtech",
  "lloyd's",
  "regula",
  "tecnologia",
  "inov",
];

function matchesKeywords(text: string): boolean {
  const normalized = text.toLowerCase();
  return KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function buildId(link: string | undefined, fallback: string): string {
  if (!link) return fallback;
  return Buffer.from(link).toString("base64").slice(0, 16);
}

async function fetchFeed(source: FeedSource): Promise<News[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? [])
    .filter((item) => {
      const text = `${item.title ?? ""} ${item.contentSnippet ?? ""}`;
      return matchesKeywords(text);
    })
    .map((item) => ({
      id: buildId(item.link, `${source.source}-${item.title ?? ""}`),
      title: item.title ?? "Sem título",
      summary: (item.contentSnippet ?? "").slice(0, 280),
      source: source.source,
      category: source.category,
      date: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      url: item.link ?? "",
    }));
}

export async function getNews(): Promise<News[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchFeed(source))
  );

  const news = results
    .filter(
      (result): result is PromiseFulfilledResult<News[]> =>
        result.status === "fulfilled"
    )
    .flatMap((result) => result.value);

  if (news.length === 0) {
    return fallbackNews;
  }

  return news.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
