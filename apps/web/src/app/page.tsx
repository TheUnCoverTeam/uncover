"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup, signin, saveKey } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState("");

  const handleSignup = async () => {
    if (!email || !password) { setError("Email and password required"); return; }
    setError("");
    setLoading(true);
    try {
      const data = await signup(email, password, name);
      saveKey(data.apiKey.key);
      setNewKey(data.apiKey.key);
      setTimeout(() => router.push("/dashboard"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!email || !password) { setError("Email and password required"); return; }
    setError("");
    setLoading(true);
    try {
      await signin(email, password);
      const stored = typeof window !== "undefined" ? localStorage.getItem("uncover_api_key") : null;
      if (stored) {
        router.push("/dashboard");
      } else {
        setError("Credentials valid — paste your saved API key below to continue.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyLogin = (key: string) => {
    if (!key.startsWith("sk_live_")) { setError("Invalid key format — expected sk_live_..."); return; }
    saveKey(key);
    router.push("/dashboard");
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <a href="/" style={s.backLink}>← Uncover</a>

        <div style={s.header}>
          <h1 style={s.title}>
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p style={s.subtitle}>
            {tab === "signin"
              ? "Sign in to access your dashboard"
              : "Get your API key and start searching"}
          </p>
        </div>

        <div style={s.tabs}>
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(""); setNewKey(""); }}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : s.tabInactive) }}
            >
              {t === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {tab === "signup" && !newKey && (
          <div style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Name <span style={s.optional}>optional</span></label>
              <input style={s.input} placeholder="Alex" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignup()} />
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} onClick={handleSignup} disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        )}

        {tab === "signin" && (
          <div style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignin()} />
            </div>
            <button style={{ ...s.btn, opacity: loading ? 0.6 : 1 }} onClick={handleSignin} disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>

            <div style={s.divider}><span style={s.dividerText}>or paste your API key</span></div>
            <ApiKeyInput onLogin={handleKeyLogin} />
          </div>
        )}

        {error && <div style={s.error}>{error}</div>}

        {newKey && (
          <div style={s.keyBox}>
            <div style={s.keyBoxHeader}>
              <span style={s.keyBoxTitle}>Your API key</span>
              <span style={s.keyBoxNote}>Save this now — it won&apos;t be shown again</span>
            </div>
            <div style={s.keyValue}>{newKey}</div>
            <div style={s.keyRedirect}>Redirecting to dashboard...</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApiKeyInput({ onLogin }: { onLogin: (key: string) => void }) {
  const [key, setKey] = useState("");
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        style={{ ...s.input, flex: 1, marginBottom: 0 }}
        placeholder="sk_live_..."
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onLogin(key)}
      />
      <button
        style={{ ...s.btn, width: "auto", padding: "0 16px", flexShrink: 0 }}
        onClick={() => onLogin(key)}
      >
        Go
      </button>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  card: { width: "100%", maxWidth: 400, background: "#0f0f0f", border: "1px solid #1f1f1f", borderRadius: 16, padding: "32px 28px" },
  backLink: { display: "inline-block", fontSize: 13, color: "#444", textDecoration: "none", marginBottom: 24 },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 600, letterSpacing: "-0.03em", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#555" },
  tabs: { display: "flex", background: "#0c0c0c", border: "1px solid #1a1a1a", borderRadius: 8, padding: 3, marginBottom: 24, gap: 2 },
  tab: { flex: 1, fontSize: 13, padding: "7px", border: "none", cursor: "pointer", borderRadius: 6, transition: "all 0.15s" },
  tabActive: { background: "#1a1a1a", color: "#ddd", fontWeight: 500 },
  tabInactive: { background: "transparent", color: "#444" },
  form: { display: "flex", flexDirection: "column" as const, gap: 14 },
  field: { display: "flex", flexDirection: "column" as const, gap: 6 },
  label: { fontSize: 13, color: "#777", fontWeight: 400 },
  optional: { color: "#333", fontWeight: 400 },
  input: { background: "#0c0c0c", border: "1px solid #1f1f1f", borderRadius: 8, color: "#ddd", fontSize: 14, padding: "10px 12px", outline: "none", width: "100%", boxSizing: "border-box" as const },
  btn: { width: "100%", background: "#fff", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, padding: "11px", cursor: "pointer" },
  divider: { display: "flex", alignItems: "center", gap: 12 },
  dividerText: { fontSize: 12, color: "#2a2a2a", whiteSpace: "nowrap" as const },
  error: { marginTop: 16, fontSize: 13, color: "#f87171", background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: 8, padding: "10px 14px", lineHeight: 1.5 },
  keyBox: { marginTop: 20, background: "#0c0c0c", border: "1px solid #1f1f1f", borderRadius: 10, padding: "16px" },
  keyBoxHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  keyBoxTitle: { fontSize: 13, fontWeight: 500, color: "#ddd" },
  keyBoxNote: { fontSize: 11, color: "#444" },
  keyValue: { fontSize: 12, color: "#888", wordBreak: "break-all" as const, lineHeight: 1.6, fontFamily: "monospace", marginBottom: 10 },
  keyRedirect: { fontSize: 12, color: "#333" },
};
