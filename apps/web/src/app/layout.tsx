import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uncover — Surface Real Problems from Social Data",
  description:
    "Query Reddit, X, and HackerNews. Get structured pain points, trends, and AI analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            --bg: #0a0a0a;
            --surface: #0f0f0f;
            --border: #1a1a1a;
            --text: #e0e0e0;
            --muted: #666;
            --dim: #333;
            --white: #fff;
            --green: #22c55e;
            --red: #ef4444;
            --yellow: #eab308;
          }
          body {
            background: var(--bg);
            color: var(--text);
            font-family: var(--font);
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          input, select, button, textarea { font-family: inherit; }
          details summary::-webkit-details-marker { display: none; }
          @media (max-width: 768px) {
            .hide-mobile { display: none !important; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
