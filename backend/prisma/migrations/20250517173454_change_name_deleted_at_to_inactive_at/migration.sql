/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `managers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cars" DROP COLUMN "deleted_at",
ADD COLUMN     "inactive_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "deleted_at",
ADD COLUMN     "inactive_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "managers" DROP COLUMN "deleted_at",
ADD COLUMN     "inactive_at" TIMESTAMP(3);
