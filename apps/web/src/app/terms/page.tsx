"use client";

export default function TermsPage() {
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
          <h1 style={s.h1}>Terms of Service</h1>
          <p style={s.meta}>Last updated: March 15, 2026 · Effective immediately</p>
        </div>

        <div style={s.body}>
          <Section title="1. Acceptance of Terms">
            By accessing or using Uncover ("the Service"), operated by TheAlxLabs ("we", "us", "our") at uncover.thealxlabs.ca, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service. These terms apply to all users, including those who access the Service via API, CLI, or SDK.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 13 years old to use Uncover. By using the Service, you represent that you meet this requirement. If you are under 18, you represent that you have obtained parental or guardian consent. We reserve the right to terminate accounts of users who misrepresent their age.
          </Section>

          <Section title="3. Account Registration">
            <p style={s.p}>You must provide a valid email address to create an account. You are responsible for maintaining the confidentiality of your API keys and password. You are responsible for all activity that occurs under your account.</p>
            <p style={s.p}>You must notify us immediately at legal@thealxlabs.ca if you suspect unauthorized use of your account. We are not liable for any loss or damage resulting from unauthorized access to your account.</p>
            <p style={s.p}>API keys are shown only once at creation. We cannot recover lost API keys — you may create new ones and revoke old ones at any time via the dashboard.</p>
          </Section>

          <Section title="4. Credits and Billing">
            <p style={s.p}><strong style={s.strong}>Credit packs</strong> are one-time purchases. One credit = one search. Credits never expire and are non-transferable between accounts.</p>
            <p style={s.p}><strong style={s.strong}>Subscriptions</strong> renew monthly. Credits from subscriptions are granted at the start of each billing cycle. Unused subscription credits do not roll over but PAYG credits do. You may cancel your subscription at any time via the billing portal — cancellation takes effect at the end of the current billing period.</p>
            <p style={s.p}><strong style={s.strong}>No refunds:</strong> All purchases of credit packs are final and non-refundable. Subscription fees for the current billing period are non-refundable. If we terminate your account for cause, no refund will be issued. If we terminate your account without cause, we will issue a pro-rated refund for unused credits.</p>
            <p style={s.p}><strong style={s.strong}>Pricing:</strong> We reserve the right to change pricing at any time. Price changes will not affect existing credit packs already purchased. Subscription price changes will be communicated 30 days in advance.</p>
            <p style={s.p}>All payments are processed by Stripe. By making a purchase, you agree to Stripe's Terms of Service.</p>
          </Section>

          <Section title="5. Acceptable Use">
            <p style={s.p}>You agree to use Uncover only for lawful purposes. You must not:</p>
            <ul style={s.ul}>
              <li style={s.li}>Use the Service to scrape, collect, or process data in violation of applicable laws</li>
              <li style={s.li}>Attempt to circumvent rate limits or abuse the API</li>
              <li style={s.li}>Use the Service to harass, stalk, or target specific individuals</li>
              <li style={s.li}>Resell or redistribute raw API access without our written permission</li>
              <li style={s.li}>Use automated scripts to create multiple accounts</li>
              <li style={s.li}>Attempt to reverse engineer, decompile, or interfere with the Service</li>
              <li style={s.li}>Use the Service in any way that could damage, disable, or impair our infrastructure</li>
              <li style={s.li}>Violate any third-party platform's terms of service through your use of our Service</li>
            </ul>
            <p style={s.p}>We reserve the right to suspend or terminate accounts that violate these terms without notice or refund.</p>
          </Section>

          <Section title="6. Scraped Data and Third-Party Content">
            <p style={s.p}>Uncover retrieves publicly available data from third-party platforms including Reddit, X, HackerNews, and optionally other public websites. We do not endorse, verify, or take responsibility for any third-party content returned by the Service.</p>
            <p style={s.p}><strong style={s.strong}>You are solely responsible</strong> for how you use the data returned by Uncover. You must independently verify that your use of scraped data complies with the terms of service of the originating platform and applicable law.</p>
            <p style={s.p}>We make reasonable efforts to respect robots.txt files and crawl delays of third-party websites. We do not guarantee continued access to any particular data source — third-party platforms may block our scrapers at any time without notice, which may result in reduced data quality or availability for specific sources.</p>
            <p style={s.p}><strong style={s.strong}>Custom website scraping</strong> (where available) is provided as-is. You must ensure you have the right to scrape any custom URL you provide. By submitting a URL for scraping, you represent that scraping that URL does not violate any applicable law or third-party terms of service. We are not liable for any consequences arising from scraping URLs you submit.</p>
          </Section>

          <Section title="7. Disclaimer of Warranties">
            <p style={s.p}>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE EXPRESSLY DISCLAIM ALL WARRANTIES INCLUDING:</p>
            <ul style={s.ul}>
              <li style={s.li}>Accuracy, completeness, or reliability of scraped data or AI analysis</li>
              <li style={s.li}>Uninterrupted or error-free operation of the Service</li>
              <li style={s.li}>Fitness for any particular purpose</li>
              <li style={s.li}>That the Service will meet your requirements</li>
            </ul>
            <p style={s.p}>AI-generated analysis is provided for informational purposes only. It may contain errors, omissions, or inaccuracies. Do not make business, legal, financial, or other significant decisions based solely on Uncover output without independent verification.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THEALXLABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 3 MONTHS PRECEDING THE CLAIM.
          </Section>

          <Section title="9. Intellectual Property">
            <p style={s.p}>The Uncover platform, including its software, design, and branding, is owned by TheAlxLabs and protected by applicable intellectual property laws.</p>
            <p style={s.p}>You retain ownership of any data you submit as queries. You grant us a limited license to process your queries solely to provide the Service.</p>
            <p style={s.p}>Scraped content returned by the Service remains the property of its original authors and platforms. We do not claim ownership of third-party content.</p>
          </Section>

          <Section title="10. DMCA and Copyright">
            <p style={s.p}>Uncover retrieves publicly available content for analytical purposes under fair use/fair dealing principles. We process content to extract insights and do not create permanent archives of copyrighted material.</p>
            <p style={s.p}>If you believe the Service has been used to infringe your copyright, contact us at legal@thealxlabs.ca with: (1) identification of the copyrighted work, (2) identification of the infringing material, (3) your contact information, and (4) a statement that you have a good faith belief the use is unauthorized.</p>
          </Section>

          <Section title="11. Privacy">
            Your use of the Service is also governed by our Privacy Policy at uncover.thealxlabs.ca/privacy, which is incorporated into these Terms by reference.
          </Section>

          <Section title="12. Indemnification">
            You agree to indemnify and hold harmless TheAlxLabs and its operators from any claims, damages, losses, or expenses (including legal fees) arising from: (a) your use of the Service, (b) your violation of these Terms, (c) your violation of any third-party rights, or (d) any data or queries you submit to the Service.
          </Section>

          <Section title="13. Termination">
            <p style={s.p}>We may suspend or terminate your account at any time for violation of these Terms. You may terminate your account at any time by contacting us at legal@thealxlabs.ca.</p>
            <p style={s.p}>Upon termination, your right to use the Service ceases immediately. Sections 7, 8, 9, 10, and 12 survive termination.</p>
          </Section>

          <Section title="14. Governing Law">
            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Toronto, Ontario, Canada.
          </Section>

          <Section title="15. Changes to These Terms">
            We may update these Terms at any time. We will notify registered users of material changes by email at least 14 days before they take effect. Continued use of the Service after changes take effect constitutes acceptance.
          </Section>

          <Section title="16. Contact">
            <p style={s.p}>For legal inquiries: <a href="mailto:legal@thealxlabs.ca" style={s.link}>legal@thealxlabs.ca</a></p>
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
