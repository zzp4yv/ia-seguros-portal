"use client";

import { useState } from "react";

const categories = [
  "Todas",
  "Brasil",
  "Mundo",
  "Tech",
  "Regulação",
  "Inovação",
  "Mercado",
];

export default function CategoryFilter() {
  const [active, setActive] = useState("Todas");

  return (
    <div style={styles.container}>
      <div style={styles.scrollWrapper}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              ...styles.button,
              ...(active === cat ? styles.activeButton : {}),
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  scrollWrapper: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  button: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "1px solid #d0d0d0",
    background: "#fff",
    color: "#555",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  activeButton: {
    background: "#0f3460",
    color: "#fff",
    borderColor: "#0f3460",
  },
};
