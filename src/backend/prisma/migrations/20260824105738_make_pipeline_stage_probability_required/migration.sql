/*
  Warnings:

  - Made the column `probability` on table `pipeline_stages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "pipeline_stages" ALTER COLUMN "probability" SET NOT NULL;
