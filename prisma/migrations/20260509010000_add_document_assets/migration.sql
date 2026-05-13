CREATE TABLE "DocumentAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "parsedText" TEXT NOT NULL DEFAULT '',
    "parseStatus" TEXT NOT NULL DEFAULT 'parsed',
    "parseError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentAsset_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DocumentAsset_userId_kind_updatedAt_idx" ON "DocumentAsset"("userId", "kind", "updatedAt");
CREATE INDEX "DocumentAsset_userId_updatedAt_idx" ON "DocumentAsset"("userId", "updatedAt");

ALTER TABLE "DocumentAsset" ADD CONSTRAINT "DocumentAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
