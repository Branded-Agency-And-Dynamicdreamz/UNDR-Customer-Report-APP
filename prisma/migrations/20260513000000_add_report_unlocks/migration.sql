-- CreateTable
CREATE TABLE "ReportUnlock" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'shopify_order',
    "shopifyOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnlockPurchase" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'paid',
    "shopifyOrderId" TEXT NOT NULL,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnlockPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportUnlock_registrationId_module_key" ON "ReportUnlock"("registrationId", "module");

-- CreateIndex
CREATE INDEX "ReportUnlock_shopifyOrderId_idx" ON "ReportUnlock"("shopifyOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "UnlockPurchase_shopifyOrderId_module_key" ON "UnlockPurchase"("shopifyOrderId", "module");

-- CreateIndex
CREATE INDEX "UnlockPurchase_registrationId_idx" ON "UnlockPurchase"("registrationId");

-- AddForeignKey
ALTER TABLE "ReportUnlock" ADD CONSTRAINT "ReportUnlock_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockPurchase" ADD CONSTRAINT "UnlockPurchase_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
