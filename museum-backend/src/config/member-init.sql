-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2025 年 05 月 14 日 16:58
-- 伺服器版本： 10.4.28-MariaDB
-- PHP 版本： 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `museum_db`
--

-- --------------------------------------------------------

--
-- 資料表結構 `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `message_type` enum('text','image','file') DEFAULT 'text',
  `status` enum('sent','delivered','read') DEFAULT 'sent'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chat_room_members`
--

CREATE TABLE `chat_room_members` (
  `room_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `role` enum('owner','admin','member') DEFAULT 'member',
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `chat_room_messages`
--

CREATE TABLE `chat_room_messages` (
  `id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `message_type` enum('text','image','file') DEFAULT 'text',
  `status` enum('sent','delivered','read') DEFAULT 'sent',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `role` enum('member','admin','staff') DEFAULT 'member',
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `members`
--

INSERT INTO `members` (`id`, `email`, `password`, `reset_token`, `reset_token_expiry`, `google_id`, `role`, `is_deleted`, `created_at`) VALUES
(1, 'test@example.com', '$2b$10$mPi6.KtTOiW9NYLwQ6xF9eDJcTRJdyIdCLyUd.fLeAa1jrpecVOC2', NULL, NULL, NULL, 'member', 0, '2025-04-30 22:36:35'),
(2, 'test3@example.com', '$2b$10$m9N3edCnQLnP.c/v87HGsecoHWSA7ABZjNNMYhxmyljxYi1RXew3S', NULL, NULL, NULL, 'member', 0, '2025-04-30 22:38:53'),
(3, 'test2@example.com', '$2b$10$1SbsvpeD/ohQI9p803oY.OVXXVeC90FuNqT/I6YU2pKBCz0ykfnAu', NULL, NULL, NULL, 'member', 1, '2025-04-30 22:59:54'),
(4, 'eeyorepppppp@gmail.com', NULL, NULL, NULL, '114548210815219626446', 'admin', 0, '2025-05-01 00:34:23'),
(5, 'chun@test.com', '$2b$10$Tp9lNGA1esxBO1tivvOR2..dBTxy/XaqX3VopMdkGxESHoillyKWe', '276136', '2025-05-12 19:26:09', NULL, 'member', 0, '2025-05-01 03:00:57'),
(6, 'erica51528@yahoo.com.tw', '$2b$10$jKY0wbsekVrH99gNAuYjNult98ACVibDW4T8YLpbb97R3nF55HcQe', NULL, NULL, NULL, 'member', 0, '2025-05-01 03:03:46'),
(7, 'erica51528@gmail.com', '$2b$10$a2Pab9n6z6wSxV8Prr1tiOgiQ6mOSYnlSX01YzUTrLif38QaxsqvK', '295466', '2025-05-12 21:20:54', '110215699996745906774', 'member', 0, '2025-05-01 03:04:41'),
(8, '123@gmail.com', '$2b$10$0999MTbsYQVSMhlpWuAuoOJ01QmnNAJC7UPduxaVBtJ2BiPaR1vHq', NULL, NULL, NULL, 'member', 0, '2025-05-01 03:07:50'),
(9, 'eeyoreppp@gmail.com', NULL, NULL, NULL, '112083537805999064229', 'member', 0, '2025-05-01 03:17:37'),
(10, 'localhost@jnn.fjyj', '$2b$10$5qrQcbJ1Uq57yBKfrEQXn.qMD/Vkawf.zAXfhs.Dq1yzL0clK/OEW', NULL, NULL, NULL, 'member', 0, '2025-05-08 01:30:26'),
(11, 'erica@gamil.com', '$2b$10$RmI4VLzO1Mzg40MDX6knS./dogWMq4OvHS/NSm9cUCioWp0bYXIwi', NULL, NULL, NULL, 'member', 0, '2025-05-09 19:45:50'),
(12, 'chunchun@test.com', '$2b$10$GbatdttI/abB4BzZVaz00uUHfiGl14.cv4X6PLPkYHyEI69p2orvq', NULL, NULL, NULL, 'member', 0, '2025-05-10 00:56:34'),
(13, 'bin@test.com', '$2b$10$3Tb3PXPu7EJ4mO5Ok0lTO.gskXV5hrknanpKSSeqmLiJQgPLusUVK', NULL, NULL, NULL, 'member', 0, '2025-05-10 01:21:02'),
(14, 'chun1@test.com', '$2b$10$75LcnNOL7i4S6xQtdelUQ.Bfq1yveFCuppDkwA8lPWIteLHd6GBlO', NULL, NULL, NULL, 'member', 0, '2025-05-10 17:27:43'),
(15, 'eeyorepppp@gmail.com', NULL, NULL, NULL, '113048253439701359467', 'member', 0, '2025-05-10 17:42:19');

-- --------------------------------------------------------

--
-- 資料表結構 `member_profiles`
--

CREATE TABLE `member_profiles` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `gender` enum('M','F','O') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'https://example.com/default-avatar.png',
  `is_deleted` tinyint(1) DEFAULT 0,
  `birthday` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `member_profiles`
--

INSERT INTO `member_profiles` (`id`, `member_id`, `name`, `gender`, `phone`, `address`, `avatar`, `is_deleted`, `birthday`) VALUES
(1, 1, '新名字', 'M', '0912345678', '台北市', '/uploads/1746024404143-24802191.jpg', 0, NULL),
(2, 2, '測試用戶', NULL, NULL, NULL, 'https://example.com/custom-avatar.png', 0, NULL),
(3, 3, 'Test User 2', NULL, NULL, NULL, 'https://example.com/default-avatar.png', 1, NULL),
(4, 4, 'NCM故瓷', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKaAAXCQaAIJDp1bepaXAJHok3pw7RZeFt6g5srSISP7_7Zayw=s96-c', 0, '2025-05-08'),
(5, 5, '123456', NULL, '0912345678', '新興路3巷24號', 'https://example.com/default-avatar.png', 0, '2025-02-05'),
(6, 6, '李傑克1', NULL, NULL, NULL, 'https://example.com/default-avatar.png', 0, NULL),
(7, 7, 'catt', NULL, NULL, NULL, '/uploads/1747227610579-832005215.jpg', 0, NULL),
(8, 8, 'jack1', NULL, '123442131', '新興路3巷24號', 'https://example.com/default-avatar.png', 0, '2025-05-16'),
(9, 9, '-MEFF64 1', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocJJ6SJ8BPZGeZteRkFXuD0KUexgL_5yHmGll_pCroPLjh62e4U=s96-c', 0, NULL),
(10, 10, 'May', NULL, NULL, NULL, 'https://example.com/default-avatar.png', 0, NULL),
(11, 11, 'Chun', NULL, NULL, NULL, 'https://example.com/default-avatar.png', 0, NULL),
(12, 12, '丸丸', 'F', '0912345678', '新興路3巷24號', 'https://example.com/default-avatar.png', 0, '2025-05-08'),
(13, 13, '111', 'F', NULL, NULL, '/uploads/1746869219275-237231233.png', 0, NULL),
(14, 14, 'May', NULL, NULL, NULL, '/uploads/1746869303636-176080332.jpg', 0, NULL),
(15, 15, '-MEFF64 2', NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocLIgueLQBOJqa3OxPm4qUU01vHYAIya7Pn7_1N1iAnWYqGGQ50=s96-c', 0, NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `idx_sender_receiver` (`sender_id`,`receiver_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_status` (`status`);

--
-- 資料表索引 `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `chat_room_members`
--
ALTER TABLE `chat_room_members`
  ADD PRIMARY KEY (`room_id`,`member_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `idx_room_member` (`room_id`,`member_id`);

--
-- 資料表索引 `chat_room_messages`
--
ALTER TABLE `chat_room_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `idx_room_messages` (`room_id`,`created_at`);

--
-- 資料表索引 `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 資料表索引 `member_profiles`
--
ALTER TABLE `member_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- 資料表索引 `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from_user_id` (`from_user_id`),
  ADD KEY `to_user_id` (`to_user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `chat_room_messages`
--
ALTER TABLE `chat_room_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `member_profiles`
--
ALTER TABLE `member_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `members` (`id`),
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `members` (`id`);

--
-- 資料表的限制式 `chat_room_members`
--
ALTER TABLE `chat_room_members`
  ADD CONSTRAINT `chat_room_members_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_room_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `chat_room_messages`
--
ALTER TABLE `chat_room_messages`
  ADD CONSTRAINT `chat_room_messages_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_room_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `member_profiles`
--
ALTER TABLE `member_profiles`
  ADD CONSTRAINT `member_profiles_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`from_user_id`) REFERENCES `members` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`to_user_id`) REFERENCES `members` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
