/*
  Warnings:

  - A unique constraint covering the columns `[user_id,subscription_id]` on the table `notification` will be added. If there are existing duplicate values, this will fail.
  - Made the column `subscription_id` on table `notification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notification" ALTER COLUMN "subscription_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "notification_user_id_subscription_id_key" ON "notification"("user_id", "subscription_id");
