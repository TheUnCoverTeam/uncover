"use client";

import { useState, useEffect } from "react";

const API_BASE = "https://api.uncover.thealxlabs.ca";

// ─── Sidebar sections ────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "authentication", label: "Authentication" },
  {
    id: "endpoints",
    label: "Endpoints",
    children: [
      { id: "ep-signup", label: "POST /auth/signup" },
      { id: "ep-signin", label: "POST /auth/signin" },
      { id: "ep-keys-list", label: "GET /auth/keys" },
      { id: "ep-keys-create", label: "POST /auth/keys" },
      { id: "ep-keys-delete", label: "DELETE /auth/keys/:id" },
      { id: "ep-search", label: "POST /search" },
      { id: "ep-search-get", label: "GET /search/:id" },
      { id: "ep-search-history", label: "GET /search/history" },
      { id: "ep-search-cost", label: "POST /search/cost" },
      { id: "ep-results-public", label: "GET /results/:id" },
      { id: "ep-billing-status", label: "GET /billing/status" },
      { id: "ep-billing-checkout", label: "POST /billing/checkout" },
      { id: "ep-billing-subscribe", label: "POST /billing/subscribe" },
      { id: "ep-billing-portal", label: "POST /billing/portal" },
      { id: "ep-billing-redeem", label: "POST /billing/redeem" },
      { id: "ep-admin-stats", label: "GET /admin/stats" },
      { id: "ep-admin-promo", label: "POST /admin/promo" },
    ],
  },
  { id: "credits", label: "Credit Pricing" },
  { id: "sdk", label: "TypeScript SDK" },
  { id: "cli", label: "CLI" },
  { id: "errors", label: "Errors & Rate Limits" },
];

// ─── Copy button component ────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={cs.copyBtn} title="Copy to clipboard">
      {copied ? (
        <span style={{ color: "#22c55e" }}>✓</span>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

// ─── Code block ──────────────────────────────────────────────────────────────

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div style={cs.codeBlock}>
      <div style={cs.codeHeader}>
        <span style={cs.codeLang}>{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre style={cs.code}>{code.trim()}</pre>
    </div>
  );
}

// ─── Method badge ─────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "#60a5fa",
    POST: "#34d399",
    DELETE: "#f87171",
    PUT: "#fbbf24",
    PATCH: "#a78bfa",
  };
  const color = colors[method] ?? "#888";
  return (
    <span style={{
      ...cs.methodBadge,
      color,
      background: `${color}14`,
      border: `1px solid ${color}33`,
    }}>
      {method}
    </span>
  );
}

// ─── Endpoint header ─────────────────────────────────────────────────────────

function EndpointHeader({
  method,
  path,
  desc,
  auth = true,
}: {
  method: string;
  path: string;
  desc: string;
  auth?: boolean;
}) {
  return (
    <div style={cs.epHeader}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <MethodBadge method={method} />
        <code style={cs.epPath}>{path}</code>
        {!auth && (
          <span style={cs.publicBadge}>public</span>
        )}
      </div>
      <p style={cs.epDesc}>{desc}</p>
    </div>
  );
}

// ─── Param table ─────────────────────────────────────────────────────────────

function ParamTable({
  rows,
}: {
  rows: { name: string; type: string; required?: boolean; desc: string }[];
}) {
  return (
    <table style={cs.table}>
      <thead>
        <tr>
          <th style={cs.th}>Parameter</th>
          <th style={cs.th}>Type</th>
          <th style={cs.th}>Required</th>
          <th style={cs.th}>Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td style={{ ...cs.td, fontFamily: "monospace", color: "#ddd" }}>{r.name}</td>
            <td style={{ ...cs.td, color: "#60a5fa", fontFamily: "monospace", fontSize: 12 }}>{r.type}</td>
            <td style={cs.td}>
              {r.required ? (
                <span style={{ color: "#ef4444", fontSize: 11 }}>required</span>
              ) : (
                <span style={{ color: "#333", fontSize: 11 }}>optional</span>
              )}
            </td>
            <td style={{ ...cs.td, color: "#555" }}>{r.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Main docs page ──────────────────────────────────────────────────────────

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      let current = "overview";
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) current = el.getAttribute("data-section") ?? current;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setSidebarOpen(false);
  };

  return (
    <div style={cs.page}>
      {/* Nav */}
      <nav style={cs.nav}>
        <div style={cs.navInner}>
          <a href="/" style={cs.navLogo}>Uncover</a>
          <div style={cs.navRight}>
            <span style={cs.navDivider}>/</span>
            <span style={cs.navCurrent}>Docs</span>
            <div style={cs.navLinks}>
              <a href="/login" style={cs.navLink}>Dashboard →</a>
            </div>
          </div>
        </div>
      </nav>

      <div style={cs.layout}>
        {/* Sidebar */}
        <aside style={{ ...cs.sidebar, ...(sidebarOpen ? cs.sidebarOpen : {}) }}>
          <nav style={cs.sidebarNav}>
            {SECTIONS.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => scrollTo(section.id)}
                  style={{
                    ...cs.sidebarItem,
                    ...(activeSection === section.id ? cs.sidebarItemActive : {}),
                  }}
                >
                  {section.label}
                </button>
                {section.children && (
                  <div style={cs.sidebarChildren}>
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => scrollTo(child.id)}
                        style={{
                          ...cs.sidebarChild,
                          ...(activeSection === child.id ? cs.sidebarChildActive : {}),
                        }}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main style={cs.content}>

          {/* ── Overview ── */}
          <section id="overview" data-section="overview" style={cs.section}>
            <h1 style={cs.h1}>API Reference</h1>
            <p style={cs.lead}>
              The Uncover API lets you surface real user pain points from Reddit, HackerNews, and X.
              Send a query, get back structured problems, sentiment analysis, trends, and a summary.
              Credits-based — no subscriptions required.
            </p>

            <div style={cs.infoGrid}>
              <div style={cs.infoCard}>
                <div style={cs.infoLabel}>Base URL</div>
                <code style={cs.infoValue}>{API_BASE}</code>
              </div>
              <div style={cs.infoCard}>
                <div style={cs.infoLabel}>Authentication</div>
                <code style={cs.infoValue}>Bearer token (API key)</code>
              </div>
              <div style={cs.infoCard}>
                <div style={cs.infoLabel}>Content-Type</div>
                <code style={cs.infoValue}>application/json</code>
              </div>
              <div style={cs.infoCard}>
                <div style={cs.infoLabel}>Rate limit</div>
                <code style={cs.infoValue}>60 req/min · 10 searches/min</code>
              </div>
            </div>

            <CodeBlock
              lang="bash"
              code={`# Quick start
curl -X POST ${API_BASE}/api/search \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"password manager frustrations","sources":["reddit","hackernews"]}'`}
            />
          </section>

          <div style={cs.divider} />

          {/* ── Authentication ── */}
          <section id="authentication" data-section="authentication" style={cs.section}>
            <h2 style={cs.h2}>Authentication</h2>
            <p style={cs.body}>
              All authenticated endpoints require a Bearer token in the <code style={cs.inlineCode}>Authorization</code> header.
              API keys follow the format <code style={cs.inlineCode}>sk_live_</code> followed by a 32-character hex string.
            </p>

            <CodeBlock
              lang="bash"
              code={`# Include in every request
-H "Authorization: Bearer sk_live_API_KEY_HERE"`}
            />

            <p style={cs.body}>
              Get your API key by signing up at <a href="/login" style={cs.link}>uncover.thealxlabs.ca/login</a>.
              Keys are hashed server-side — you must save your key when it is first shown.
            </p>
          </section>

          <div style={cs.divider} />

          {/* ── Endpoints ── */}
          <section id="endpoints" data-section="endpoints" style={cs.section}>
            <h2 style={cs.h2}>Endpoints</h2>

            {/* signup */}
            <div id="ep-signup" data-section="ep-signup" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/auth/signup" desc="Create a new user account and get an API key." auth={false} />
              <h4 style={cs.h4}>Request body</h4>
              <ParamTable rows={[
                { name: "email", type: "string", required: true, desc: "Your email address" },
                { name: "password", type: "string", required: true, desc: "Minimum 8 characters" },
                { name: "name", type: "string", required: false, desc: "Display name (optional)" },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword","name":"Alex"}'`} />
              <CodeBlock lang="json" code={`{
  "user": { "id": "clx...", "email": "you@example.com", "name": "Alex" },
  "apiKey": { "id": "clx...", "key": "sk_live_...", "name": "Default Key" }
}`} />
            </div>

            {/* signin */}
            <div id="ep-signin" data-section="ep-signin" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/auth/signin" desc="Verify credentials. Returns key metadata (not the raw key — save it on signup)." auth={false} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/auth/signin \\
  -H "Content-Type: application/json" \\
  -d '{"email":"you@example.com","password":"yourpassword"}'`} />
              <CodeBlock lang="json" code={`{
  "user": { "id": "clx...", "email": "you@example.com" },
  "apiKeys": [{ "id": "clx...", "name": "Default Key", "createdAt": "...", "lastUsed": null }],
  "message": "1 key(s) found. Use your saved sk_live_ key to authenticate."
}`} />
            </div>

            {/* keys list */}
            <div id="ep-keys-list" data-section="ep-keys-list" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/auth/keys" desc="List all API keys for your account." />
              <CodeBlock lang="bash" code={`curl ${API_BASE}/api/auth/keys \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
              <CodeBlock lang="json" code={`{
  "apiKeys": [
    { "id": "clx...", "name": "Default Key", "createdAt": "2026-01-01T00:00:00Z", "lastUsed": null }
  ]
}`} />
            </div>

            {/* keys create */}
            <div id="ep-keys-create" data-section="ep-keys-create" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/auth/keys" desc="Create a new API key." />
              <ParamTable rows={[
                { name: "name", type: "string", required: false, desc: 'Key label (e.g. "Production")' },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/auth/keys \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Production"}'`} />
              <CodeBlock lang="json" code={`{ "id": "clx...", "key": "sk_live_...", "name": "Production" }`} />
            </div>

            {/* keys delete */}
            <div id="ep-keys-delete" data-section="ep-keys-delete" style={cs.endpoint}>
              <EndpointHeader method="DELETE" path="/api/auth/keys/:id" desc="Revoke an API key. Irreversible." />
              <CodeBlock lang="bash" code={`curl -X DELETE ${API_BASE}/api/auth/keys/KEY_ID \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
              <CodeBlock lang="json" code={`{ "deleted": true }`} />
            </div>

            {/* search */}
            <div id="ep-search" data-section="ep-search" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/search" desc="Run a search against social platforms or custom URLs. Costs 1+ credits." />
              <h4 style={cs.h4}>Social search (sources)</h4>
              <ParamTable rows={[
                { name: "query", type: "string", required: true, desc: "Topic to search for (3–200 characters)" },
                { name: "sources", type: "string[]", required: true, desc: '"reddit" | "twitter" | "hackernews" — at least one' },
                { name: "limit", type: "number", required: false, desc: "Posts to analyze (1–50, default 20)" },
                { name: "options.excludeSubreddits", type: "string[]", required: false, desc: "Subreddits to skip" },
                { name: "options.excludeKeywords", type: "string[]", required: false, desc: "Post keywords to filter out" },
                { name: "options.minUpvotes", type: "number", required: false, desc: "Minimum upvotes for a post" },
                { name: "options.maxAgeHours", type: "number", required: false, desc: "Only include posts newer than N hours" },
              ]} />
              <h4 style={{ ...cs.h4, marginTop: 20 }}>Custom URL search</h4>
              <ParamTable rows={[
                { name: "query", type: "string", required: true, desc: "What you are analyzing" },
                { name: "urls", type: "string[]", required: true, desc: "Up to 5 public URLs to scrape" },
              ]} />
              <CodeBlock lang="bash" code={`# Social search
curl -X POST ${API_BASE}/api/search \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "password manager frustrations",
    "sources": ["reddit", "hackernews"],
    "limit": 20,
    "options": { "minUpvotes": 5, "maxAgeHours": 720 }
  }'

# Custom URL search
curl -X POST ${API_BASE}/api/search \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "customer complaints",
    "urls": ["https://example.com/reviews", "https://example.com/forum"]
  }'`} />
              <CodeBlock lang="json" code={`{
  "requestId": "clx...",
  "status": "completed",
  "query": "password manager frustrations",
  "sources": ["reddit", "hackernews"],
  "postsAnalyzed": 20,
  "summary": "Users report steep pricing, poor mobile UX...",
  "problems": [
    { "text": "Too expensive for personal use", "frequency": 8, "sentiment": "frustrated" },
    { "text": "Mobile app crashes constantly", "frequency": 7, "sentiment": "frustrated" }
  ],
  "trends": ["pricing", "mobile", "browser extension"],
  "cost": 0.05,
  "creditsUsed": 1,
  "cached": false,
  "credits": { "remaining": 49 }
}`} />
            </div>

            {/* search get */}
            <div id="ep-search-get" data-section="ep-search-get" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/search/:requestId" desc="Retrieve a completed search result by ID. Must be your own request." />
              <CodeBlock lang="bash" code={`curl ${API_BASE}/api/search/REQUEST_ID \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
            </div>

            {/* search history */}
            <div id="ep-search-history" data-section="ep-search-history" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/search/history" desc="Get your recent search history." />
              <ParamTable rows={[
                { name: "limit", type: "number", required: false, desc: "Number of results (1–50, default 10)" },
              ]} />
              <CodeBlock lang="bash" code={`curl "${API_BASE}/api/search/history?limit=5" \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
            </div>

            {/* search cost */}
            <div id="ep-search-cost" data-section="ep-search-cost" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/search/cost" desc="Preview the credit cost of a search before running it. No credits deducted." auth={false} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/search/cost \\
  -H "Content-Type: application/json" \\
  -d '{"sources":["reddit","twitter","hackernews"],"limit":30}'`} />
              <CodeBlock lang="json" code={`{ "credits": 3 }`} />
            </div>

            {/* public results */}
            <div id="ep-results-public" data-section="ep-results-public" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/results/:requestId" desc="Fetch a search result publicly — no authentication required. Read-only." auth={false} />
              <CodeBlock lang="bash" code={`curl ${API_BASE}/api/results/REQUEST_ID`} />
              <CodeBlock lang="json" code={`{
  "requestId": "clx...",
  "query": "password manager frustrations",
  "sources": ["reddit"],
  "status": "completed",
  "summary": "...",
  "problems": [...],
  "trends": [...],
  "createdAt": "2026-01-01T00:00:00Z"
}`} />
            </div>

            {/* billing status */}
            <div id="ep-billing-status" data-section="ep-billing-status" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/billing/status" desc="Get your credit balance, plan, available packs, and recent transactions." />
              <CodeBlock lang="bash" code={`curl ${API_BASE}/api/billing/status \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
              <CodeBlock lang="json" code={`{
  "plan": "payg",
  "credits": 48,
  "totalSpent": 5.00,
  "totalSearches": 12,
  "isSubscriber": false,
  "subscription": null,
  "packs": [
    { "key": "starter", "name": "Starter Pack", "credits": 50, "price": "$5.00", "perSearch": "$0.100" }
  ],
  "subscriptionPlans": [...],
  "recentTransactions": [...]
}`} />
            </div>

            {/* billing checkout */}
            <div id="ep-billing-checkout" data-section="ep-billing-checkout" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/billing/checkout" desc="Create a Stripe checkout session to buy a credit pack. Returns a URL to redirect to." />
              <ParamTable rows={[
                { name: "pack", type: "string", required: true, desc: '"starter" | "growth" | "pro_pack" | "scale"' },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/billing/checkout \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"pack":"pro_pack"}'`} />
              <CodeBlock lang="json" code={`{ "url": "https://checkout.stripe.com/...", "sessionId": "cs_...", "pack": {...} }`} />
            </div>

            {/* billing subscribe */}
            <div id="ep-billing-subscribe" data-section="ep-billing-subscribe" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/billing/subscribe" desc="Start a monthly subscription. Returns a Stripe checkout URL." />
              <ParamTable rows={[
                { name: "plan", type: "string", required: true, desc: '"builder" | "team" | "enterprise"' },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/billing/subscribe \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"plan":"team"}'`} />
            </div>

            {/* billing portal */}
            <div id="ep-billing-portal" data-section="ep-billing-portal" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/billing/portal" desc="Open the Stripe billing portal to manage or cancel your subscription." />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/billing/portal \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE"`} />
              <CodeBlock lang="json" code={`{ "url": "https://billing.stripe.com/..." }`} />
            </div>

            {/* billing redeem */}
            <div id="ep-billing-redeem" data-section="ep-billing-redeem" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/billing/redeem" desc="Redeem a promo code to add free credits." />
              <ParamTable rows={[
                { name: "code", type: "string", required: true, desc: "Promo code (e.g. UNCOVER-LAUNCH)" },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/billing/redeem \\
  -H "Authorization: Bearer sk_live_API_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"code":"UNCOVER-LAUNCH"}'`} />
              <CodeBlock lang="json" code={`{ "success": true, "credits": 50, "message": "50 credits added to your account" }`} />
            </div>

            {/* admin stats */}
            <div id="ep-admin-stats" data-section="ep-admin-stats" style={cs.endpoint}>
              <EndpointHeader method="GET" path="/api/admin/stats" desc="Platform-wide stats. Requires X-Admin-Password header." />
              <CodeBlock lang="bash" code={`curl ${API_BASE}/api/admin/stats \\
  -H "X-Admin-Password: YOUR_ADMIN_PASSWORD"`} />
            </div>

            {/* admin promo */}
            <div id="ep-admin-promo" data-section="ep-admin-promo" style={cs.endpoint}>
              <EndpointHeader method="POST" path="/api/admin/promo" desc="Create a promo code. Requires X-Admin-Password header." />
              <ParamTable rows={[
                { name: "credits", type: "number", required: true, desc: "Credits to grant on redemption" },
                { name: "code", type: "string", required: false, desc: "Custom code (auto-generated if omitted)" },
                { name: "maxUses", type: "number", required: false, desc: "Max total redemptions (default 1)" },
                { name: "expiresInDays", type: "number", required: false, desc: "Days until expiry" },
              ]} />
              <CodeBlock lang="bash" code={`curl -X POST ${API_BASE}/api/admin/promo \\
  -H "X-Admin-Password: YOUR_ADMIN_PASSWORD" \\
  -H "Content-Type: application/json" \\
  -d '{"credits":25,"maxUses":100,"code":"LAUNCH25","expiresInDays":30}'`} />
            </div>
          </section>

          <div style={cs.divider} />

          {/* ── Credit Pricing ── */}
          <section id="credits" data-section="credits" style={cs.section}>
            <h2 style={cs.h2}>Credit Pricing</h2>
            <p style={cs.body}>
              Credit cost is calculated dynamically based on what you search. The formula:
            </p>

            <div style={cs.formula}>
              <code style={cs.formulaCode}>
                cost = 1 + (sources − 1) + floor((limit − 1) / 10) + floor(activeFilters / 2)
              </code>
            </div>

            <table style={{ ...cs.table, marginBottom: 24 }}>
              <thead>
                <tr>
                  <th style={cs.th}>Factor</th>
                  <th style={cs.th}>Credit impact</th>
                  <th style={cs.th}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Base (1 source, up to 10 posts)", "+1", "reddit, 10 posts = 1 cr"],
                  ["Additional source", "+1 each", "reddit + hackernews = 2 cr"],
                  ["Additional 10 posts", "+1 per tier", "20 posts = +1, 30 posts = +2"],
                  ["Filters (minUpvotes, maxAge, excludeKeywords, excludeSubreddits)", "+1 per 2 filters", "2 filters = +1 cr"],
                  ["Custom URL search (base)", "2 cr base", "1 URL = 2 cr"],
                  ["Extra custom URLs", "+1 each above 1", "3 URLs = 4 cr"],
                ].map(([factor, impact, example], i) => (
                  <tr key={i}>
                    <td style={cs.td}>{factor}</td>
                    <td style={{ ...cs.td, color: "#22c55e", fontFamily: "monospace" }}>{impact}</td>
                    <td style={{ ...cs.td, color: "#444", fontFamily: "monospace", fontSize: 12 }}>{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={cs.callout}>
              <strong style={{ color: "#ddd" }}>Caching:</strong>{" "}
              <span style={{ color: "#555" }}>
                Identical searches within a short window are served from cache at 0 credits.
                The request is still logged, but no credits are deducted.
              </span>
            </div>

            <h3 style={{ ...cs.h3, marginTop: 32 }}>Credit packs</h3>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Pack</th>
                  <th style={cs.th}>Credits</th>
                  <th style={cs.th}>Price</th>
                  <th style={cs.th}>Per search</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Starter", "50", "$5", "$0.10"],
                  ["Growth", "200", "$15", "$0.075"],
                  ["Pro", "500", "$29", "$0.058"],
                  ["Scale", "2,000", "$79", "$0.040"],
                ].map(([name, credits, price, per]) => (
                  <tr key={name}>
                    <td style={cs.td}>{name}</td>
                    <td style={{ ...cs.td, color: "#ddd" }}>{credits}</td>
                    <td style={{ ...cs.td, color: "#ddd" }}>{price}</td>
                    <td style={{ ...cs.td, color: "#444" }}>{per}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ ...cs.h3, marginTop: 32 }}>Subscriptions</h3>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Plan</th>
                  <th style={cs.th}>Credits/mo</th>
                  <th style={cs.th}>Price</th>
                  <th style={cs.th}>Per search</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Builder", "300", "$19/mo", "$0.063"],
                  ["Team", "1,000", "$49/mo", "$0.049"],
                  ["Enterprise", "5,000", "$149/mo", "$0.030"],
                ].map(([name, credits, price, per]) => (
                  <tr key={name}>
                    <td style={cs.td}>{name}</td>
                    <td style={{ ...cs.td, color: "#ddd" }}>{credits}</td>
                    <td style={{ ...cs.td, color: "#ddd" }}>{price}</td>
                    <td style={{ ...cs.td, color: "#444" }}>{per}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div style={cs.divider} />

          {/* ── SDK ── */}
          <section id="sdk" data-section="sdk" style={cs.section}>
            <h2 style={cs.h2}>TypeScript SDK</h2>
            <p style={cs.body}>
              Install the official SDK from npm:
            </p>
            <CodeBlock lang="bash" code="npm install @uncover/sdk" />

            <h3 style={cs.h3}>Basic usage</h3>
            <CodeBlock lang="typescript" code={`import { Uncover } from "@uncover/sdk";

const client = new Uncover("sk_live_API_KEY_HERE");

const result = await client.search({
  query: "password manager frustrations",
  sources: ["reddit", "hackernews"],
  limit: 20,
});

console.log(result.summary);
console.log(result.problems);
console.log(result.trends);`} />

            <h3 style={cs.h3}>With options</h3>
            <CodeBlock lang="typescript" code={`const result = await client.search({
  query: "CRM software complaints",
  sources: ["reddit", "twitter"],
  limit: 30,
  options: {
    minUpvotes: 10,
    maxAgeHours: 720,           // last 30 days
    excludeSubreddits: ["AskReddit"],
    excludeKeywords: ["spam", "ad"],
  },
});`} />

            <h3 style={cs.h3}>Get search by ID</h3>
            <CodeBlock lang="typescript" code={`const status = await client.getSearchStatus("REQUEST_ID");
console.log(status.status); // "completed" | "failed" | "pending"`} />

            <h3 style={cs.h3}>SDK types</h3>
            <CodeBlock lang="typescript" code={`import type { SearchRequest, SearchResponse, Problem } from "@uncover/sdk";

interface Problem {
  text: string;
  frequency: number;               // 1–10
  sentiment: "frustrated" | "confused" | "disappointed" | "neutral";
}

interface SearchResponse {
  requestId: string;
  status: "pending" | "processing" | "completed" | "failed";
  query: string;
  sources: ("reddit" | "twitter" | "hackernews")[];
  postsAnalyzed?: number;
  problems?: Problem[];
  summary?: string;
  trends?: string[];
  cost?: number;
  credits?: { remaining: number };
}`} />
          </section>

          <div style={cs.divider} />

          {/* ── CLI ── */}
          <section id="cli" data-section="cli" style={cs.section}>
            <h2 style={cs.h2}>CLI</h2>
            <p style={cs.body}>The CLI lets you run searches and manage your account from the terminal.</p>
            <CodeBlock lang="bash" code="npm install -g @uncover/cli" />

            <h3 style={cs.h3}>Authentication</h3>
            <CodeBlock lang="bash" code={`# Paste your API key directly
uncover login --key sk_live_API_KEY_HERE

# Or verify with email first (then paste key)
uncover login`} />

            <h3 style={cs.h3}>Run a search</h3>
            <CodeBlock lang="bash" code={`# Basic search
uncover scrape "password manager frustrations"

# Multiple sources
uncover scrape "CRM complaints" --sources reddit,hackernews

# With filters
uncover scrape "Notion UX issues" \\
  --sources reddit \\
  --limit 30 \\
  --min-upvotes 10 \\
  --max-age 720

# Raw JSON output
uncover scrape "Slack issues" --json`} />

            <h3 style={cs.h3}>Account management</h3>
            <CodeBlock lang="bash" code={`# Check credits and plan
uncover status

# Recent search history
uncover history --limit 10

# List API keys
uncover keys

# Sign out
uncover logout`} />

            <h3 style={cs.h3}>Available flags</h3>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Flag</th>
                  <th style={cs.th}>Default</th>
                  <th style={cs.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["--sources", "reddit", "Comma-separated: reddit,twitter,hackernews"],
                  ["--limit", "20", "Posts to analyze (1–50)"],
                  ["--exclude-subreddits", "—", "Comma-separated subreddits to skip"],
                  ["--exclude-keywords", "—", "Keywords to filter out"],
                  ["--min-upvotes", "0", "Minimum post upvotes"],
                  ["--max-age", "—", "Max post age in hours"],
                  ["--json", "false", "Output raw JSON"],
                ].map(([flag, def, desc]) => (
                  <tr key={flag}>
                    <td style={{ ...cs.td, fontFamily: "monospace", color: "#ddd" }}>{flag}</td>
                    <td style={{ ...cs.td, color: "#444", fontFamily: "monospace", fontSize: 12 }}>{def}</td>
                    <td style={{ ...cs.td, color: "#555" }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div style={cs.divider} />

          {/* ── Errors ── */}
          <section id="errors" data-section="errors" style={cs.section}>
            <h2 style={cs.h2}>Errors & Rate Limits</h2>
            <p style={cs.body}>All errors return JSON with an <code style={cs.inlineCode}>error</code> field.</p>
            <CodeBlock lang="json" code={`{ "error": "Insufficient credits", "credits": 0, "required": 2 }`} />

            <h3 style={cs.h3}>HTTP status codes</h3>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Code</th>
                  <th style={cs.th}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["200", "Success"],
                  ["201", "Created (signup, key creation)"],
                  ["400", "Bad request — invalid parameters"],
                  ["401", "Unauthorized — missing or invalid API key"],
                  ["402", "Insufficient credits"],
                  ["403", "Forbidden — accessing another user's resource"],
                  ["404", "Not found"],
                  ["409", "Conflict — email already registered, code already redeemed"],
                  ["410", "Gone — promo code expired or fully redeemed"],
                  ["429", "Rate limit exceeded — wait and retry"],
                  ["500", "Internal server error"],
                ].map(([code, meaning]) => (
                  <tr key={code}>
                    <td style={{ ...cs.td, fontFamily: "monospace", color: "#ddd" }}>{code}</td>
                    <td style={{ ...cs.td, color: "#555" }}>{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ ...cs.h3, marginTop: 32 }}>Rate limits</h3>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Endpoint</th>
                  <th style={cs.th}>Limit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["All API endpoints", "60 requests / minute"],
                  ["POST /api/search", "10 requests / minute"],
                  ["POST /api/auth/signup", "10 requests / minute"],
                ].map(([ep, limit]) => (
                  <tr key={ep}>
                    <td style={{ ...cs.td, fontFamily: "monospace", color: "#ddd", fontSize: 12 }}>{ep}</td>
                    <td style={{ ...cs.td, color: "#555" }}>{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ ...cs.callout, marginTop: 24 }}>
              <strong style={{ color: "#ddd" }}>Tip:</strong>{" "}
              <span style={{ color: "#555" }}>
                Use <code style={cs.inlineCode}>POST /api/search/cost</code> before running a search to preview the credit cost.
                Cached results are free — identical searches within a short window cost 0 credits.
              </span>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const cs: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },

  // Nav
  nav: { borderBottom: "1px solid #1a1a1a", position: "sticky" as const, top: 0, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", zIndex: 50 },
  navInner: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navLogo: { fontSize: 15, fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", textDecoration: "none" },
  navRight: { display: "flex", alignItems: "center", gap: 10 },
  navDivider: { color: "#2a2a2a", fontSize: 16 },
  navCurrent: { fontSize: 14, color: "#444" },
  navLinks: { marginLeft: 20 },
  navLink: { fontSize: 13, color: "#555", textDecoration: "none" },

  // Layout
  layout: { display: "flex", maxWidth: 1280, margin: "0 auto", minHeight: "calc(100vh - 56px)" },

  // Sidebar
  sidebar: { width: 240, flexShrink: 0, borderRight: "1px solid #141414", padding: "28px 0", position: "sticky" as const, top: 56, height: "calc(100vh - 56px)", overflowY: "auto" as const },
  sidebarOpen: { display: "block" },
  sidebarNav: { padding: "0 12px" },
  sidebarItem: { display: "block", width: "100%", textAlign: "left" as const, fontSize: 13, color: "#444", background: "transparent", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 6, letterSpacing: "-0.01em" },
  sidebarItemActive: { color: "#fff", background: "#141414" },
  sidebarChildren: { paddingLeft: 12, marginBottom: 4 },
  sidebarChild: { display: "block", width: "100%", textAlign: "left" as const, fontSize: 12, color: "#333", background: "transparent", border: "none", cursor: "pointer", padding: "4px 12px", borderRadius: 6 },
  sidebarChildActive: { color: "#aaa", background: "#111" },

  // Content
  content: { flex: 1, padding: "40px 48px", maxWidth: 860, overflowX: "hidden" as const },

  // Sections
  section: { marginBottom: 4 },
  divider: { height: 1, background: "#141414", margin: "48px 0" },
  endpoint: { marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid #0f0f0f" },
  epHeader: { marginBottom: 20 },
  epPath: { fontSize: 14, color: "#ddd", background: "#111", padding: "4px 10px", borderRadius: 6, letterSpacing: "-0.01em", fontFamily: "monospace" },
  epDesc: { fontSize: 14, color: "#444", lineHeight: 1.6 },

  // Typography
  h1: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16 },
  h2: { fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", marginBottom: 16 },
  h3: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", color: "#ddd", marginBottom: 12, marginTop: 24 },
  h4: { fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 10, letterSpacing: "-0.01em" },
  body: { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 20 },
  lead: { fontSize: 16, color: "#555", lineHeight: 1.75, marginBottom: 28 },
  link: { color: "#888", textDecoration: "underline", textDecorationColor: "#333" },
  inlineCode: { fontFamily: "monospace", fontSize: 12, color: "#aaa", background: "#111", padding: "2px 6px", borderRadius: 4, border: "1px solid #1e1e1e" },

  // Info grid
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 24 },
  infoCard: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 10, padding: "14px 16px" },
  infoLabel: { fontSize: 11, color: "#333", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" as const },
  infoValue: { fontSize: 12, color: "#888", fontFamily: "monospace" },

  // Method badge
  methodBadge: { fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.06em", fontFamily: "monospace" },
  publicBadge: { fontSize: 10, color: "#888", background: "#141414", border: "1px solid #222", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.04em" },

  // Code block
  codeBlock: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden", marginBottom: 16 },
  codeHeader: { padding: "8px 14px", borderBottom: "1px solid #141414", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#090909" },
  codeLang: { fontSize: 10, color: "#2a2a2a", letterSpacing: "0.08em", textTransform: "uppercase" as const, fontWeight: 600 },
  code: { fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace", fontSize: 12, color: "#666", padding: "16px 18px", margin: 0, lineHeight: 1.8, overflowX: "auto" as const, display: "block" },

  // Copy button
  copyBtn: { background: "transparent", border: "none", cursor: "pointer", color: "#333", padding: "2px", display: "flex", alignItems: "center" },

  // Tables
  table: { width: "100%", borderCollapse: "collapse" as const, background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 10, overflow: "hidden", marginBottom: 16, fontSize: 13 },
  th: { fontSize: 11, color: "#333", padding: "10px 14px", textAlign: "left" as const, borderBottom: "1px solid #141414", fontWeight: 400, letterSpacing: "0.04em", textTransform: "uppercase" as const },
  td: { fontSize: 13, color: "#555", padding: "10px 14px", borderBottom: "1px solid #0f0f0f", lineHeight: 1.5 },

  // Formula
  formula: { background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 10, padding: "16px 20px", marginBottom: 20 },
  formulaCode: { fontFamily: "monospace", fontSize: 13, color: "#888", display: "block" },

  // Callout
  callout: { background: "#0c0c0c", border: "1px solid #1e1e1e", borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 1.65 },
};
