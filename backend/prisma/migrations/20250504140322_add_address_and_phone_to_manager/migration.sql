/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `managers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `managers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zipCode` to the `managers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "managers" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ADD COLUMN     "zipCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "managers_phone_key" ON "managers"("phone");
