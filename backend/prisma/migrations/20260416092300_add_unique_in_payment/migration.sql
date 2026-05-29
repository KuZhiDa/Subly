/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id,payment_date]` on the table `payment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payment_subscription_id_payment_date_key" ON "payment"("subscription_id", "payment_date");
