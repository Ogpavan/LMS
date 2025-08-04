/*
  Warnings:

  - Added the required column `gender` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
