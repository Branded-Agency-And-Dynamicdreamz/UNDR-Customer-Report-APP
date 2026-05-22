-- Add nullable report id so unlock rows can be tied to the concrete report when it exists.
ALTER TABLE "ReportUnlock" ADD COLUMN IF NOT EXISTS "reportId" TEXT;

UPDATE "ReportUnlock"
SET "reportId" = "Report"."id"
FROM "Report"
WHERE "ReportUnlock"."registrationId" = "Report"."registrationId"
  AND "ReportUnlock"."reportId" IS NULL;

CREATE INDEX IF NOT EXISTS "ReportUnlock_reportId_idx" ON "ReportUnlock"("reportId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ReportUnlock_reportId_fkey'
  ) THEN
    ALTER TABLE "ReportUnlock"
      ADD CONSTRAINT "ReportUnlock_reportId_fkey"
      FOREIGN KEY ("reportId") REFERENCES "Report"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
