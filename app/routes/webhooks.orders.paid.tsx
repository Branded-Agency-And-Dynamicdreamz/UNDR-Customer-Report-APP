import type { ActionFunctionArgs } from "react-router";

import { recordPaidReportUnlocks } from "../models/report-unlock.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, payload } = await authenticate.webhook(request);

  try {
    const result = await recordPaidReportUnlocks({
      shop,
      payload: payload as Parameters<typeof recordPaidReportUnlocks>[0]["payload"],
    });

    console.log("[webhooks/orders/paid] processed", {
      shop,
      unlocked: result.unlocked,
    });
  } catch (error) {
    console.error("[webhooks/orders/paid] failed", {
      shop,
      error,
    });
    throw error;
  }

  return new Response();
};
