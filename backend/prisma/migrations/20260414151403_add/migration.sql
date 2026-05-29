/*
  Warnings:

  - The primary key for the `token_refresh` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,name,account]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,token_hash]` on the table `token_refresh` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `token_refresh` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription_category" DROP CONSTRAINT "subscription_category_subscription_id_fkey";

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "account" VARCHAR(320) NOT NULL,
ADD COLUMN     "url" VARCHAR(255);

-- AlterTable
ALTER TABLE "token_refresh" DROP CONSTRAINT "token_refresh_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "token_refresh_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_id_name_account_key" ON "subscription"("user_id", "name", "account");

-- CreateIndex
CREATE UNIQUE INDEX "token_refresh_user_id_token_hash_key" ON "token_refresh"("user_id", "token_hash");

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_category" ADD CONSTRAINT "subscription_category_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
