/*
  Warnings:

  - You are about to drop the column `AgentId` on the `CredentialRequest` table. All the data in the column will be lost.
  - Added the required column `agentId` to the `CredentialRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CredentialRequest" DROP CONSTRAINT "CredentialRequest_AgentId_fkey";

-- AlterTable
ALTER TABLE "CredentialRequest" DROP COLUMN "AgentId",
ADD COLUMN     "agentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CredentialRequest" ADD CONSTRAINT "CredentialRequest_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
