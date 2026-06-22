import type { ActionFunctionArgs } from "react-router";

import { authenticate } from "../shopify.server";
import { upsertKitForLineItem } from "../models/registration.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload } = await authenticate.webhook(request);

  try {
    const order = payload as any;
    const orderId = String(order.id || order.admin_graphql_api_id || "");
    const orderNumber = String(order.name || order.order_number || "");

    const customer = order.customer || {};
    const shopifyCustomerId = customer.id ? String(customer.id) : undefined;
    const customerName = [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim();
    const customerEmail = customer.email || undefined;

    const lineItems = Array.isArray(order.line_items) ? order.line_items : [];
    for (const li of lineItems) {
      try {
        const res = await upsertKitForLineItem({
          shop,
          orderId: orderId,
          orderNumber: orderNumber,
          lineItemId: String(li.id || li.variant_id || li.inventory_item_id || ""),
          lineItemTitle: li.title || li.name || "",
          registrationNumber: `${orderNumber}-${String(li.id || '')}`,
          shopifyCustomerId,
          customerName: customerName || undefined,
          customerEmail: customerEmail || undefined,
        });
        console.log('[webhooks/orders/created] upsert result', { shop, orderId, lineItemId: String(li.id || li.variant_id || li.inventory_item_id || ""), resId: res?.id, kit: res?.kitRegistrationNumber });
      } catch (err) {
        console.error("[webhooks/orders/created] upsertKitForLineItem failed", { shop, err, lineItem: li });
      }
    }

    console.log("[webhooks/orders/created] processed", { shop, orderId, created: lineItems.length });
  } catch (error) {
    console.error("[webhooks/orders/created] failed", { shop, error });
    throw error;
  }

  return new Response();
};
