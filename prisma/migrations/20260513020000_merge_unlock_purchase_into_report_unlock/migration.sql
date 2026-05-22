-- Merge payment details into the single ReportUnlock table.
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "amountCents" INTEGER;
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'paid';
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "rawPayload" JSONB;

UPDATE "ReportUnlock"
SET
  "amountCents" = "UnlockPurchase"."amountCents",
  "currency" = "UnlockPurchase"."currency",
  "status" = "UnlockPurchase"."status",
  "rawPayload" = "UnlockPurchase"."rawPayload"
FROM "UnlockPurchase"
WHERE "ReportUnlock"."registrationId" = "UnlockPurchase"."registrationId"
  AND "ReportUnlock"."module" = "UnlockPurchase"."module"
  AND "ReportUnlock"."reportPackage" = "UnlockPurchase"."reportPackage";

DROP TABLE IF EXISTS "UnlockPurchase";
