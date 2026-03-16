"use client";

export default function PrivacyPage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navInner}>
          <a href="/" style={s.logo}>Uncover</a>
          <a href="/login" style={s.navBtn}>Dashboard</a>
        </div>
      </nav>
      <main style={s.main}>
        <div style={s.header}>
          <span style={s.tag}>Legal</span>
          <h1 style={s.h1}>Privacy Policy</h1>
          <p style={s.meta}>Last updated: March 15, 2026</p>
        </div>

        <div style={s.body}>
          <Section title="1. Overview">
            Uncover ("we", "us", "our") is operated by TheAlxLabs, based in Toronto, Ontario, Canada. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information. By using Uncover at uncover.thealxlabs.ca or our API, you agree to this policy.
          </Section>

          <Section title="2. Information We Collect">
            <p style={s.p}><strong style={s.strong}>Account information:</strong> When you sign up, we collect your email address, an optional display name, and a hashed version of your password. We never store your password in plain text.</p>
            <p style={s.p}><strong style={s.strong}>API keys:</strong> We store a one-way SHA-256 hash of your API key. The raw key is shown only once at creation and is never stored by us.</p>
            <p style={s.p}><strong style={s.strong}>Search history:</strong> We store the queries you run, the sources selected, the results returned, and the timestamp of each search. This is used to power your search history view and for billing purposes.</p>
            <p style={s.p}><strong style={s.strong}>Billing information:</strong> We use Stripe to process payments. We store your Stripe customer ID, subscription status, and credit balance. We do not store credit card numbers — Stripe handles all payment data.</p>
            <p style={s.p}><strong style={s.strong}>Usage data:</strong> We log API request metadata (timestamps, endpoints called, response codes) for debugging and abuse prevention. We do not log request or response bodies beyond what is stored as part of your search history.</p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul style={s.ul}>
              <li style={s.li}>To provide and operate the Uncover service</li>
              <li style={s.li}>To process payments and manage your credit balance</li>
              <li style={s.li}>To send transactional emails (account creation, billing receipts)</li>
              <li style={s.li}>To detect and prevent abuse, fraud, and unauthorized access</li>
              <li style={s.li}>To improve the service based on aggregate usage patterns</li>
            </ul>
            <p style={s.p}>We do not sell your personal information to third parties. We do not use your data for advertising. We do not share your search queries or results with anyone.</p>
          </Section>

          <Section title="4. Data Storage and Security">
            <p style={s.p}>Your data is stored in a PostgreSQL database hosted by Neon (neon.tech), with servers located in the United States. We use industry-standard encryption in transit (TLS) and at rest.</p>
            <p style={s.p}>API keys are hashed using SHA-256 before storage. Passwords are hashed using bcrypt with a cost factor of 10.</p>
            <p style={s.p}>While we take reasonable steps to protect your data, no system is completely secure. You use Uncover at your own risk.</p>
          </Section>

          <Section title="5. Data Retention">
            <p style={s.p}>We retain your account data for as long as your account is active. Search results are retained for 90 days and then automatically deleted. If you request account deletion, we will delete your personal data within 30 days, except where retention is required by law or for fraud prevention.</p>
          </Section>

          <Section title="6. Third-Party Services">
            <p style={s.p}>We use the following third-party services to operate Uncover:</p>
            <ul style={s.ul}>
              <li style={s.li}><strong style={s.strong}>Stripe</strong> — payment processing. Subject to Stripe's Privacy Policy.</li>
              <li style={s.li}><strong style={s.strong}>Neon</strong> — database hosting. Data stored in US-East region.</li>
              <li style={s.li}><strong style={s.strong}>Render</strong> — API server hosting.</li>
              <li style={s.li}><strong style={s.strong}>Vercel</strong> — web app hosting.</li>
              <li style={s.li}><strong style={s.strong}>Resend</strong> — transactional email delivery.</li>
              <li style={s.li}><strong style={s.strong}>Groq / OpenRouter</strong> — AI analysis of scraped content. We send anonymized post content for analysis; no personally identifiable information is included.</li>
            </ul>
          </Section>

          <Section title="7. Scraped Data">
            <p style={s.p}>Uncover scrapes publicly available data from Reddit, X (via Nitter), HackerNews, and optionally other public websites as requested by users. We do not scrape private or authenticated content. Scraped content is processed to extract insights and then discarded — we do not build long-term archives of scraped content.</p>
            <p style={s.p}>If you believe content associated with you has been inappropriately processed, contact us at privacy@thealxlabs.ca and we will address your request within 14 business days.</p>
          </Section>

          <Section title="8. Your Rights">
            <p style={s.p}>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul style={s.ul}>
              <li style={s.li}><strong style={s.strong}>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li style={s.li}><strong style={s.strong}>Correction:</strong> Request correction of inaccurate data</li>
              <li style={s.li}><strong style={s.strong}>Deletion:</strong> Request deletion of your account and associated data</li>
              <li style={s.li}><strong style={s.strong}>Portability:</strong> Request your data in a machine-readable format</li>
              <li style={s.li}><strong style={s.strong}>Objection:</strong> Object to certain types of processing</li>
            </ul>
            <p style={s.p}>To exercise any of these rights, email privacy@thealxlabs.ca. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Children">
            Uncover is not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided us with personal information, contact us and we will delete it promptly.
          </Section>

          <Section title="10. Canadian and International Users">
            <p style={s.p}>Uncover complies with the Personal Information Protection and Electronic Documents Act (PIPEDA) applicable to Canadian businesses. If you are located in the European Economic Area, you have additional rights under GDPR. If you are located in California, you have additional rights under CCPA.</p>
            <p style={s.p}>By using Uncover, you consent to the transfer of your information to Canada and the United States for processing.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify registered users by email of material changes. Continued use of Uncover after changes constitutes acceptance of the updated policy.
          </Section>

          <Section title="12. Contact">
            <p style={s.p}>For privacy-related inquiries: <a href="mailto:privacy@thealxlabs.ca" style={s.link}>privacy@thealxlabs.ca</a></p>
            <p style={s.p}>TheAlxLabs — Toronto, Ontario, Canada</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "#e0e0e0", marginBottom: 14, letterSpacing: "-0.02em" }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#777", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #141414", padding: "28px 0", marginTop: 40 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 32px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#2a2a2a", flexWrap: "wrap" as const, gap: 12 }}>
        <a href="/" style={{ color: "#333", textDecoration: "none" }}>← Back to Uncover</a>
        <div style={{ display: "flex", gap: 24 }}>
          <a href="/privacy" style={{ color: "#333", textDecoration: "none" }}>Privacy</a>
          <a href="/terms" style={{ color: "#333", textDecoration: "none" }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif" },
  nav: { borderBottom: "1px solid #141414", position: "sticky" as const, top: 0, background: "rgba(10,10,10,0.9)", backdropFilter: "blur(12px)", zIndex: 50 },
  navInner: { maxWidth: 720, margin: "0 auto", padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none" },
  navBtn: { fontSize: 13, color: "#777", textDecoration: "none" },
  main: { maxWidth: 720, margin: "0 auto", padding: "64px 32px 80px" },
  header: { marginBottom: 48, paddingBottom: 32, borderBottom: "1px solid #141414" },
  tag: { display: "inline-block", fontSize: 11, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 14 },
  h1: { fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", marginBottom: 8 },
  meta: { fontSize: 13, color: "#333" },
  body: {},
  p: { marginBottom: 12 },
  strong: { color: "#aaa", fontWeight: 500 },
  ul: { paddingLeft: 20, marginBottom: 12 },
  li: { marginBottom: 6 },
  link: { color: "#888", textDecoration: "underline" },
};
