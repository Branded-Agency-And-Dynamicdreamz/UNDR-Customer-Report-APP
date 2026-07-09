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
  const headerBgUrl = `${appUrl}/images/header-bg.png`;

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
  <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; color: #333;font-family: Arial, sans-serif;">
  <!-- Preview text for Gmail - MUST be first visible element -->
  <div style="font-size: 0; color: #f5f5f5; line-height: 0; margin: 0; padding: 0; mso-hide: all; visibility: hidden; width: 0; height: 0; overflow: hidden; max-height: 0; max-width: 0;">
    See what your sample revealed.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Main wrapper -->
  <table width="100%" bgcolor="#f5f5f5" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <!-- Email container -->
        <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-collapse: collapse; max-width: 600px;">

          <!-- RED HEADER WITH DECORATIVE CIRCLES (brand red #942320, smaller/tighter, curved bottom-left edge) -->
          <tr>
            <td style="background:url('${headerBgUrl}') no-repeat center;background-size: cover;background-position: right; padding: 56px 0 13px 0; text-align: center; position: relative; overflow: visible; border-bottom-left-radius: 28px;" valign="middle">
             
              <!-- Logo (bigger) -->
              <img src="${logoUrl}" alt="undr" width="220" style="display: inline-block; width: 220px; max-width: 220px; height: auto; margin: 0 0 6px 0; border: none;">
             
            </td>
          </tr>

          <!-- CORAL TAGLINE SECTION (brand coral #D8816C, bigger/bolder) -->
          <tr>
            <td bgcolor="#D8816C" style="padding: 10px 24px; text-align: center;border-top-left-radius: 28px;">
              <p style="margin: 0; font-size: 20px; font-weight: 500; letter-spacing: 3px; color: #ffffff; text-transform: uppercase; line-height: 1.3;font-family: 'Arial', sans-serif;">UNDERSTAND YOUR LAND</p>
            </td>
          </tr>

          <!-- MAIN CONTENT SECTION -->
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 24px 0 24px;">

              <!-- Welcome Heading (bigger, bolder, brand red) -->
              <h2 style="margin: 0 0 20px 0; font-size: 40px; font-weight: 900; color: #942320; text-align: center; line-height: 1.15; letter-spacing: 0;font-family: 'Arial', sans-serif; text-transform: uppercase;">The wait is over</h2>

              <div style="margin: 0 auto; max-width: 530px; text-align: center;">
                <!-- Body Texts (tighter line-height per feedback) -->
                <p style="margin: 0 0 6px 0; font-size: 15px; line-height: normal; color: #888888; text-align: center;">It&apos;s time to see what turned up in your dirt.</p>

                <p style="margin: 0 0 6px 0; font-size: 15px; line-height: normal; color: #888888; text-align: center;">Inside, you&apos;ll find a breakdown of everything we detected&mdash;what&apos;s there, how much, and how it compares to other soil&mdash;with context to help it all make sense.</p>

                <p style="margin: 0 0 6px 0; font-size: 15px; line-height: normal; color: #888888; text-align: center;">This is your sample&apos;s story. We hope you enjoy reading it as much as we enjoyed putting it together.</p>

                <p style="margin: 0 0 6px 0; font-size: 15px; line-height: normal; color: #888888; text-align: center;">Take a closer look and start exploring your results.</p>

                <p style="margin: 0 0 28px 0; font-size: 15px; line-height: normal; color: #888888; text-align: center;">Where is curiosity gonna take you next?</p>
              </div>
            </td>
          </tr>

          <!-- IMAGE ROW - full bleed, edge-to-edge, no padding, no rounded corners -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation"
       width="100%"
       cellpadding="0"
       cellspacing="0"
       background="${emailImageUrl}"
       style="
          background-image:url('${emailImageUrl}');
          background-size:cover;
          background-position:center;
          height:320px;">
<tr>
<td align="center" valign="bottom" style="padding-bottom:30px;">

<a href="${reportUrl}"
style="
background:#fff;
color:#942320;
padding:14px 36px;
border-radius:30px;
display:inline-block;
text-decoration:none;
font-weight:bold;">
View Report
</a>

</td>
</tr>
</table>
            </td>
          </tr>

          <!-- READY SET DIG SECTION -->
          <tr>
            <td bgcolor="#ffffff" style="padding: 28px 24px 40px 24px;">
              <h3 style="margin: 0; font-size: 34px; font-weight: 800; color: #D8816C; text-align: center; line-height: 1.2;">Ready, Set, Dig!</h3>
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