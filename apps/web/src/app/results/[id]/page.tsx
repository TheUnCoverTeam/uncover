"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Problem {
  text: string;
  frequency: number;
  sentiment: string;
}

interface ResultData {
  requestId: string;
  status: string;
  query: string;
  sources: string[];
  createdAt: string;
  summary?: string;
  problems?: Problem[];
  trends?: string[];
  postsAnalyzed?: number;
}

export default function PublicResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/results/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load result"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <a href="/" style={s.navLogo}>Uncover</a>
          <a href="/login" style={s.navCta}>Get started →</a>
        </div>
      </nav>

      <main style={s.main}>
        {loading && (
          <div style={s.center}>
            <span style={s.dimText}>Loading...</span>
          </div>
        )}

        {error && !loading && (
          <div style={s.center}>
            <div style={s.errorCard}>
              <div style={s.errorTitle}>Result not found</div>
              <div style={s.errorSub}>{error}</div>
              <a href="/" style={s.errorLink}>← Back to Uncover</a>
            </div>
          </div>
        )}

        {data && !loading && (
          <div style={s.content}>
            {/* Header */}
            <div style={s.header}>
              <div style={s.headerMeta}>
                <span style={s.badge}>Shared result</span>
                <span style={s.metaDivider}>·</span>
                <span style={s.metaItem}>{data.sources.join(", ")}</span>
                {data.postsAnalyzed && (
                  <>
                    <span style={s.metaDivider}>·</span>
                    <span style={s.metaItem}>{data.postsAnalyzed} posts analyzed</span>
                  </>
                )}
                <span style={s.metaDivider}>·</span>
                <span style={s.metaItem}>{new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 style={s.h1}>&ldquo;{data.query}&rdquo;</h1>
            </div>

            {/* Summary */}
            {data.summary && (
              <div style={s.summaryCard}>
                <div style={s.cardLabel}>AI Summary</div>
                <p style={s.summaryText}>{data.summary}</p>
              </div>
            )}

            {/* Trends */}
            {data.trends && data.trends.length > 0 && (
              <div style={s.trendsRow}>
                {data.trends.map((t, i) => (
                  <span key={i} style={s.trendPill}>#{t}</span>
                ))}
              </div>
            )}

            {/* Problems */}
            {data.problems && data.problems.length > 0 && (
              <div style={s.problemsCard}>
                <div style={s.cardLabel}>
                  {data.problems.length} problem{data.problems.length !== 1 ? "s" : ""} identified
                </div>
                <div>
                  {data.problems.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        ...s.problemRow,
                        ...(i < data.problems!.length - 1 ? s.problemRowBorder : {}),
                      }}
                    >
                      <div style={s.problemText}>{p.text}</div>
                      <div style={s.problemMeta}>
                        <div style={s.freqBar}>
                          <div
                            style={{
                              ...s.freqFill,
                              width: `${(p.frequency / 10) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            ...s.sentiment,
                            color: p.sentiment === "frustrated" ? "#ef4444"
                              : p.sentiment === "confused" ? "#eab308"
                              : "#555",
                          }}
                        >
                          {p.sentiment}
                        </span>
                        <span style={s.freq}>{p.frequency}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={s.cta}>
              <div style={s.ctaText}>
                Run your own searches with Uncover
              </div>
              <div style={s.ctaSub}>
                Query Reddit, X, and HackerNews. Get structured pain points and AI analysis.
              </div>
              <div style={s.ctaBtns}>
                <a href="/login" style={s.btnPrimary}>Get started for free</a>
                <a href="/docs" style={s.btnGhost}>Read the docs →</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  nav: { borderBottom: "1px solid #1a1a1a", position: "sticky" as const, top: 0, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", zIndex: 50 },
  navInner: { maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navLogo: { fontSize: 15, fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", textDecoration: "none" },
  navCta: { fontSize: 13, color: "#555", textDecoration: "none" },
  main: { maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" },
  dimText: { fontSize: 13, color: "#333" },
  errorCard: { textAlign: "center" as const, maxWidth: 400 },
  errorTitle: { fontSize: 18, fontWeight: 600, color: "#fff", marginBottom: 8, letterSpacing: "-0.02em" },
  errorSub: { fontSize: 14, color: "#444", marginBottom: 20 },
  errorLink: { fontSize: 13, color: "#555", textDecoration: "none" },
  content: { maxWidth: 720, margin: "0 auto" },
  header: { marginBottom: 32 },
  headerMeta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" as const },
  badge: { fontSize: 11, color: "#555", background: "#111", border: "1px solid #1e1e1e", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.02em" },
  metaDivider: { color: "#222", fontSize: 12 },
  metaItem: { fontSize: 12, color: "#333" },
  h1: { fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.2 },
  summaryCard: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 22px", marginBottom: 16 },
  cardLabel: { fontSize: 11, color: "#2a2a2a", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10, fontWeight: 500 },
  summaryText: { fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 },
  trendsRow: { display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 16 },
  trendPill: { fontSize: 12, color: "#444", background: "#0c0c0c", border: "1px solid #1a1a1a", padding: "4px 12px", borderRadius: 20 },
  problemsCard: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 22px", marginBottom: 32 },
  problemRow: { paddingBottom: 16, marginBottom: 16 },
  problemRowBorder: { borderBottom: "1px solid #111" },
  problemText: { fontSize: 14, fontWeight: 500, color: "#ddd", marginBottom: 10, letterSpacing: "-0.01em" },
  problemMeta: { display: "flex", alignItems: "center", gap: 12 },
  freqBar: { flex: 1, background: "#141414", height: 3, borderRadius: 2 },
  freqFill: { height: "100%", background: "#fff", borderRadius: 2 },
  sentiment: { fontSize: 12, textTransform: "capitalize" as const },
  freq: { fontSize: 12, color: "#2a2a2a" },
  cta: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 14, padding: "32px 28px", textAlign: "center" as const },
  ctaText: { fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", marginBottom: 8 },
  ctaSub: { fontSize: 14, color: "#444", lineHeight: 1.65, marginBottom: 24 },
  ctaBtns: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const },
  btnPrimary: { fontSize: 13, fontWeight: 500, color: "#000", background: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", letterSpacing: "-0.01em" },
  btnGhost: { fontSize: 13, color: "#555", padding: "10px 20px", borderRadius: 8, textDecoration: "none", border: "1px solid #1e1e1e", letterSpacing: "-0.01em" },
};
