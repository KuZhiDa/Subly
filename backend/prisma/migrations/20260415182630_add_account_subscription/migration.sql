/*
  Warnings:

  - The values [TRIAL] on the enum `StatusSubscription` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `account` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,name,account_id]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Login" AS ENUM ('EMAIL', 'PHONE_NUMBER', 'SET_SYMBOL');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusSubscription_new" AS ENUM ('PAID', 'NOT_PAID', 'SUSPENDED', 'DELETED');
ALTER TABLE "public"."subscription" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "subscription" ALTER COLUMN "status" TYPE "StatusSubscription_new" USING ("status"::text::"StatusSubscription_new");
ALTER TYPE "StatusSubscription" RENAME TO "StatusSubscription_old";
ALTER TYPE "StatusSubscription_new" RENAME TO "StatusSubscription";
DROP TYPE "public"."StatusSubscription_old";
ALTER TABLE "subscription" ALTER COLUMN "status" SET DEFAULT 'PAID';
COMMIT;

-- DropIndex
DROP INDEX "subscription_user_id_name_account_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "account",
ADD COLUMN     "account_id" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PAID',
ALTER COLUMN "period" DROP DEFAULT,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "subscription_account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type_login" "Login" NOT NULL,
    "login" VARCHAR(320) NOT NULL,

    CONSTRAINT "subscription_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_account_user_id_login_key" ON "subscription_account"("user_id", "login");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_user_id_name_account_id_key" ON "subscription"("user_id", "name", "account_id");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "subscription_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_account" ADD CONSTRAINT "subscription_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
