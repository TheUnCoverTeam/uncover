/**
 * Email service via Resend.
 * Set RESEND_API_KEY in your environment.
 * Verify your domain at resend.com/domains first.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM = process.env.EMAIL_FROM ?? "Uncover <noreply@uncover.thealxlabs.ca>";
const WEB_URL = process.env.WEB_URL ?? "http://localhost:3000";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[email] Resend error:", err);
    // Don't throw — email failure shouldn't break signup
  }
}

export async function sendWelcomeEmail(
  email: string,
  apiKey: string
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Welcome to Uncover — your API key",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Courier New',monospace;color:#e8e8e8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1c1c1c;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #1c1c1c;">
              <span style="font-family:Arial,sans-serif;font-weight:900;font-size:16px;letter-spacing:0.12em;color:#e8e8e8;text-transform:uppercase;">UNCOVER</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="font-size:13px;color:#555;margin:0 0 24px;line-height:1.8;">
                Welcome. Your account is ready.
              </p>

              <p style="font-size:13px;color:#555;margin:0 0 8px;">Your API key:</p>
              <div style="background:#080808;border:1px solid rgba(232,255,71,0.2);padding:16px 20px;margin-bottom:24px;word-break:break-all;">
                <span style="font-size:12px;color:#e8ff47;letter-spacing:0.05em;">${apiKey}</span>
              </div>

              <p style="font-size:11px;color:#333;margin:0 0 32px;line-height:1.8;">
                Save this key — it won't be shown again. Use it in the Authorization header as <span style="color:#555;">Bearer sk_live_...</span>
              </p>

              <!-- Quick start -->
              <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#2a2a2a;margin:0 0 16px;">Quick start</p>
              <div style="background:#080808;border:1px solid #1c1c1c;padding:16px 20px;margin-bottom:32px;">
                <pre style="margin:0;font-size:11px;color:#555;line-height:1.8;white-space:pre-wrap;">curl -X POST ${WEB_URL.replace("3000", "3001")}/api/search \\
  -H "Authorization: Bearer ${apiKey.slice(0, 20)}..." \\
  -d '{"query":"your topic","sources":["reddit"]}'</pre>
              </div>

              <a href="${WEB_URL}/dashboard" style="display:inline-block;background:#e8ff47;color:#000;font-family:'Courier New',monospace;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:14px 24px;text-decoration:none;">
                Open Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1c1c1c;">
              <p style="font-size:10px;color:#2a2a2a;margin:0;line-height:1.8;">
                Uncover · Built by TheAlxLabs · Credits never expire
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

export async function sendLowCreditsEmail(
  email: string,
  creditsRemaining: number
): Promise<void> {
  await sendEmail({
    to: email,
    subject: `Low credits: ${creditsRemaining} search${creditsRemaining === 1 ? "" : "es"} remaining`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0f0f0f;border:1px solid #1a1a1a;border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:28px 36px;border-bottom:1px solid #1a1a1a;">
              <span style="font-family:'Inter',sans-serif;font-weight:600;font-size:15px;letter-spacing:-0.03em;color:#fff;">Uncover</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">

              <!-- Warning indicator -->
              <div style="display:inline-block;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.2);border-radius:8px;padding:8px 14px;margin-bottom:24px;">
                <span style="font-size:12px;color:#eab308;font-weight:500;letter-spacing:-0.01em;">⚠ Low credits</span>
              </div>

              <h1 style="font-size:22px;font-weight:700;letter-spacing:-0.04em;color:#fff;margin:0 0 12px;line-height:1.2;">
                You have ${creditsRemaining} credit${creditsRemaining === 1 ? "" : "s"} left
              </h1>

              <p style="font-size:14px;color:#555;margin:0 0 28px;line-height:1.75;">
                Your Uncover account is running low. Top up now to keep your searches running without interruption.
                Credits never expire — buy once, use anytime.
              </p>

              <!-- Credit info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;border:1px solid #1a1a1a;border-radius:10px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid #141414;">
                    <span style="font-size:11px;color:#333;text-transform:uppercase;letter-spacing:0.08em;font-weight:500;">Credits remaining</span><br/>
                    <span style="font-size:32px;font-weight:700;letter-spacing:-0.05em;color:#eab308;line-height:1.2;">${creditsRemaining}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="font-size:13px;color:#444;line-height:1.65;">
                      1 credit = 1 social search &nbsp;&middot;&nbsp; 2 credits = 1 custom URL search<br/>
                      Credits never expire
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Packs -->
              <p style="font-size:12px;color:#333;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;font-weight:500;">Credit packs</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 14px;background:#0c0c0c;border:1px solid #1a1a1a;border-radius:8px 0 0 8px;text-align:center;">
                    <div style="font-size:11px;color:#444;margin-bottom:4px;">Starter</div>
                    <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.04em;">$5</div>
                    <div style="font-size:11px;color:#444;margin-top:2px;">50 searches</div>
                  </td>
                  <td width="4" style="background:#0a0a0a;"></td>
                  <td style="padding:10px 14px;background:#111;border:1px solid #2a2a2a;border-radius:0;text-align:center;">
                    <div style="font-size:11px;color:#555;margin-bottom:4px;">Pro ★</div>
                    <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.04em;">$29</div>
                    <div style="font-size:11px;color:#555;margin-top:2px;">500 searches</div>
                  </td>
                  <td width="4" style="background:#0a0a0a;"></td>
                  <td style="padding:10px 14px;background:#0c0c0c;border:1px solid #1a1a1a;border-radius:0 8px 8px 0;text-align:center;">
                    <div style="font-size:11px;color:#444;margin-bottom:4px;">Scale</div>
                    <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.04em;">$79</div>
                    <div style="font-size:11px;color:#444;margin-top:2px;">2,000 searches</div>
                  </td>
                </tr>
              </table>

              <a href="${WEB_URL}/dashboard" style="display:inline-block;background:#fff;color:#000;font-family:'Inter',sans-serif;font-size:13px;font-weight:500;letter-spacing:-0.01em;padding:12px 22px;border-radius:8px;text-decoration:none;">
                Buy credits →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;border-top:1px solid #141414;">
              <p style="font-size:11px;color:#2a2a2a;margin:0;line-height:1.8;">
                Uncover · Built by TheAlxLabs · <a href="${WEB_URL}/dashboard" style="color:#2a2a2a;">Manage account</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
