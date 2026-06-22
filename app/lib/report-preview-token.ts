import crypto from "node:crypto";

// Signed token that lets the store owner (admin) open the public report link
// even when the public report link is disabled. The token is an HMAC over the
// encoded proxy id using the app secret, so it can only be generated server-side
// inside the embedded admin app — customers/anonymous visitors cannot forge it.

function getSecret() {
  return process.env.SHOPIFY_API_SECRET || "";
}

export function generateReportPreviewToken(proxyId: string): string {
  return crypto.createHmac("sha256", getSecret()).update(proxyId).digest("hex");
}

export function verifyReportPreviewToken(
  proxyId: string,
  token: string | null | undefined,
): boolean {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const expected = generateReportPreviewToken(proxyId);
  const expectedBuf = Buffer.from(expected);
  const tokenBuf = Buffer.from(token);

  if (expectedBuf.length !== tokenBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, tokenBuf);
}
