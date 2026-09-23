import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import CategoryFilter from "@/components/CategoryFilter";
import { newsData } from "@/data/news";

export default function Home() {
  const trending = newsData[0];
  const featuredNews = newsData.slice(1, 7);

  return (
    <main>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.container}>
          <Link href="/" style={styles.logo}>
            IA & Seguros Portal
          </Link>
          <nav style={styles.nav}>
            <Link href="/" style={styles.navLink}>
              Início
            </Link>
            <Link href="/" style={styles.navLink}>
              Brasil
            </Link>
            <Link href="/" style={styles.navLink}>
              Mundo
            </Link>
            <Link href="/" style={styles.navLink}>
              Tech
            </Link>
            <Link href="/" style={styles.navLink}>
              Regulação
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={{ ...styles.container, ...styles.heroContent }}>
          <span style={styles.categoryBadge}>
            {trending.category}
          </span>
          <h1 style={styles.heroTitle}>{trending.title}</h1>
          <p style={styles.heroSummary}>{trending.summary}</p>
          <div style={styles.heroMeta}>
            <span>{trending.source}</span>
            <span>{new Date(trending.date).toLocaleDateString("pt-BR")}</span>
          </div>
          <a href={trending.url} style={styles.heroLink} target="_blank" rel="noopener noreferrer">
            Ler matéria completa →
          </a>
        </div>
      </section>

      {/* Category Filter */}
      <div style={{ ...styles.container, ...styles.filterSection }}>
        <CategoryFilter />
      </div>

      {/* News Grid */}
      <section style={{ ...styles.container, ...styles.gridSection }}>
        <h2 style={styles.sectionTitle}>Últimas Notícias</h2>
        <div style={styles.grid}>
          {featuredNews.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ ...styles.container, ...styles.footerContent }}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} IA & Seguros Portal. Todos os direitos reservados.
          </p>
          <p style={styles.footerText}>
            Notícias de inteligência artificial no setor de seguros no Brasil e no mundo.
          </p>
        </div>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    background: "#1a1a2e",
    padding: "16px 0",
    borderBottom: "3px solid #0f3460",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  logo: {
    color: "#e94560",
    fontSize: "24px",
    fontWeight: 700,
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    gap: "24px",
  },
  navLink: {
    color: "#c4c4c4",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "color 0.2s",
  },
  hero: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    color: "#fff",
    padding: "60px 0",
  },
  heroContent: {
    maxWidth: "800px",
  },
  categoryBadge: {
    display: "inline-block",
    background: "#e94560",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: 700,
    lineHeight: "1.3",
    marginBottom: "16px",
  },
  heroSummary: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#b0b0b0",
    marginBottom: "16px",
  },
  heroMeta: {
    display: "flex",
    gap: "16px",
    color: "#888",
    fontSize: "14px",
    marginBottom: "24px",
  },
  heroLink: {
    color: "#e94560",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "14px",
  },
  filterSection: {
    padding: "24px 0",
    borderBottom: "1px solid #eee",
  },
  gridSection: {
    padding: "40px 0",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px",
  },
  footer: {
    background: "#1a1a2e",
    color: "#888",
    padding: "32px 0",
    marginTop: "40px",
  },
  footerContent: {
    textAlign: "center",
  },
  footerText: {
    margin: "4px 0",
    fontSize: "14px",
  },
};
