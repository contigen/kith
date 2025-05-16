/*
  Warnings:

  - You are about to drop the column `featured` on the `Agent` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `issuedDate` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `issuerId` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `issuerId` on the `CredentialRequest` table. All the data in the column will be lost.
  - You are about to drop the `Issuer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "CredentialStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "AuditReport" DROP CONSTRAINT "AuditReport_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_issuerId_fkey";

-- DropIndex
DROP INDEX "Credential_issuerId_idx";

-- DropIndex
DROP INDEX "CredentialRequest_issuerId_idx";

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "featured";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "expiryDate",
DROP COLUMN "issuedDate",
DROP COLUMN "issuerId";

-- AlterTable
ALTER TABLE "CredentialRequest" DROP COLUMN "issuerId",
ADD COLUMN     "type" TEXT;

-- DropTable
DROP TABLE "Issuer";

-- DropTable
DROP TABLE "User";
