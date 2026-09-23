import { News } from "@/types";

interface NewsCardProps {
  item: News;
}

const categoryColors: Record<string, { bg: string; color: string }> = {
  Brasil: { bg: "#e6f4ea", color: "#1e7b34" },
  Mundo: { bg: "#e8f0fe", color: "#1967d2" },
  Tech: { bg: "#fef7e0", color: "#b06000" },
  Regulação: { bg: "#fce8e6", color: "#c5221f" },
  Inovação: { bg: "#f3e8fd", color: "#8430ce" },
  Mercado: { bg: "#e6f4ea", color: "#0d652d" },
};

const defaultCategoryColor = { bg: "#f0f4ff", color: "#0f3460" };

export default function NewsCard({ item }: NewsCardProps) {
  const badgeColor = categoryColors[item.category] ?? defaultCategoryColor;

  return (
    <article style={styles.card}>
      <div style={styles.cardHeader}>
        <span
          style={{
            ...styles.categoryBadge,
            background: badgeColor.bg,
            color: badgeColor.color,
          }}
        >
          {item.category}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.externalIcon}
          aria-label="Abrir notícia em nova aba"
        >
          ↗
        </a>
      </div>
      <h3 style={styles.title}>{item.title}</h3>
      <p style={styles.summary}>{item.summary}</p>
      <div style={styles.meta}>
        <span style={styles.source}>{item.source}</span>
        <span style={styles.date}>
          {new Date(item.date).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <a
        href={item.url}
        style={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ler mais →
      </a>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: "12px",
    padding: "24px",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    width: "fit-content",
  },
  externalIcon: {
    color: "#999",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 700,
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "1.4",
    color: "#1a1a2e",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  summary: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#555",
    margin: 0,
    flex: 1,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#999",
    paddingTop: "8px",
    borderTop: "1px solid #f0f0f0",
  },
  source: {
    fontWeight: 500,
  },
  date: {},
  link: {
    color: "#e94560",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 600,
  },
};
