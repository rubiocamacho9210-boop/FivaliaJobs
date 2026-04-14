-- AlterTable
ALTER TABLE "User" ADD COLUMN "birthDate" TIMESTAMP(3);
UPDATE "User" SET "birthDate" = NOW() - INTERVAL '25 years' WHERE "birthDate" IS NULL;
ALTER TABLE "User" ALTER COLUMN "birthDate" SET NOT NULL;
