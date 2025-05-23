USE elevate;

-- Sample Users (ASP.NET Identity format)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, FirstName, LastName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, CreatedAt, LongestStreak)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'JOHN.DOE@EXAMPLE.COM', 'John', 'Doe', 'john.doe@example.com', 'JOHN.DOE@EXAMPLE.COM', 1, 'AQAAAAEAACcQAAAAEDummyHashedPasswordForJohn123456789', 'SECURITY123', 'CONCURRENCY123', NULL, 0, 0, NULL, 1, 0, '2025-01-01 10:00:00', 15),
    ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'JANE.SMITH@EXAMPLE.COM', 'Jane', 'Smith', 'jane.smith@example.com', 'JANE.SMITH@EXAMPLE.COM', 1, 'AQAAAAEAACcQAAAAEDummyHashedPasswordForJane123456789', 'SECURITY456', 'CONCURRENCY456', NULL, 0, 0, NULL, 1, 0, '2025-01-02 11:00:00', 22),
    ('33333333-3333-3333-3333-333333333333', 'mike.wilson@example.com', 'MIKE.WILSON@EXAMPLE.COM', 'Mike', 'Wilson', 'mike.wilson@example.com', 'MIKE.WILSON@EXAMPLE.COM', 1, 'AQAAAAEAACcQAAAAEDummyHashedPasswordForMike123456789', 'SECURITY789', 'CONCURRENCY789', NULL, 0, 0, NULL, 1, 0, '2025-01-03 12:00:00', 8)
ON DUPLICATE KEY UPDATE UserName = VALUES(UserName);

-- Sample Habits
INSERT INTO Habits (Id, UserId, Title, Description, FrequencyType, CustomFrequency, StreakStart, StreakProgression, CreatedAt, Color, Streak, ChallengedFriends, Deleted)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Morning Workout', 'Daily 30-minute exercise routine', 0, NULL, '2025-01-01 06:00:00', '15/15', '2025-01-01 06:00:00', '#FF5722', 15, '["22222222-2222-2222-2222-222222222222"]', 0),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Read for 30 mins', 'Daily reading habit for personal growth', 0, NULL, '2025-01-02 19:00:00', '22/22', '2025-01-02 19:00:00', '#2196F3', 22, '[]', 0),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Weekly Meal Prep', 'Prepare meals for the week every Sunday', 1, NULL, '2025-01-05 15:00:00', '3/3', '2025-01-05 15:00:00', '#4CAF50', 3, '[]', 0),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Custom Meditation', 'Meditation on Mon, Wed, Fri', 3, 42, '2025-01-06 07:00:00', '8/8', '2025-01-06 07:00:00', '#9C27B0', 8, '["33333333-3333-3333-3333-333333333333"]', 0)
ON DUPLICATE KEY UPDATE Title = VALUES(Title);

-- Sample Habit Logs
INSERT INTO HabitLogs (Id, HabitId, UserId, DueDate, CompletedAt, Notes, IsPublic, Deleted, Completed)
VALUES 
    ('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2025-05-23 23:59:59', '2025-05-23 06:30:00', 'Great workout today! Feeling energized.', 1, 0, 1),
    ('22222222-aaaa-aaaa-aaaa-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2025-05-24 23:59:59', NULL, NULL, 0, 0, 0),
    ('33333333-bbbb-bbbb-bbbb-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '2025-05-23 23:59:59', '2025-05-23 20:15:00', 'Read an amazing chapter about habit formation', 1, 0, 1),
    ('44444444-cccc-cccc-cccc-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2025-05-26 23:59:59', NULL, 'Planning to meal prep on Sunday', 0, 0, 0),
    ('55555555-dddd-dddd-dddd-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', '2025-05-24 23:59:59', '2025-05-24 07:15:00', '15 minutes of mindfulness meditation', 0, 0, 1)
ON DUPLICATE KEY UPDATE Completed = VALUES(Completed);

-- Sample Challenges
INSERT INTO Challenges (Id, UserId, FriendId, Status, CreatedAt, UpdatedAt, HabitId)
VALUES 
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, '2025-01-10 10:00:00', '2025-01-11 14:30:00', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 0, '2025-01-15 16:00:00', NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 2, '2025-01-20 09:00:00', '2025-01-21 11:00:00', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON DUPLICATE KEY UPDATE Status = VALUES(Status);

-- Sample Friendships
INSERT INTO Friendships (Id, UserId, FriendId, Status, CreatedAt, UpdatedAt)
VALUES 
    ('aaaaaaaa-1111-1111-1111-aaaaaaaa1111', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 1, '2025-01-05 12:00:00', '2025-01-06 08:00:00'),
    ('bbbbbbbb-2222-2222-2222-bbbbbbbb2222', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 1, '2025-01-08 14:00:00', '2025-01-09 10:00:00'),
    ('cccccccc-3333-3333-3333-cccccccc3333', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 0, '2025-01-12 16:00:00', NULL)
ON DUPLICATE KEY UPDATE Status = VALUES(Status);

-- Sample Negative Habits
INSERT INTO NegativeHabits (Id, UserId, Title, Description, Color, Deleted, UpdatedAt)
VALUES 
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '11111111-1111-1111-1111-111111111111', 'Social Media Scrolling', 'Mindless scrolling through social media', '#F44336', 0, '2025-01-10 15:00:00'),
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '22222222-2222-2222-2222-222222222222', 'Late Night Snacking', 'Eating unhealthy snacks after 9 PM', '#FF9800', 0, '2025-01-12 18:00:00'),
    ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '33333333-3333-3333-3333-333333333333', 'Procrastination', 'Delaying important tasks', '#795548', 0, '2025-01-14 20:00:00')
ON DUPLICATE KEY UPDATE Title = VALUES(Title);

SELECT 'Seed data script executed successfully.' AS Status;