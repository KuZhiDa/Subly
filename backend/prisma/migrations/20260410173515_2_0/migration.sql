/*
  Warnings:

  - The primary key for the `token_refresh` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `token_refresh` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "token_refresh" DROP CONSTRAINT "token_refresh_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "token_refresh_pkey" PRIMARY KEY ("user_id", "token_hash");
