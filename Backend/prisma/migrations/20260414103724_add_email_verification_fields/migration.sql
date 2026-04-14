-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerificationExpiry" TIMESTAMP(3);
