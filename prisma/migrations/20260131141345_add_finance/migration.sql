-- CreateTable
CREATE TABLE "ExpenseRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestNumber" TEXT NOT NULL,
    "staffName" TEXT NOT NULL,
    "staffEmail" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "attachments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending HOD',
    "hodApproval" TEXT DEFAULT 'Pending',
    "hodApprovedBy" TEXT,
    "hodApprovedAt" DATETIME,
    "hodComments" TEXT,
    "financeApproval" TEXT DEFAULT 'Pending',
    "financeApprovedBy" TEXT,
    "financeApprovedAt" DATETIME,
    "financeComments" TEXT,
    "coeApproval" TEXT DEFAULT 'Pending',
    "coeApprovedBy" TEXT,
    "coeApprovedAt" DATETIME,
    "coeComments" TEXT,
    "finalStatus" TEXT NOT NULL DEFAULT 'Pending',
    "disbursedDate" DATETIME,
    "disbursedAmount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseRequest_requestNumber_key" ON "ExpenseRequest"("requestNumber");
