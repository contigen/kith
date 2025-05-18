/*
  Warnings:

  - You are about to drop the column `requesterId` on the `CredentialRequest` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AgentId` to the `CredentialRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CredentialRequest_requesterId_idx";

-- DropIndex
DROP INDEX "CredentialRequest_status_idx";

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CredentialRequest" DROP COLUMN "requesterId",
ADD COLUMN     "AgentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRequest" ADD CONSTRAINT "CredentialRequest_AgentId_fkey" FOREIGN KEY ("AgentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
