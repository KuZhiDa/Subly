/*
  Warnings:

  - You are about to drop the column `ahead_payment_at` on the `subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscription_ahead_payment_at_idx";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "ahead_payment_at",
ADD COLUMN     "next_payment_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "subscription_next_payment_at_idx" ON "subscription"("next_payment_at");
