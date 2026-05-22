import type { Prisma } from "@prisma/client";

import prisma from "../db.server";
import {
  UNLOCK_OFFERS,
  isReportPackage,
  isUnlockModule,
  type UnlockModule,
} from "../lib/report-packages";

type ShopifyLineItemProperty = {
  name?: string;
  value?: unknown;
};

type ShopifyLineItem = {
  variant_id?: number | string | null;
  sku?: string | null;
  price?: string | number | null;
  properties?: ShopifyLineItemProperty[] | null;
};

type ShopifyOrderPayload = {
  id?: number | string;
  admin_graphql_api_id?: string;
  currency?: string;
  line_items?: ShopifyLineItem[];
};

function getOrderId(payload: ShopifyOrderPayload) {
  return String(payload.admin_graphql_api_id || payload.id || "").trim();
}

function getProperty(lineItem: ShopifyLineItem, name: string) {
  return String(
    lineItem.properties?.find((property) => property.name === name)?.value || "",
  ).trim();
}

function findModuleFromLineItem(lineItem: ShopifyLineItem): UnlockModule | null {
  const explicitModule = getProperty(lineItem, "_undr_unlock").toLowerCase();
  if (isUnlockModule(explicitModule)) return explicitModule;

  const variantId = String(lineItem.variant_id || "").trim();
  const sku = String(lineItem.sku || "").trim();
  const offer = Object.values(UNLOCK_OFFERS).find(
    (item) => item.variantId === variantId || item.sku === sku,
  );

  return offer?.module || null;
}

function getLineItemAmountCents(lineItem: ShopifyLineItem, module: UnlockModule) {
  const price = Number(lineItem.price);
  if (Number.isFinite(price) && price > 0) {
    return Math.round(price * 100);
  }

  return UNLOCK_OFFERS[module].priceCents;
}

function jsonPayload(payload: ShopifyOrderPayload): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue;
}

export async function recordPaidReportUnlocks(input: {
  shop: string;
  payload: ShopifyOrderPayload;
}) {
  const orderId = getOrderId(input.payload);
  if (!orderId) return { unlocked: 0 };

  let unlocked = 0;
  const lineItems = input.payload.line_items || [];

  for (const lineItem of lineItems) {
    const module = findModuleFromLineItem(lineItem);
    if (!module) continue;

    const kitRegistrationNumber = getProperty(lineItem, "_undr_kit");
    const registrationId = getProperty(lineItem, "_undr_registration_id");
    const reportPackageProperty = getProperty(lineItem, "_undr_report_package").toLowerCase();
    if (!kitRegistrationNumber && !registrationId) continue;

    const registration = await prisma.registration.findFirst({
      where: {
        shop: input.shop,
        OR: [
          ...(registrationId ? [{ id: registrationId }] : []),
          ...(kitRegistrationNumber
            ? [{ kitRegistrationNumber: { equals: kitRegistrationNumber, mode: "insensitive" as const } }]
            : []),
        ],
      },
      select: { id: true, reportPackage: true, report: { select: { id: true } } },
    });

    if (!registration) continue;
    const paidReportPackage = isReportPackage(reportPackageProperty)
      ? reportPackageProperty
      : registration.reportPackage;

    await prisma.reportUnlock.upsert({
      where: {
        registrationId_module_reportPackage: {
          registrationId: registration.id,
          module,
          reportPackage: paidReportPackage,
        },
      },
      create: {
        registrationId: registration.id,
        reportId: registration.report?.id ?? null,
        module,
        reportPackage: paidReportPackage,
        amountCents: getLineItemAmountCents(lineItem, module),
        currency: String(input.payload.currency || "USD").toUpperCase(),
        status: "paid",
        source: "shopify_order",
        shopifyOrderId: orderId,
        rawPayload: jsonPayload(input.payload),
      },
      update: {
        reportId: registration.report?.id ?? null,
        amountCents: getLineItemAmountCents(lineItem, module),
        currency: String(input.payload.currency || "USD").toUpperCase(),
        status: "paid",
        source: "shopify_order",
        shopifyOrderId: orderId,
        rawPayload: jsonPayload(input.payload),
      },
    });

    unlocked += 1;
  }

  return { unlocked };
}
