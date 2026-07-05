-- CreateTable
CREATE TABLE "CrmNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pensumId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CrmNote_pensumId_fkey" FOREIGN KEY ("pensumId") REFERENCES "Pensum" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CrmNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pensum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "street" TEXT,
    "plz" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "lessonsPerWeek" INTEGER NOT NULL DEFAULT 1,
    "preferredTimes" TEXT,
    "rateCustomer" INTEGER NOT NULL,
    "rateTutor" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "source" TEXT NOT NULL DEFAULT 'web',
    "pipeline" TEXT NOT NULL DEFAULT 'NEW',
    "followUpAt" DATETIME,
    "moduleCode" TEXT,
    "profession" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pensum" ("city", "createdAt", "customerEmail", "customerName", "customerPhone", "description", "id", "lat", "lessonsPerWeek", "level", "lng", "plz", "preferredTimes", "rateCustomer", "rateTutor", "source", "status", "street", "subject", "updatedAt") SELECT "city", "createdAt", "customerEmail", "customerName", "customerPhone", "description", "id", "lat", "lessonsPerWeek", "level", "lng", "plz", "preferredTimes", "rateCustomer", "rateTutor", "source", "status", "street", "subject", "updatedAt" FROM "Pensum";
DROP TABLE "Pensum";
ALTER TABLE "new_Pensum" RENAME TO "Pensum";
CREATE INDEX "Pensum_pipeline_idx" ON "Pensum"("pipeline");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CrmNote_pensumId_idx" ON "CrmNote"("pensumId");
