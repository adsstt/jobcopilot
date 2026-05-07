-- CreateTable
CREATE TABLE "UserModelConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "baseUrl" TEXT,
    "apiKeyEncrypted" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserModelConfig_userId_isDefault_idx" ON "UserModelConfig"("userId", "isDefault");

-- CreateIndex
CREATE INDEX "UserModelConfig_userId_updatedAt_idx" ON "UserModelConfig"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "UserModelConfig" ADD CONSTRAINT "UserModelConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
