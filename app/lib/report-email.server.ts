import dotenv from "dotenv";

dotenv.config();

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

type SendEmailResult =
  | { sent: true }
  | { sent: false; reason: "missing-config" | "provider-error" | "network-error"; error?: string };

export async function sendCustomerReportReadyEmail({
  toEmail,
  customerName,
  reportUrl,
  previewUrl,
}: {
  toEmail: string;
  customerName?: string | null;
  reportUrl: string;
  previewUrl: string;
}): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "UNDR";

  if (!apiKey || !senderEmail) {
    console.warn("Brevo is not configured. Skipping customer report email.");
    return { sent: false as const, reason: "missing-config" as const };
  }

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      font-family: Arial, Helvetica, sans-serif;
      color: #111111;
    }
    .wrapper {
      width: 100%;
      background-color: #f5f5f5;
      padding: 24px 12px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #111111;
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .content {
      padding: 28px 24px 32px;
    }
    .preview {
      font-size: 14px;
      color: #666666;
      margin-bottom: 16px;
      text-align: center;
    }
    .body-text {
      font-size: 16px;
      line-height: 1.8;
      margin: 0 0 16px;
      color: #222222;
    }
    .cta-button {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      padding: 13px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 700;
      margin: 20px 0 8px;
      border: 1px solid #000000;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>The wait is over</h1>
      </div>
      <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${previewUrl}</div>
      <div class="content">
        <div class="preview">See what your sample may revealed.</div>
        <p class="body-text">It's time to see what turned up in your dirt.</p>
        <p class="body-text">Inside, you'll find a breakdown of everything we detected—what's there, how much, and how it compares to other soil—with context to help it all make sense.</p>
        <p class="body-text">This is your sample's story. We hope you enjoy reading it as much as we enjoyed putting it together.</p>
        <p class="body-text">Take a closer look and start exploring your results.</p>
        <p class="body-text">Where is curiosity gonna take you next?</p>
        <div style="text-align: center;">
          <a href="${reportUrl}" class="cta-button">View Report</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      to: [{ email: toEmail, name: customerName?.trim() || "Customer" }],
      sender: { email: senderEmail, name: senderName },
      subject: "Your results are ready",
      htmlContent: htmlBody,
      textContent: `Your report is ready. Open it here: ${reportUrl}`,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error("[Brevo] Email send failed", {
      status: response.status,
      responseText,
      toEmail,
      senderEmail,
    });
    return {
      sent: false as const,
      reason: "provider-error" as const,
      error: responseText || response.statusText,
    };
  }

  return { sent: true as const };
}
