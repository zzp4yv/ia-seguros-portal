import Parser from "rss-parser";
import { News } from "@/types";
import { newsData as fallbackNews } from "@/data/news";

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "ia-seguros-portal/1.0" },
});

export type FilterMode = "ai-only" | "ai-and-insurance";

interface FeedSource {
  url: string;
  source: string;
  category: string;
  filterMode: FilterMode;
}

// Fontes já especializadas em seguros: exigimos so o termo de IA, pois o
// assunto "seguros" ja e garantido pelo proprio veiculo.
// Fontes generalistas (Brasil/Mercado): exigimos IA E seguros juntos, senao
// qualquer noticia com "ia" em qualquer parte da palavra vira ruido.
const FEED_SOURCES: FeedSource[] = [
  {
    url: "https://www.revistaapolice.com.br/feed/",
    source: "Revista Apólice",
    category: "Brasil",
    filterMode: "ai-only",
  },
  {
    url: "https://sonhoseguro.com.br/feed/",
    source: "Sonho Seguro",
    category: "Brasil",
    filterMode: "ai-only",
  },
  {
    url: "https://www.cnnbrasil.com.br/feed/",
    source: "CNN Brasil",
    category: "Brasil",
    filterMode: "ai-and-insurance",
  },
  {
    url: "https://www.infomoney.com.br/feed/",
    source: "InfoMoney",
    category: "Mercado",
    filterMode: "ai-and-insurance",
  },
  {
    url: "https://www.insurancebusinessmag.com/us/rss/",
    source: "Insurance Business",
    category: "Mundo",
    filterMode: "ai-only",
  },
  {
    url: "https://www.insurancejournal.com/feed/",
    source: "Insurance Journal",
    category: "Mundo",
    filterMode: "ai-only",
  },
  {
    url: "https://techcrunch.com/feed/",
    source: "TechCrunch",
    category: "Tech",
    filterMode: "ai-and-insurance",
  },
];

const AI_TERMS = [
  "ia",
  "inteligencia artificial",
  "inteligência artificial",
  "ai",
  "artificial intelligence",
  "machine learning",
  "deep learning",
  "llm",
  "chatgpt",
  "openai",
  "ia generativa",
  "generative ai",
  "algoritmo",
];

const INSURANCE_TERMS = [
  "seguro",
  "seguros",
  "segurador",
  "seguradora",
  "insurtech",
  "insurance",
  "apolice",
  "apólice",
  "sinistro",
  "resseguro",
  "previdencia",
  "previdência",
  "lloyd's",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function escapeRegExp(term: string): string {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesAny(normalizedText: string, terms: string[]): boolean {
  return terms.some((term) => {
    const pattern = new RegExp(`\\b${escapeRegExp(normalize(term))}\\b`);
    return pattern.test(normalizedText);
  });
}

export function isRelevant(text: string, mode: FilterMode): boolean {
  const normalized = normalize(text);
  const hasAi = matchesAny(normalized, AI_TERMS);
  if (mode === "ai-only") return hasAi;
  return hasAi && matchesAny(normalized, INSURANCE_TERMS);
}

function buildId(link: string | undefined, fallback: string): string {
  return link && link.length > 0 ? link : fallback;
}

async function fetchFeed(source: FeedSource): Promise<News[]> {
  const feed = await parser.parseURL(source.url);

  return (feed.items ?? [])
    .filter((item) => {
      const text = `${item.title ?? ""} ${item.contentSnippet ?? ""}`;
      return isRelevant(text, source.filterMode);
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

const CACHE_TTL_MS = 60_000;
let cache: { data: News[]; expiresAt: number } | null = null;

async function fetchAllFeeds(): Promise<News[]> {
  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchFeed(source))
  );

  const news: News[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      news.push(...result.value);
    } else {
      console.error(
        `[newsService] falha ao buscar feed "${FEED_SOURCES[index].source}":`,
        result.reason
      );
    }
  });

  if (news.length === 0) {
    return fallbackNews;
  }

  return news.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getNews(): Promise<News[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  const data = await fetchAllFeeds();
  cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  return data;
}
