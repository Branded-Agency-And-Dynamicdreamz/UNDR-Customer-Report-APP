-- DropIndex
DROP INDEX IF EXISTS "ReportUnlock_registrationId_module_key";

-- AlterTable
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "reportPackage" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "UnlockPurchase" ADD COLUMN IF NOT EXISTS "reportPackage" TEXT NOT NULL DEFAULT '';

-- Backfill existing unlock rows from their registration package.
UPDATE "ReportUnlock"
SET "reportPackage" = "Registration"."reportPackage"
FROM "Registration"
WHERE "ReportUnlock"."registrationId" = "Registration"."id"
  AND "ReportUnlock"."reportPackage" = '';

UPDATE "UnlockPurchase"
SET "reportPackage" = "Registration"."reportPackage"
FROM "Registration"
WHERE "UnlockPurchase"."registrationId" = "Registration"."id"
  AND "UnlockPurchase"."reportPackage" = '';

-- CreateIndex
CREATE UNIQUE INDEX "ReportUnlock_registrationId_module_reportPackage_key" ON "ReportUnlock"("registrationId", "module", "reportPackage");
