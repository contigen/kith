/*
  Warnings:

  - You are about to drop the column `credentialId` on the `CredentialRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[credentialRequestId]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `credentialRequestId` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CredentialRequest" DROP CONSTRAINT "CredentialRequest_credentialId_fkey";

-- DropIndex
DROP INDEX "Credential_agentId_idx";

-- DropIndex
DROP INDEX "Credential_status_idx";

-- DropIndex
DROP INDEX "Credential_type_idx";

-- AlterTable
ALTER TABLE "Credential" ADD COLUMN     "credentialRequestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CredentialRequest" DROP COLUMN "credentialId";

-- CreateIndex
CREATE UNIQUE INDEX "Credential_credentialRequestId_key" ON "Credential"("credentialRequestId");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_credentialRequestId_fkey" FOREIGN KEY ("credentialRequestId") REFERENCES "CredentialRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
