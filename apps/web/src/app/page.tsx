"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if already logged in — otherwise show landing page
    const stored = localStorage.getItem("uncover_api_key");
    if (stored) router.push("/dashboard");
  }, [router]);

  return (
    <div style={s.page}>
      <div style={s.grid} />

      <nav style={s.nav}>
        <span style={s.logo}>UNCOVER</span>
        <div style={s.navRight}>
          <a href="/login" style={s.navLink}>Sign In</a>
          <a href="/login" style={s.navBtn}>Get API Key →</a>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.tag}>Open Beta · Pay as you go</div>
        <h1 style={s.h1}>Surface real<br /><span style={s.accent}>problems.</span></h1>
        <p style={s.sub}>
          Query Reddit, X, and HackerNews.<br />
          Get structured pain points, trends, and AI analysis.<br />
          No subscription required.
        </p>
        <div style={s.ctas}>
          <a href="/login" style={s.btnPrimary}>Start for free →</a>
          <a href="#how" style={s.btnGhost}>See how it works</a>
        </div>

        <div style={s.codeWrap}>
          <div style={s.codeBar}>
            <span style={s.codeDot} /><span style={s.codeDot} /><span style={s.codeDot} />
            <span style={s.codeTitle}>curl example</span>
          </div>
          <pre style={s.code}>{`curl -X POST https://api.uncover.thealxlabs.ca/api/search \\
  -H "Authorization: Bearer sk_live_..." \\
  -d '{"query":"password manager frustrations","sources":["reddit","hackernews"]}'`}</pre>
          <div style={s.codeResult}>
            <span style={s.codeKey}>"summary"</span>
            <span style={s.codeMuted}>: </span>
            <span style={s.codeStr}>"Users report steep pricing, poor mobile apps, and complex setup..."</span>
          </div>
        </div>
      </main>

      <section id="how" style={s.section}>
        <div style={s.sectionInner}>
          <span style={s.sectionLabel}>How it works</span>
          <div style={s.steps}>
            {[
              { n: "01", title: "Sign up", desc: "Create an account and get your API key instantly. No credit card required to start." },
              { n: "02", title: "Buy credits", desc: "Purchase a credit pack. One credit = one search. Credits never expire." },
              { n: "03", title: "Search", desc: "Query any topic. We scrape Reddit, X, and HackerNews in real time." },
              { n: "04", title: "Get insights", desc: "AI extracts structured pain points, sentiment, frequency, and trends." },
            ].map((step) => (
              <div key={step.n} style={s.step}>
                <div style={s.stepNum}>{step.n}</div>
                <div style={s.stepTitle}>{step.title}</div>
                <div style={s.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.sectionInner}>
          <span style={s.sectionLabel}>Pricing — buy once, use anytime</span>
          <div style={s.packs}>
            {[
              { name: "Starter", price: "$5", searches: "50 searches", per: "$0.10 / search", best: false },
              { name: "Growth", price: "$15", searches: "200 searches", per: "$0.075 / search", best: false },
              { name: "Pro", price: "$29", searches: "500 searches", per: "$0.058 / search", best: true },
              { name: "Scale", price: "$79", searches: "2,000 searches", per: "$0.040 / search", best: false },
            ].map((p) => (
              <div key={p.name} style={{ ...s.pack, ...(p.best ? s.packBest : {}) }}>
                {p.best && <div style={s.packBadge}>Most popular</div>}
                <div style={s.packName}>{p.name}</div>
                <div style={{ ...s.packPrice, ...(p.best ? { color: "#e8ff47" } : {}) }}>{p.price}</div>
                <div style={s.packSearches}>{p.searches}</div>
                <div style={s.packPer}>{p.per}</div>
              </div>
            ))}
          </div>
          <div style={s.pricingNote}>Monthly subscriptions from $19/mo · Credits never expire · Cancel anytime</div>
          <a href="/login" style={{ ...s.btnPrimary, marginTop: 32, display: "inline-block" }}>Get started →</a>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.sectionInner}>
          <span style={s.sectionLabel}>Data sources</span>
          <div style={s.sources}>
            {[
              { name: "Reddit", desc: "Real-time JSON API. Filters by subreddit, upvotes, age." },
              { name: "HackerNews", desc: "Algolia search API. Tech-focused, high signal-to-noise." },
              { name: "X / Twitter", desc: "Via Nitter. Real opinions, no filter bubbles." },
            ].map((src) => (
              <div key={src.name} style={s.source}>
                <div style={s.sourceName}>{src.name}</div>
                <div style={s.sourceDesc}>{src.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...s.section, borderBottom: "none" }}>
        <div style={{ ...s.sectionInner, textAlign: "center" as const }}>
          <h2 style={s.ctaH2}>Ready to uncover<br /><span style={s.accent}>real problems?</span></h2>
          <a href="/login" style={{ ...s.btnPrimary, marginTop: 32, display: "inline-block" }}>Get your API key →</a>
        </div>
      </section>

      <footer style={s.footer}>
        <span>Uncover — v1.0.0</span>
        <span>Built by <a href="https://thealxlabs.ca" style={s.footerLink}>TheAlxLabs</a></span>
        <span>No subscriptions. Credits never expire.</span>
      </footer>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", color: "#e8e8e8", fontFamily: "'Syne', sans-serif", position: "relative" },
  grid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 },
  nav: { position: "relative", zIndex: 10, borderBottom: "1px solid #1c1c1c", padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: "0.12em", color: "#e8e8e8" },
  navRight: { display: "flex", alignItems: "center", gap: 24 },
  navLink: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#555", textDecoration: "none" },
  navBtn: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#000", background: "#e8ff47", padding: "8px 16px", textDecoration: "none", fontWeight: 700 },
  main: { position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "96px 48px 80px" },
  tag: { display: "inline-block", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#e8ff47", background: "rgba(232,255,71,0.07)", border: "1px solid rgba(232,255,71,0.2)", padding: "5px 12px", marginBottom: 32 },
  h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(52px, 8vw, 88px)", letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 24 },
  accent: { color: "#e8ff47" },
  sub: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: "#555", lineHeight: 2, marginBottom: 40, maxWidth: 500 },
  ctas: { display: "flex", gap: 16, marginBottom: 56, flexWrap: "wrap" as const },
  btnPrimary: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#000", background: "#e8ff47", padding: "14px 24px", textDecoration: "none", display: "inline-block" },
  btnGhost: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: "#555", padding: "14px 24px", textDecoration: "none", border: "1px solid #2a2a2a", display: "inline-block" },
  codeWrap: { background: "#0a0a0a", border: "1px solid #1c1c1c", overflow: "hidden", maxWidth: 680 },
  codeBar: { background: "#111", borderBottom: "1px solid #1c1c1c", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 },
  codeDot: { width: 10, height: 10, borderRadius: "50%", background: "#2a2a2a", display: "inline-block" },
  codeTitle: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#333", marginLeft: 8, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  code: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#888", padding: "20px 24px", margin: 0, lineHeight: 1.8, overflowX: "auto" as const },
  codeResult: { borderTop: "1px solid #1c1c1c", padding: "14px 24px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 },
  codeKey: { color: "#60a5fa" },
  codeMuted: { color: "#333" },
  codeStr: { color: "#4ade80" },
  section: { position: "relative", zIndex: 10, borderTop: "1px solid #1c1c1c", padding: "72px 0" },
  sectionInner: { maxWidth: 900, margin: "0 auto", padding: "0 48px" },
  sectionLabel: { display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#333", marginBottom: 40 },
  steps: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1c1c1c", border: "1px solid #1c1c1c" },
  step: { background: "#080808", padding: "28px 24px" },
  stepNum: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#e8ff47", letterSpacing: "0.1em", marginBottom: 16 },
  stepTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 10 },
  stepDesc: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", lineHeight: 1.8 },
  packs: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1c1c1c", border: "1px solid #1c1c1c", marginBottom: 20 },
  pack: { background: "#080808", padding: "28px 24px", position: "relative" as const },
  packBest: { background: "rgba(232,255,71,0.04)", border: "1px solid rgba(232,255,71,0.15)" },
  packBadge: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#e8ff47", marginBottom: 12 },
  packName: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#555", marginBottom: 12 },
  packPrice: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, letterSpacing: "-0.03em", marginBottom: 6 },
  packSearches: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#555", marginBottom: 4 },
  packPer: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#2a2a2a" },
  pricingNote: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#333" },
  sources: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#1c1c1c", border: "1px solid #1c1c1c" },
  source: { background: "#080808", padding: "28px 24px" },
  sourceName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 10 },
  sourceDesc: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#555", lineHeight: 1.8 },
  ctaH2: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 60px)", letterSpacing: "-0.03em", lineHeight: 1.1 },
  footer: { position: "relative", zIndex: 10, borderTop: "1px solid #1c1c1c", padding: "32px 48px", display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2a2a2a", flexWrap: "wrap" as const, gap: 12 },
  footerLink: { color: "#333", textDecoration: "none" },
};
