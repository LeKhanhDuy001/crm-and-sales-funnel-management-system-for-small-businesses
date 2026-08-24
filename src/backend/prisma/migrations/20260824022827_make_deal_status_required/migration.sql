/*
  Warnings:

  - Made the column `status` on table `deals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "deals" ALTER COLUMN "status" SET NOT NULL;
