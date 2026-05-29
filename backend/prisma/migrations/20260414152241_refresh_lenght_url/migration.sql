/*
  Warnings:

  - Made the column `url` on table `subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "subscription" ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "url" SET DATA TYPE VARCHAR(2048);
