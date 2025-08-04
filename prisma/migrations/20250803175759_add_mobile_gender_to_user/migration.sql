-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "mobileVerified" BOOLEAN NOT NULL DEFAULT false;
