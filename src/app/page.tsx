"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import CategoryFilter from "@/components/CategoryFilter";
import { News, NewsResponse } from "@/types";
import { newsData as fallbackNews } from "@/data/news";

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/news")
      .then((res) => res.json() as Promise<NewsResponse>)
      .then((json) => {
        if (cancelled) return;
        setNews(json.success && json.data.length > 0 ? json.data : fallbackNews);
      })
      .catch(() => {
        if (!cancelled) setNews(fallbackNews);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isFiltering = activeCategory !== "Todas" || searchQuery.trim() !== "";
  const trending = isFiltering ? undefined : news[0];
  const categories = [
    "Todas",
    ...Array.from(new Set(news.map((item) => item.category))).sort(),
  ];

  const listSource = isFiltering ? news : news.slice(1);
  const filteredNews = listSource.filter((item) => {
    const matchesCategory =
      activeCategory === "Todas" || item.category === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  function resetFilters() {
    setActiveCategory("Todas");
    setSearchQuery("");
  }

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterEmail("");
    setNewsletterSent(true);
    setTimeout(() => setNewsletterSent(false), 5000);
  }

  return (
    <main>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.headerRow }}>
          <Link href="/" style={styles.logo} onClick={resetFilters}>
            IA & Seguros Portal
          </Link>
          <nav style={styles.nav}>
            <button
              style={{
                ...styles.navLink,
                ...styles.navButton,
                ...(!isFiltering ? styles.navLinkActive : {}),
              }}
              onClick={resetFilters}
            >
              Início
            </button>
            {categories
              .filter((cat) => cat !== "Todas")
              .map((cat) => (
                <button
                  key={cat}
                  style={{
                    ...styles.navLink,
                    ...styles.navButton,
                    ...(activeCategory === cat ? styles.navLinkActive : {}),
                  }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            <button
              style={styles.searchButton}
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Buscar notícias"
            >
              {showSearch ? "✕" : "🔍"}
            </button>
          </nav>
        </div>
      </header>

      {showSearch && (
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />
        </div>
      )}

      {/* Hero Section */}
      {!isFiltering && (
        <section style={styles.hero}>
          <div style={{ ...styles.container, ...styles.heroContent }}>
            {loading || !trending ? (
              <p style={styles.heroSummary}>Carregando notícias...</p>
            ) : (
              <>
                <span style={styles.categoryBadge}>{trending.category}</span>
                <h1 style={styles.heroTitle}>{trending.title}</h1>
                <p style={styles.heroSummary}>{trending.summary}</p>
                <div style={styles.heroMeta}>
                  <span>{trending.source}</span>
                  <span>
                    {new Date(trending.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <a
                  href={trending.url}
                  style={styles.heroLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ler matéria completa →
                </a>
              </>
            )}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div style={{ ...styles.container, ...styles.filterSection }}>
        <div style={styles.filterRow}>
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onFilter={setActiveCategory}
          />
          <span style={styles.searchResultsInfo}>
            {filteredNews.length}{" "}
            {filteredNews.length === 1 ? "notícia" : "notícias"}
          </span>
        </div>
      </div>

      {/* News Grid */}
      <section style={{ ...styles.container, ...styles.gridSection }}>
        <h2 style={styles.sectionTitle}>Últimas Notícias</h2>
        {loading ? (
          <p style={styles.emptyState}>Carregando notícias...</p>
        ) : filteredNews.length === 0 ? (
          <p style={styles.emptyState}>
            Nenhuma notícia encontrada para os filtros selecionados.
          </p>
        ) : (
          <div
            style={{
              ...styles.grid,
              opacity: animate ? 0.6 : 1,
            }}
          >
            {filteredNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section style={styles.newsletterSection}>
        <div style={styles.container}>
          <h2 style={styles.newsletterTitle}>Receba as novidades por e-mail</h2>
          <p style={styles.newsletterSubtitle}>
            Um resumo semanal sobre IA no setor de seguros, direto na sua caixa
            de entrada.
          </p>
          <form style={styles.newsletterForm} onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              style={styles.newsletterInput}
            />
            <button type="submit" style={styles.newsletterButton}>
              Inscrever
            </button>
          </form>
          {newsletterSent && (
            <p style={styles.newsletterSuccess}>Inscrição confirmada!</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ ...styles.container, ...styles.footerContent }}>
          <p style={styles.footerText}>
            © {new Date().getFullYear()} IA & Seguros Portal. Todos os
            direitos reservados.
          </p>
          <p style={styles.footerText}>
            Notícias de inteligência artificial no setor de seguros no Brasil
            e no mundo.
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
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "16px",
  },
  logo: {
    color: "#e94560",
    fontSize: "24px",
    fontWeight: 700,
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
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
  navButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  navLinkActive: {
    color: "#e94560",
  },
  searchButton: {
    background: "transparent",
    border: "1px solid #888",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  searchBar: {
    background: "#16213e",
    padding: "16px 0",
    borderBottom: "1px solid #0f3460",
  },
  searchInput: {
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    display: "block",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#0f3460",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
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
  filterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  searchResultsInfo: {
    marginLeft: "auto",
    fontSize: "14px",
    color: "#888",
    whiteSpace: "nowrap",
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
    transition: "opacity 0.3s ease",
  },
  emptyState: {
    color: "#888",
    fontSize: "14px",
    padding: "40px 0",
    textAlign: "center",
  },
  newsletterSection: {
    background: "#f8f9ff",
    padding: "40px 0",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  },
  newsletterTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "8px",
  },
  newsletterSubtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  newsletterForm: {
    display: "flex",
    gap: "12px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  newsletterInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d0d0d0",
    fontSize: "14px",
    outline: "none",
  },
  newsletterButton: {
    padding: "12px 24px",
    background: "#0f3460",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  newsletterSuccess: {
    color: "#1e7b34",
    textAlign: "center",
    marginTop: "12px",
    fontSize: "14px",
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
