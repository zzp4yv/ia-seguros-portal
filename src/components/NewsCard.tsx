import { News } from "@/types";

interface NewsCardProps {
  item: News;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <article style={styles.card}>
      <span style={styles.categoryBadge}>{item.category}</span>
      <h3 style={styles.title}>{item.title}</h3>
      <p style={styles.summary}>{item.summary}</p>
      <div style={styles.meta}>
        <span style={styles.source}>{item.source}</span>
        <span style={styles.date}>
          {new Date(item.date).toLocaleDateString("pt-BR")}
        </span>
      </div>
      <a href={item.url} style={styles.link} target="_blank" rel="noopener noreferrer">
        Ler mais →
      </a>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    padding: "24px",
    transition: "box-shadow 0.2s, transform 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  categoryBadge: {
    display: "inline-block",
    background: "#f0f4ff",
    color: "#0f3460",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    width: "fit-content",
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "1.4",
    color: "#1a1a2e",
    margin: 0,
  },
  summary: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#555",
    margin: 0,
    flex: 1,
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
