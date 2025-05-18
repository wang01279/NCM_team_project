-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2025 年 05 月 18 日 20:32
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
  `created_at` datetime DEFAULT current_timestamp(),
  `firebase_uid` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `members`
--

INSERT INTO `members` (`id`, `email`, `password`, `reset_token`, `reset_token_expiry`, `google_id`, `role`, `is_deleted`, `created_at`, `firebase_uid`) VALUES
(91, 'eeyorepppppp@gmail.com', NULL, NULL, NULL, NULL, 'member', 0, '2025-05-19 02:18:24', 'l6dlfdM5T2goNTP22S7ng68FfBC3'),
(92, 'erica51528@gmail.com', NULL, NULL, NULL, NULL, 'member', 0, '2025-05-19 02:22:22', 'mmWngRPpqfRhtJWF2Mw3ANI7nHo1'),
(93, 'ncm@test.com', '$2b$10$ay3VtU5lkvq0nJG4NY6llelR5cSMBPf4JMYeBeXbOOFeteIpzncj.', NULL, NULL, NULL, 'member', 0, '2025-05-19 02:25:20', NULL),
(94, 'hu@test.com', '$2b$10$mV51MFUdJfZbxq0/XAqQp.SoC9Yk0ppMy5c9hXwGYOH5R6EN4NskW', NULL, NULL, NULL, 'member', 0, '2025-05-19 02:28:12', NULL),
(95, 'wang@test.com', '$2b$10$RmHLGIhqReY.FoZEl2LWKOmDcrhdJAqNokNl27Dsjm0ei3ulFIvYK', NULL, NULL, NULL, 'member', 0, '2025-05-19 02:29:43', NULL),
(96, 'xie@test.com', '$2b$10$zji/kmd5HjmD0OMJQilgI.q7WN5gXqrMVw9wvKc7Ev2qLGoXxWz2G', NULL, NULL, NULL, 'member', 0, '2025-05-19 02:30:47', NULL),
(97, 'lili@test.com', '$2b$10$RMkGGxO3sMshFNGMj/zeHOGJo0ODWoUHrFkT5z0ONaRFo9QHnfayi', NULL, NULL, NULL, 'member', 0, '2025-05-19 02:31:40', NULL);

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
(91, 91, 'NCM故瓷', 'O', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/1747592433743-514995103.svg', 0, '2024-12-25'),
(92, 92, 'Chun Chun', 'F', '0912345678', '桃園市中壢區新生路二段421號', 'https://lh3.googleusercontent.com/a/ACg8ocLJZayu_xLnunFAKtxpSRY3DTCB5NCdhqFjpQ9q8On8u6uOaWqW=s96-c', 0, '1998-06-01'),
(93, 93, '小磁怪', 'O', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/default-avatar.png', 0, '2024-12-26'),
(94, 94, '胡一心', 'F', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/default-avatar.png', 0, '1999-06-25'),
(95, 95, '王阿哲', 'M', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/default-avatar.png', 0, '2002-04-03'),
(96, 96, '謝阿祐', 'M', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/default-avatar.png', 0, '2020-04-03'),
(97, 97, 'Lilian', 'F', '0912345678', '桃園市中壢區新生路二段421號', '/uploads/default-avatar.png', 0, '2001-11-19');

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
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `firebase_uid` (`firebase_uid`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `member_profiles`
--
ALTER TABLE `member_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

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
