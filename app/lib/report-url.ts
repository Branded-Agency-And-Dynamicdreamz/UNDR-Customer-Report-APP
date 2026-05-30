export function encodeReportProxyId(kitRegistrationNumber: string) {
  const value = kitRegistrationNumber.trim();
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(value, "utf8").toString("base64")
      : btoa(String.fromCharCode(...new TextEncoder().encode(value)));

  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function decodeReportProxyId(proxyId: string) {
  const trimmedProxyId = proxyId.trim();
  if (!trimmedProxyId) return "";

  try {
    const base64 = trimmedProxyId
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(trimmedProxyId.length / 4) * 4, "=");
    const decoded =
      typeof Buffer !== "undefined"
        ? Buffer.from(base64, "base64").toString("utf8").trim()
        : new TextDecoder()
            .decode(Uint8Array.from(atob(base64), (character) => character.charCodeAt(0)))
            .trim();

    return decoded || trimmedProxyId;
  } catch {
    return trimmedProxyId;
  }
}

export function buildReportPath(kitRegistrationNumber: string) {
  return `/apps/undr/report/${encodeURIComponent(encodeReportProxyId(kitRegistrationNumber))}`;
}
