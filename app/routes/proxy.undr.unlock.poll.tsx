import { type LoaderFunctionArgs } from "react-router";

import { getRegistrationByKitNumber } from "../models/registration.server";
import { authenticate } from "../shopify.server";
import { isUnlockModule } from "../lib/report-packages";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);
  const url = new URL(request.url);
  const kitRegistrationNumber = String(url.searchParams.get("kit") || "").trim();
  const module = String(url.searchParams.get("module") || "").trim().toLowerCase();

  if (!kitRegistrationNumber || !isUnlockModule(module)) {
    return new Response(JSON.stringify({ unlocked: false }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const registration = await getRegistrationByKitNumber(kitRegistrationNumber);
  if (!registration) {
    return new Response(JSON.stringify({ unlocked: false }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const registrationUnlocks =
    "unlocks" in registration && Array.isArray(registration.unlocks) ? registration.unlocks : [];

  const unlocked = registrationUnlocks.some((u) => String(u.module || "").trim().toLowerCase() === module);

  return new Response(JSON.stringify({ unlocked }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export default function Poll() {
  return null;
}
