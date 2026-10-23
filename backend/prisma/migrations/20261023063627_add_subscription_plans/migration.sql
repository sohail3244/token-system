-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `planId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Plan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `billingInterval` ENUM('MONTHLY', 'YEARLY') NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'INR',
    `maxUsers` INTEGER NOT NULL DEFAULT 5,
    `maxBranches` INTEGER NOT NULL DEFAULT 1,
    `maxCounters` INTEGER NOT NULL DEFAULT 2,
    `maxTokensPerDay` INTEGER NOT NULL DEFAULT 100,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Plan_name_key`(`name`),
    INDEX `Plan_isActive_billingInterval_idx`(`isActive`, `billingInterval`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Subscription_planId_idx` ON `Subscription`(`planId`);

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
