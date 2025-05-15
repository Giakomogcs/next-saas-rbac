/*
  Warnings:

  - You are about to drop the column `ROLE` on the `invites` table. All the data in the column will be lost.
  - Added the required column `role` to the `invites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invites" DROP COLUMN "ROLE",
ADD COLUMN     "role" "Role" NOT NULL;
