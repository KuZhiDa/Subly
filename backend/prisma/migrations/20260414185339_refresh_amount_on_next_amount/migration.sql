/*
  Warnings:

  - You are about to drop the column `amount` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `next_amount` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "amount",
ADD COLUMN     "next_amount" DECIMAL(10,2) NOT NULL;
