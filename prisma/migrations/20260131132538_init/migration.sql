-- CreateTable
CREATE TABLE "Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "stateOfOrigin" TEXT NOT NULL,
    "hasPassport" BOOLEAN NOT NULL DEFAULT false,
    "hasCredentials" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Full-Time',
    "salary" TEXT NOT NULL,
    "pfa" TEXT,
    "rsa" TEXT,
    "hmo" TEXT,
    "bloodGroup" TEXT,
    "medicalCond" TEXT,
    "proofOfLife" TEXT,
    "uniqueTrait" TEXT,
    "bank" TEXT,
    "accountNo" TEXT,
    "bvn" TEXT,
    "nokName" TEXT,
    "nokPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
