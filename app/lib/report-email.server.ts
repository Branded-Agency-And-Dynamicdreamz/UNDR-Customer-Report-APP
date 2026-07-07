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
  const appUrl = process.env.SHOPIFY_APP_URL?.replace(/\/$/, "") || "";
  const emailImageUrl = `${appUrl}/images/soil-sample-tool.png?v=${Date.now()}`;
  const logoUrl = `${appUrl}/images/undrco.png`;

  if (!apiKey || !senderEmail) {
    console.warn("Brevo is not configured. Skipping customer report email.");
    return { sent: false as const, reason: "missing-config" as const };
  }

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your results are ready</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, Helvetica, sans-serif; color: #333;">
  <!-- Preview text for Gmail - MUST be first visible element -->
  <div style="font-size: 0; color: #f5f5f5; line-height: 0; margin: 0; padding: 0; mso-hide: all; visibility: hidden; width: 0; height: 0; overflow: hidden; max-height: 0; max-width: 0;">
    See what your sample revealed.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  
  <!-- Main wrapper -->
  <table width="100%" bgcolor="#f5f5f5" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email container -->
        <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px;">
          
          <!-- RED HEADER WITH DECORATIVE CIRCLES -->
          <tr>
            <td bgcolor="#a83a3a" style="padding: 20px 40px; text-align: center; position: relative; overflow: visible;" valign="middle">
              <!-- Top right decorative circle -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 8px;">
                <tr>
                  <td style="text-align: right; padding: 0;">
                    <div style="display: inline-block; width: 75px; height: 75px; background-color: rgba(255,255,255,0.28); border-radius: 50%; margin-right: -10px; vertical-align: top;"></div>
                  </td>
                </tr>
              </table>
              
              <!-- Logo -->
              <img src="${logoUrl}" alt="undr" width="180" style="display: inline-block; width: 180px; max-width: 180px; height: auto; margin: 0 0 8px 0; border: none;">
              
              <!-- Bottom right decorative circles -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                  <td style="text-align: right; padding: 0;">
                    <!-- Medium semi-transparent white circle -->
                    <div style="display: inline-block; width: 55px; height: 55px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin-right: 10px; vertical-align: middle;"></div>
                    <!-- Darker red circle (semi-transparent) -->
                    <div style="display: inline-block; width: 40px; height: 40px; background-color: rgba(160,70,70,0.5); border-radius: 50%; vertical-align: middle;"></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CORAL TAGLINE SECTION -->
          <tr>
            <td bgcolor="#d89070" style="padding: 14px 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #ffffff; line-height: 1.4;">UNDERSTAND YOUR LAND</p>
            </td>
          </tr>
          
          <!-- MAIN CONTENT SECTION -->
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 24px;">
              
              <!-- Welcome Heading -->
              <h2 style="margin: 0 0 20px 0; font-size: 32px; font-weight: 700; color: #8b2e2e; text-align: center; line-height: 1.2; letter-spacing: 0;">The wait is over</h2>
              
              <!-- Body Texts -->
              <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.5; color: #888888; text-align: center;">It&apos;s time to see what turned up in your dirt.</p>
              
              <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.5; color: #888888; text-align: center;">Inside, you&apos;ll find a breakdown of everything we detected&mdash;what&apos;s there, how much, and how it compares to other soil&mdash;with context to help it all make sense.</p>
              
              <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.5; color: #888888; text-align: center;">This is your sample&apos;s story. We hope you enjoy reading it as much as we enjoyed putting it together.</p>
              
              <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.5; color: #888888; text-align: center;">Take a closer look and start exploring your results.</p>
              
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.5; color: #888888; text-align: center;">Where is curiosity gonna take you next?</p>
              
              <!-- IMAGE WITH BUTTON (background-image technique - Gmail strips the CSS position property, so the button lives inside the image's own table cell instead of an absolutely-positioned overlay) -->
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" background="${emailImageUrl}" style="width: 100%; max-width: 600px; height: 338px; background-image: url('${emailImageUrl}'); background-size: cover; background-position: center center; background-repeat: no-repeat; border-radius: 22px; border-collapse: collapse; margin: 28px 0;">
                <tr>
                  <td align="center" valign="bottom" height="338" style="height: 338px; padding: 0 0 16px 0;">
                    <a href="${reportUrl}" style="display: inline-block; background-color: rgba(255,255,255,0.95); color: #8b2e2e; padding: 14px 40px; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 16px; line-height: 1.2; border: 1px solid rgba(255,255,255,0.95); box-shadow: 0 4px 16px rgba(0,0,0,0.14);">View Report</a>
                  </td>
                </tr>
              </table>
              
              <!-- Ready, Set, Dig Text (below image) -->
              <h3 style="margin: 28px 0 0 0; font-size: 28px; font-weight: 700; color: #8b2e2e; text-align: center; line-height: 1.2;">Ready, Set, Dig!</h3>
              
              
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
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
      params: {
        PREVIEW_TEXT: "See what your sample revealed.",
      },
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