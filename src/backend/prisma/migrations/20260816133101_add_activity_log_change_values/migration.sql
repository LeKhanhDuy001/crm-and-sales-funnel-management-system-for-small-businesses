-- AlterTable
ALTER TABLE "activity_logs" ADD COLUMN     "new_value" JSONB,
ADD COLUMN     "old_value" JSONB;
