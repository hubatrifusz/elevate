CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;

-- Create tables
CREATE TABLE IF NOT EXISTS `AchievementProgressModel` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `AchievementId` char(36) NOT NULL,
    `Progress` int NOT NULL,
    `Target` int NOT NULL,
    `IsCompleted` tinyint(1) NOT NULL,
    `CompletedAt` datetime(6) NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `Achievements` (
    `Id` char(36) NOT NULL,
    `Title` longtext NOT NULL,
    `Description` longtext NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `Habit` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `Title` longtext NOT NULL,
    `Description` longtext NULL,
    `FrequencyType` int NOT NULL,
    `CustomFrequency` int NULL,
    `Color` longtext NOT NULL,
    `IsPositive` tinyint(1) NOT NULL,
    `Streak` int NOT NULL,
    `StreakStart` datetime(6) NOT NULL,
    `Deleted` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `HabitLogModel` (
    `Id` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `HabitId` char(36) NOT NULL,
    `DueDate` datetime(6) NOT NULL,
    `Completed` tinyint(1) NOT NULL,
    `CompletedAt` datetime(6) NULL,
    `Notes` longtext NULL,
    `IsPublic` tinyint(1) NOT NULL,
    PRIMARY KEY (`Id`)
);

CREATE TABLE IF NOT EXISTS `Users` (
    `Id` char(36) NOT NULL,
    `CreatedAt` datetime(6) NULL,
    `FirstName` longtext NOT NULL,
    `LastName` longtext NOT NULL,
    `Email` varchar(255) NOT NULL,
    `PasswordHash` longtext NOT NULL,
    `ProfilePicture` longblob NULL,
    `LongestStreak` int NULL,
    PRIMARY KEY (`Id`)
);

-- Create indexes using ALTER TABLE
ALTER TABLE `AchievementProgressModel`
ADD INDEX `IX_AchievementProgressModel_UserId` (`UserId`);

ALTER TABLE `HabitLogModel`
ADD INDEX `IX_HabitLogModel_DueDate` (`DueDate`);

ALTER TABLE `HabitLogModel`
ADD INDEX `IX_HabitLogModel_UserId_HabitId` (`UserId`, `HabitId`);

ALTER TABLE `Users`
ADD UNIQUE INDEX `IX_Users_Email` (`Email`);

-- Insert migration history entry if it doesn't exist
INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
SELECT '20250206184944_init', '8.0.0' FROM DUAL
WHERE NOT EXISTS (
    SELECT 1 FROM `__EFMigrationsHistory` WHERE `MigrationId` = '20250206184944_init'
);

COMMIT;
