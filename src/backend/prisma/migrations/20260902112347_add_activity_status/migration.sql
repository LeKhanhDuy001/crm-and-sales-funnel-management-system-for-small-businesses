-- CreateEnum
CREATE TYPE "activity_status" AS ENUM ('Pending', 'Completed', 'Cancelled');

-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "status" "activity_status" NOT NULL DEFAULT 'Pending';
