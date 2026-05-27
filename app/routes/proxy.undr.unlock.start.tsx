import { redirect, type LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { authenticate } from "../shopify.server";
import { getUnlockOffer, isReportPackage, isUnlockModule } from "../lib/report-packages";

function encodeCartProperties(properties: Record<string, string>) {
  return Buffer.from(JSON.stringify(properties))
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function buildCartUrl(input: {
  shop: string;
  variantId: string;
  kitRegistrationNumber: string;
  registrationId: string;
  module: string;
  reportPackage: string;
}) {
  const url = new URL(`/cart/${input.variantId}:1`, `https://${input.shop}`);
  url.searchParams.set(
    "properties",
    encodeCartProperties({
      _undr_kit: input.kitRegistrationNumber,
      _undr_registration_id: input.registrationId,
      _undr_unlock: input.module,
      _undr_report_package: input.reportPackage,
    }),
  );
  return url.toString();
}

function renderUnlockError(message: string) {
  return `
<section style="padding:40px 20px;max-width:760px;margin:0 auto;">
  <h1 style="margin:0 0 12px;font-size:30px;line-height:1.2;color:#111827;">Unlock unavailable</h1>
  <p style="margin:0;font-size:16px;line-height:1.6;color:#4b5563;">${message}</p>
</section>
`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { liquid, session } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const kitRegistrationNumber = String(url.searchParams.get("kit") || "").trim();
  const module = String(url.searchParams.get("module") || "").trim().toLowerCase();
  const requestedReportPackage = String(url.searchParams.get("package") || "").trim().toLowerCase();
  const requestingShop = (session?.shop || url.searchParams.get("shop") || "").trim().toLowerCase();

  if (!kitRegistrationNumber || !isUnlockModule(module)) {
    return liquid(renderUnlockError("Please open this unlock link from your report."), { layout: true });
  }

  const registration = await getRegistrationByKitNumber(kitRegistrationNumber);
  const registrationShop = String(registration?.shop || "").trim().toLowerCase();

  if (!registration || !requestingShop || requestingShop !== registrationShop) {
    return liquid(renderUnlockError("We could not match this report to the current store."), { layout: true });
  }

  const offer = getUnlockOffer(module, requestingShop);
  const reportPackage = isReportPackage(requestedReportPackage)
    ? requestedReportPackage
    : registration.reportPackage;

  return redirect(
    buildCartUrl({
      shop: requestingShop,
      variantId: offer.variantId,
      kitRegistrationNumber,
      registrationId: registration.id,
      module,
      reportPackage,
    }),
  );
};
