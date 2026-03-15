-- CreateEnum
CREATE TYPE "TransactionScope" AS ENUM ('BALANCE', 'GOAL');

-- AlterTable
ALTER TABLE "Transaction"
ADD COLUMN "goalId" TEXT,
ADD COLUMN "scope" "TransactionScope" NOT NULL DEFAULT 'BALANCE';

-- CreateIndex
CREATE INDEX "Transaction_goalId_idx" ON "Transaction"("goalId");

-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_goalId_fkey"
FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
