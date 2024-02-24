-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 22, 2024 at 12:08 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `banner_id` int(11) NOT NULL,
  `banner` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`banner_id`, `banner`, `date`) VALUES
(1, 'banner-1708293582831.jpg', '2024-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `boostpromote`
--

CREATE TABLE `boostpromote` (
  `boost_id` int(11) NOT NULL,
  `boost_id_pro` int(11) NOT NULL,
  `boost_point` int(11) NOT NULL,
  `boost_day` int(11) NOT NULL,
  `boost_start` datetime NOT NULL,
  `boost_end` datetime NOT NULL,
  `boost_date` datetime NOT NULL DEFAULT current_timestamp(),
  `boost_update` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `cu_id` int(11) NOT NULL,
  `id_pro_coupon` int(11) NOT NULL,
  `name_pro_coupon` varchar(255) NOT NULL,
  `type_pro_coupon` varchar(255) NOT NULL,
  `id_res_coupon` int(11) NOT NULL,
  `cu_code` varchar(10) NOT NULL,
  `cu_amountcanused` int(1) NOT NULL,
  `price_pro` int(11) NOT NULL,
  `status` varchar(8) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `img_pro` text NOT NULL,
  `id_user` int(11) NOT NULL,
  `cu_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `cu_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`cu_id`, `id_pro_coupon`, `name_pro_coupon`, `type_pro_coupon`, `id_res_coupon`, `cu_code`, `cu_amountcanused`, `price_pro`, `status`, `date_start`, `date_end`, `time_start`, `time_end`, `img_pro`, `id_user`, `cu_current`, `cu_update`) VALUES
(1, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 1, 'PSVBy', 1, 150, 'Book', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00', 'imageFood-1707949361084.jpg', 2, '2024-02-14 22:22:41', '2024-02-17 00:54:52'),
(2, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 1, '8Cjs5', 1, 150, 'Order', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00', 'imageFood-1707949361084.jpg', 0, '2024-02-14 22:22:41', '2024-02-14 22:22:41'),
(3, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 1, '1Xo4l', 1, 150, 'Order', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00', 'imageFood-1707949361084.jpg', 0, '2024-02-14 22:22:41', '2024-02-14 22:22:41'),
(4, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 1, 'ebHNY', 1, 150, 'Order', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00', 'imageFood-1707949361084.jpg', 0, '2024-02-14 22:22:41', '2024-02-14 22:22:41'),
(5, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 1, 'sHumv', 1, 150, 'Order', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00', 'imageFood-1707949361084.jpg', 0, '2024-02-14 22:22:41', '2024-02-14 22:22:41'),
(6, 2, 'ทานฟรี', 'ประเภทกินฟรี', 1, 'ayJ5t', 1, 0, 'Book', '2024-02-16', '2024-02-23', '06:25:00', '10:25:00', 'imageFood-1707949511797.jpg', 6, '2024-02-14 22:25:11', '2024-02-21 22:28:26'),
(7, 2, 'ทานฟรี', 'ประเภทกินฟรี', 1, 'OcEfC', 1, 0, 'Order', '2024-02-16', '2024-02-23', '06:25:00', '10:25:00', 'imageFood-1707949511797.jpg', 0, '2024-02-14 22:25:12', '2024-02-14 22:25:12'),
(8, 2, 'ทานฟรี', 'ประเภทกินฟรี', 1, 'vcrqB', 1, 0, 'Order', '2024-02-16', '2024-02-23', '06:25:00', '10:25:00', 'imageFood-1707949511797.jpg', 0, '2024-02-14 22:25:12', '2024-02-14 22:25:12'),
(9, 3, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 1, 'eeW1Y', 1, 250, 'Order', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00', 'imageFood-1707949579783.jpg', 0, '2024-02-14 22:26:19', '2024-02-14 22:26:19'),
(10, 3, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 1, '5QfV3', 1, 250, 'Order', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00', 'imageFood-1707949579783.jpg', 0, '2024-02-14 22:26:19', '2024-02-14 22:26:19'),
(11, 3, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 1, '1mXO6', 1, 250, 'Order', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00', 'imageFood-1707949579783.jpg', 0, '2024-02-14 22:26:19', '2024-02-14 22:26:19'),
(12, 3, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 1, 'Wamcw', 1, 250, 'Order', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00', 'imageFood-1707949579783.jpg', 0, '2024-02-14 22:26:20', '2024-02-14 22:26:20'),
(13, 3, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 1, 'P4xWR', 1, 250, 'Order', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00', 'imageFood-1707949579783.jpg', 0, '2024-02-14 22:26:20', '2024-02-14 22:26:20'),
(14, 4, 'กระเป๋าผ้ารักษ์โลก', 'ประเภทแลกของฟรี', 2, 'KLSqL', 1, 500, 'Order', '2024-02-15', '2024-02-29', '10:28:00', '04:40:00', 'imageFood-1707949721598.jpg', 0, '2024-02-14 22:28:41', '2024-02-14 22:28:41'),
(15, 4, 'กระเป๋าผ้ารักษ์โลก', 'ประเภทแลกของฟรี', 2, 'vLFUW', 1, 500, 'Order', '2024-02-15', '2024-02-29', '10:28:00', '04:40:00', 'imageFood-1707949721598.jpg', 0, '2024-02-14 22:28:41', '2024-02-14 22:28:41'),
(16, 5, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 2, 'cWKKz', 1, 350, 'Book', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00', 'imageFood-1707949915917.jpg', 0, '2024-02-14 22:31:56', '2024-02-21 22:55:09'),
(17, 5, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 2, 'cpede', 1, 350, 'Book', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00', 'imageFood-1707949915917.jpg', 0, '2024-02-14 22:31:56', '2024-02-21 22:55:09'),
(18, 5, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 2, 'IU8aa', 1, 350, 'Book', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00', 'imageFood-1707949915917.jpg', 0, '2024-02-14 22:31:56', '2024-02-21 22:55:09'),
(19, 5, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 2, 'ZnwlV', 1, 350, 'Book', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00', 'imageFood-1707949915917.jpg', 0, '2024-02-14 22:31:56', '2024-02-21 22:55:09'),
(20, 5, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 2, 'h4NVN', 1, 350, 'Book', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00', 'imageFood-1707949915917.jpg', 0, '2024-02-14 22:31:56', '2024-02-21 22:55:09');

-- --------------------------------------------------------

--
-- Table structure for table `coupon_user`
--

CREATE TABLE `coupon_user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `coupon_id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `datebook` date NOT NULL,
  `timebook` time NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_user`
--

INSERT INTO `coupon_user` (`id`, `user_id`, `coupon_id`, `status`, `datebook`, `timebook`, `date_time`) VALUES
(1, 2, 1, 'Book', '2024-02-17', '00:00:00', '2024-02-17 00:54:52'),
(2, 6, 6, 'Book', '2024-02-22', '09:30:00', '2024-02-21 22:28:26');

-- --------------------------------------------------------

--
-- Table structure for table `historyviews`
--

CREATE TABLE `historyviews` (
  `id` int(11) NOT NULL,
  `timestamp_towebsite` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historyviews`
--

INSERT INTO `historyviews` (`id`, `timestamp_towebsite`) VALUES
(1, '2024-02-14 22:15:51'),
(2, '2024-02-14 22:18:33'),
(3, '2024-02-14 22:21:03'),
(4, '2024-02-14 22:25:53'),
(5, '2024-02-14 22:26:34'),
(6, '2024-02-14 22:31:59'),
(7, '2024-02-14 22:32:12'),
(8, '2024-02-16 09:32:00'),
(9, '2024-02-16 10:33:02'),
(10, '2024-02-16 10:33:06'),
(11, '2024-02-16 10:53:21'),
(12, '2024-02-16 10:55:37'),
(13, '2024-02-16 10:58:25'),
(14, '2024-02-16 10:59:18'),
(15, '2024-02-16 10:59:24'),
(16, '2024-02-16 11:00:31'),
(17, '2024-02-16 11:00:49'),
(18, '2024-02-16 11:01:12'),
(19, '2024-02-16 11:04:20'),
(20, '2024-02-16 11:10:04'),
(21, '2024-02-16 11:10:16'),
(22, '2024-02-16 11:10:31'),
(23, '2024-02-16 11:10:43'),
(24, '2024-02-16 11:10:52'),
(25, '2024-02-16 11:11:15'),
(26, '2024-02-16 11:11:32'),
(27, '2024-02-16 11:17:21'),
(28, '2024-02-16 11:18:28'),
(29, '2024-02-16 11:19:53'),
(30, '2024-02-16 11:37:44'),
(31, '2024-02-16 11:38:11'),
(32, '2024-02-16 11:38:57'),
(33, '2024-02-16 11:40:22'),
(34, '2024-02-16 12:31:40'),
(35, '2024-02-16 13:36:36'),
(36, '2024-02-16 13:40:25'),
(37, '2024-02-16 23:42:50'),
(38, '2024-02-16 23:47:31'),
(39, '2024-02-16 23:51:24'),
(40, '2024-02-17 00:03:47'),
(41, '2024-02-17 00:03:56'),
(42, '2024-02-17 00:04:15'),
(43, '2024-02-17 00:06:26'),
(44, '2024-02-17 00:06:55'),
(45, '2024-02-17 00:46:41'),
(46, '2024-02-17 00:50:40'),
(47, '2024-02-17 00:51:29'),
(48, '2024-02-17 00:55:01'),
(49, '2024-02-17 00:56:00'),
(50, '2024-02-17 00:56:45'),
(51, '2024-02-17 01:03:33'),
(52, '2024-02-17 01:04:05'),
(53, '2024-02-17 01:04:36'),
(54, '2024-02-17 01:04:50'),
(55, '2024-02-17 01:27:51'),
(56, '2024-02-17 01:33:50'),
(57, '2024-02-17 01:34:46'),
(58, '2024-02-17 01:35:01'),
(59, '2024-02-17 01:35:13'),
(60, '2024-02-17 01:40:52'),
(61, '2024-02-18 01:34:54'),
(62, '2024-02-18 19:58:19'),
(63, '2024-02-18 20:01:41'),
(64, '2024-02-18 20:02:31'),
(65, '2024-02-18 20:03:19'),
(66, '2024-02-18 20:03:45'),
(67, '2024-02-18 20:03:52'),
(68, '2024-02-18 20:04:04'),
(69, '2024-02-18 20:04:43'),
(70, '2024-02-18 20:05:56'),
(71, '2024-02-18 20:07:08'),
(72, '2024-02-18 20:07:09'),
(73, '2024-02-18 20:08:12'),
(74, '2024-02-18 20:08:41'),
(75, '2024-02-18 20:09:05'),
(76, '2024-02-18 20:11:52'),
(77, '2024-02-18 20:13:58'),
(78, '2024-02-18 20:14:43'),
(79, '2024-02-18 20:15:46'),
(80, '2024-02-18 20:16:01'),
(81, '2024-02-18 20:16:36'),
(82, '2024-02-18 20:18:13'),
(83, '2024-02-18 20:18:33'),
(84, '2024-02-18 20:18:55'),
(85, '2024-02-18 20:18:58'),
(86, '2024-02-18 20:18:59'),
(87, '2024-02-18 20:19:12'),
(88, '2024-02-18 20:19:28'),
(89, '2024-02-18 20:19:48'),
(90, '2024-02-18 20:20:14'),
(91, '2024-02-18 20:20:16'),
(92, '2024-02-18 20:21:33'),
(93, '2024-02-18 20:21:49'),
(94, '2024-02-18 20:22:23'),
(95, '2024-02-18 20:22:41'),
(96, '2024-02-18 20:26:48'),
(97, '2024-02-18 20:27:39'),
(98, '2024-02-18 20:30:26'),
(99, '2024-02-18 20:35:00'),
(100, '2024-02-18 20:51:45'),
(101, '2024-02-18 20:51:49'),
(102, '2024-02-18 20:52:10'),
(103, '2024-02-18 20:53:03'),
(104, '2024-02-18 20:54:05'),
(105, '2024-02-18 20:55:42'),
(106, '2024-02-18 20:55:44'),
(107, '2024-02-18 20:55:45'),
(108, '2024-02-18 20:55:46'),
(109, '2024-02-18 20:55:48'),
(110, '2024-02-18 20:56:39'),
(111, '2024-02-18 20:56:42'),
(112, '2024-02-18 20:57:31'),
(113, '2024-02-18 20:58:47'),
(114, '2024-02-18 20:59:02'),
(115, '2024-02-18 20:59:04'),
(116, '2024-02-18 21:01:25'),
(117, '2024-02-18 21:04:06'),
(118, '2024-02-18 21:07:14'),
(119, '2024-02-18 21:15:45'),
(120, '2024-02-18 21:15:57'),
(121, '2024-02-18 21:16:06'),
(122, '2024-02-18 21:16:13'),
(123, '2024-02-18 21:16:17'),
(124, '2024-02-18 21:16:20'),
(125, '2024-02-18 21:18:02'),
(126, '2024-02-18 21:18:17'),
(127, '2024-02-18 21:18:49'),
(128, '2024-02-18 21:19:45'),
(129, '2024-02-18 21:23:25'),
(130, '2024-02-18 21:23:49'),
(131, '2024-02-18 21:24:23'),
(132, '2024-02-18 21:24:24'),
(133, '2024-02-18 21:24:25'),
(134, '2024-02-18 21:25:08'),
(135, '2024-02-18 21:25:19'),
(136, '2024-02-18 21:25:20'),
(137, '2024-02-18 21:25:22'),
(138, '2024-02-18 21:25:22'),
(139, '2024-02-18 21:26:19'),
(140, '2024-02-18 21:28:03'),
(141, '2024-02-18 21:28:04'),
(142, '2024-02-18 21:28:06'),
(143, '2024-02-18 21:28:07'),
(144, '2024-02-18 21:28:21'),
(145, '2024-02-18 21:29:17'),
(146, '2024-02-18 21:29:21'),
(147, '2024-02-18 21:29:22'),
(148, '2024-02-18 21:29:31'),
(149, '2024-02-18 21:31:34'),
(150, '2024-02-18 21:31:49'),
(151, '2024-02-18 21:32:33'),
(152, '2024-02-18 21:32:45'),
(153, '2024-02-18 21:32:58'),
(154, '2024-02-18 21:34:20'),
(155, '2024-02-18 21:35:26'),
(156, '2024-02-18 21:37:05'),
(157, '2024-02-18 21:39:08'),
(158, '2024-02-18 21:40:30'),
(159, '2024-02-18 21:41:22'),
(160, '2024-02-18 21:41:53'),
(161, '2024-02-18 21:42:11'),
(162, '2024-02-18 21:42:35'),
(163, '2024-02-18 21:43:28'),
(164, '2024-02-18 21:43:38'),
(165, '2024-02-18 21:44:23'),
(166, '2024-02-18 21:44:38'),
(167, '2024-02-18 21:45:07'),
(168, '2024-02-18 21:45:24'),
(169, '2024-02-18 21:46:22'),
(170, '2024-02-18 21:46:34'),
(171, '2024-02-18 21:46:40'),
(172, '2024-02-18 21:47:51'),
(173, '2024-02-18 21:48:15'),
(174, '2024-02-18 21:48:25'),
(175, '2024-02-18 21:49:14'),
(176, '2024-02-18 21:49:22'),
(177, '2024-02-18 21:54:37'),
(178, '2024-02-18 21:57:52'),
(179, '2024-02-18 21:59:32'),
(180, '2024-02-18 21:59:44'),
(181, '2024-02-18 22:07:55'),
(182, '2024-02-18 22:08:16'),
(183, '2024-02-18 22:20:47'),
(184, '2024-02-18 22:28:52'),
(185, '2024-02-18 22:34:12'),
(186, '2024-02-18 22:48:03'),
(187, '2024-02-18 22:49:16'),
(188, '2024-02-18 23:09:29'),
(189, '2024-02-18 23:14:28'),
(190, '2024-02-18 23:23:26'),
(191, '2024-02-21 19:05:02'),
(192, '2024-02-21 20:32:56'),
(193, '2024-02-21 20:32:58'),
(194, '2024-02-21 22:17:45'),
(195, '2024-02-21 22:18:58'),
(196, '2024-02-21 22:24:11'),
(197, '2024-02-21 22:28:38'),
(198, '2024-02-21 22:30:15'),
(199, '2024-02-21 22:32:00'),
(200, '2024-02-21 22:35:31'),
(201, '2024-02-21 22:37:49'),
(202, '2024-02-21 22:40:20'),
(203, '2024-02-21 22:41:59'),
(204, '2024-02-21 22:43:02'),
(205, '2024-02-21 22:43:52'),
(206, '2024-02-21 22:45:03'),
(207, '2024-02-21 22:46:37'),
(208, '2024-02-21 22:47:05'),
(209, '2024-02-21 22:53:41'),
(210, '2024-02-21 22:55:12'),
(211, '2024-02-21 22:56:17'),
(212, '2024-02-21 23:02:53'),
(213, '2024-02-21 23:04:04'),
(214, '2024-02-21 23:04:24'),
(215, '2024-02-21 23:04:59'),
(216, '2024-02-21 23:05:00'),
(217, '2024-02-21 23:08:09'),
(218, '2024-02-21 23:08:13');

-- --------------------------------------------------------

--
-- Table structure for table `logo`
--

CREATE TABLE `logo` (
  `logo_id` int(11) NOT NULL,
  `logo` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logo`
--

INSERT INTO `logo` (`logo_id`, `logo`, `date`) VALUES
(1, 'logo-1708291096280.png', '2024-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `point`
--

CREATE TABLE `point` (
  `id` int(11) NOT NULL,
  `point` int(11) NOT NULL,
  `update_point` time NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point`
--

INSERT INTO `point` (`id`, `point`, `update_point`) VALUES
(1, 93250, '00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `point_transactions`
--

CREATE TABLE `point_transactions` (
  `tran_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `res_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `point_earn` int(11) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `point_img` text NOT NULL,
  `status` varchar(10) NOT NULL,
  `tran_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_transactions`
--

INSERT INTO `point_transactions` (`tran_id`, `user_id`, `res_id`, `name`, `email`, `point_earn`, `bank_name`, `point_img`, `status`, `tran_date`) VALUES
(1, 5, 0, 'test2', 'test2@gmail.com', 2250, 'ธนาคารกรุงเทพ', 'point-1708131871018.jpg', 'Success', '2024-02-17'),
(2, 6, 0, 'test33', 'test3@gmail.com', 2250, 'ธนาคารไทยพาณิชย์', 'point-1708553862317.jpg', 'Success', '2024-02-22'),
(3, 6, 4, 'test33', 'test33@gmail.com', 2250, 'ธนาคารไทยพาณิชย์', 'point-1708556641760.jpg', 'Success', '2024-02-22');

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `pro_id` int(11) NOT NULL,
  `id_pro` int(11) NOT NULL,
  `id_restb` int(11) NOT NULL,
  `pro_name` varchar(150) NOT NULL,
  `pro_type` varchar(255) NOT NULL,
  `pro_detail` varchar(255) NOT NULL,
  `pro_price` int(4) NOT NULL,
  `pro_amount` int(7) NOT NULL,
  `like` int(11) NOT NULL,
  `boost` int(11) NOT NULL,
  `status` varchar(8) NOT NULL,
  `pro_image` text NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion`
--

INSERT INTO `promotion` (`pro_id`, `id_pro`, `id_restb`, `pro_name`, `pro_type`, `pro_detail`, `pro_price`, `pro_amount`, `like`, `boost`, `status`, `pro_image`, `date_start`, `date_end`, `time_start`, `time_end`) VALUES
(1, 1, 1, 'ชาบูพิเศษ 199', 'ประเภทราคาพิเศษ', 'พิเศษชาบูเนื้อ 199 2 ท่าน', 150, 5, 1, 0, 'Order', 'imageFood-1707949361084.jpg', '2024-02-15', '2024-02-21', '08:22:00', '11:22:00'),
(2, 2, 1, 'ทานฟรี', 'ประเภทกินฟรี', 'ไข่เจียวทานฟรีสำหรับผู้ยากไร้', 0, 3, 1, 0, 'Order', 'imageFood-1707949511797.jpg', '2024-02-16', '2024-02-23', '06:25:00', '10:25:00'),
(3, 3, 1, 'กินวันนี้ฟรีไอติม', 'ประเภท1แถม1', 'กินวันนี้ฟรีไอติม ถึง 5โมง', 250, 5, 0, 0, 'Order', 'imageFood-1707949579783.jpg', '2024-02-15', '2024-02-27', '10:30:00', '00:30:00'),
(4, 4, 2, 'กระเป๋าผ้ารักษ์โลก', 'ประเภทแลกของฟรี', 'ทานวันนี้ครบ 500 แลกกระเป๋าผ้าใบ ฟรี', 500, 2, 0, 0, 'Order', 'imageFood-1707949721598.jpg', '2024-02-15', '2024-02-29', '10:28:00', '04:40:00'),
(5, 5, 2, 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 'โปรโมชั่นส่วนลดพิเศษ', 'ทานครบ 4 ท่าน จ่าย 3 ท่าน', 350, 5, 1, 0, 'Off', 'imageFood-1707949915917.jpg', '2024-02-15', '2024-02-28', '08:30:00', '08:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `res_id` int(8) NOT NULL,
  `id_res` int(11) NOT NULL,
  `id_usertb` int(11) NOT NULL,
  `res_name` varchar(255) NOT NULL,
  `res_email` varchar(255) NOT NULL,
  `res_address` text NOT NULL,
  `res_phone` varchar(10) NOT NULL,
  `res_status_resturant` varchar(255) NOT NULL,
  `res_owner_profile` varchar(255) NOT NULL,
  `res_owner_name` varchar(255) NOT NULL,
  `res_owner_lnam` varchar(255) NOT NULL,
  `res_owner_phone` varchar(10) NOT NULL,
  `res_owner_email` varchar(255) NOT NULL,
  `res_profile` text NOT NULL,
  `res_certificate` text NOT NULL,
  `status` varchar(11) NOT NULL,
  `time_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`res_id`, `id_res`, `id_usertb`, `res_name`, `res_email`, `res_address`, `res_phone`, `res_status_resturant`, `res_owner_profile`, `res_owner_name`, `res_owner_lnam`, `res_owner_phone`, `res_owner_email`, `res_profile`, `res_certificate`, `status`, `time_current`, `time_update`) VALUES
(1, 1, 3, 'กั๊ตจัง หมูกระทะ', 'gutjungres@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.8967218605944!2d99.00669377494786!3d18.758149661874562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da301f15f2efd5%3A0xc26d85bab858a381!2z4Lij4LmJ4Liy4LiZ4Lit4Liy4Lir4Liy4LijIOC4geC4seC5iuC4leC4iOC4seC4hyDguIrguLLguJrguLkg4Lir4Lih4Li54LiI4Li44LmI4LihICYg4Liq4Li44LiB4Li14LmJ!5e0!3m2!1sth!2sth!4v1706039359770!5m2!1sth!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0953582236', 'ร้านบุฟเฟต์', 'นาง', 'กั๊ตจัง', 'อิอิ', '0953582234', 'gutjung01@gnail.com', 'NULL', 'image-1706041024909.jpg', 'success', '2024-01-23 20:17:04', '2024-01-23 20:18:21'),
(2, 2, 4, 'อิ่มดี อาหารตามสั่ง', 'eimdee@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!3m2!1sth!2sth!4v1706041586244!5m2!1sth!2sth!6m8!1m7!1s5y3Z8dz1T7vSTyA0PKLqbQ!2m2!1d18.75310814939448!2d99.01659854600113!3f79.40173313798459!4f5.2713443604833685!5f0.7820865974627469\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0979682017', 'ร้านอาหารตามสั่ง', 'นาง', 'พร', 'จำแลงรัตน์', '0953582234', 'porn@gmail.com', 'NULL', 'image-1706041668785.jpg', 'success', '2024-01-23 20:27:48', '2024-01-23 20:28:01'),
(3, 3, 5, '8 Days a week', 'day@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.926074860991!2d98.96054147494876!3d18.80144756053474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a6135eb8a43%3A0x2c88460a16367af2!2s8%20Days%20a%20week!5e0!3m2!1sth!2sth!4v1708133057166!5m2!1sth!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0953582236', 'ร้านหมูกระทะ', 'นาง', 'eage', 'eageday', '0953582234', 'eage@gmail.com', 'NULL', 'image-1708288258358.jpg', 'success', '2024-02-17 01:27:51', '2024-02-18 20:30:58'),
(6, 4, 6, 'หม่าล่า4แยก สาขาหนองหอย', 'mai@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d794.1979202481895!2d99.01159379381556!3d18.75964346392678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da301e33bf257b%3A0xd3dcab61e74e1c3b!2z4Lir4Lih4LmI4Liy4Lil4LmI4LiyNOC5geC4ouC4gSDguKrguLLguILguLLguKvguJnguK3guIfguKvguK3guKI!5e0!3m2!1sth!2sth!4v1708555730306!5m2!1sth!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0953153135', 'ร้านหมูกระทะ', 'นาย', 'mai', 'mai2', '0953582234', 'mailai2@gmail.com', 'Profile-1708555781474.jpg', 'image-1708555645102.jpg', 'success', '2024-02-21 22:43:51', '2024-02-21 22:49:41');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(8) NOT NULL,
  `id_user` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `level` varchar(1) NOT NULL,
  `status` varchar(10) NOT NULL,
  `Profile` text NOT NULL,
  `address` text NOT NULL,
  `user_point` int(11) NOT NULL,
  `id_restb` int(11) NOT NULL,
  `time_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `id_user`, `username`, `password`, `fname`, `lname`, `email`, `phone`, `level`, `status`, `Profile`, `address`, `user_point`, `id_restb`, `time_current`, `time_update`) VALUES
(1, 1, 'admin', '$2b$12$HY.UtDhHI00weefvjn5FJO1jGWhugFRjsfr0X5VNjmy0EMjvsRt5.', 'admin', 'admin', 'admin@gmail.com', '0953582231', 'A', 'success', 'NULL', 'NULL', 0, 0, '2024-01-23 19:40:30', '2024-01-23 19:40:30'),
(2, 2, 'test', '$2b$12$LF.qrMimZOil8nNes0Svm.AVGotZsuXQVFdzQ.DsgW3gSI3Edo2Ma', 'test', 'test', 'test@gmail.com', '0958795531', 'U', 'success', 'Profile-1707863755044.jpg', 'อิอิ', 37126, 0, '2024-01-23 19:44:05', '2024-02-17 00:54:52'),
(3, 3, 'testresturant', '$2b$12$dqISJAbwtF8hNO.FwOIr7uLulDcdxHBXwjwr9a5/z6I1V9Wtj85Sy', 'testresturant', 'testresturant', 'testresturant@gmail.com', '0953582238', 'R', 'success', 'NULL', 'NULL', 700, 1, '2024-01-23 19:44:53', '2024-02-18 23:21:39'),
(4, 4, 'resturant', '$2b$12$1lyyNRq78RBB.9cfBq1rb.lFv2ovLa74mDj136nmZmhMyyQ.ThmVu', 'resturant', 'resturant', 'resturant@gmail.com', '0958974456', 'R', 'success', 'NULL', 'NULL', 0, 2, '2024-01-23 20:22:18', '2024-02-18 23:23:02'),
(5, 5, 'test2', '$2b$12$lcdWM1hPEn7dcNIRhJ48v.8ZsRj4XRBlWoogGEVCvJFFO6XrZ//MS', 'test2', 'test2', 'test2@gmail.com', '7894561237', 'R', 'success', 'NULL', 'NULL', 2250, 3, '2024-02-17 01:04:05', '2024-02-17 01:28:01'),
(6, 6, 'test3', '$2b$12$ZMeigSKqg2qi375GBZr1ZORmTOLHhptGguZfTYMJbtvb4sP9bLOyS', 'test33', 'test33', 'test33@gmail.com', '0953582238', 'R', 'success', 'Profile-1708548811096.jpg', 'บนโลกใบนี้ที่กว้างใหญ่', 4500, 4, '2024-02-21 20:50:43', '2024-02-21 23:04:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indexes for table `boostpromote`
--
ALTER TABLE `boostpromote`
  ADD PRIMARY KEY (`boost_id`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`cu_id`);

--
-- Indexes for table `coupon_user`
--
ALTER TABLE `coupon_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `historyviews`
--
ALTER TABLE `historyviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logo`
--
ALTER TABLE `logo`
  ADD PRIMARY KEY (`logo_id`);

--
-- Indexes for table `point`
--
ALTER TABLE `point`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `point_transactions`
--
ALTER TABLE `point_transactions`
  ADD PRIMARY KEY (`tran_id`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`pro_id`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`res_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `boostpromote`
--
ALTER TABLE `boostpromote`
  MODIFY `boost_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `cu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `coupon_user`
--
ALTER TABLE `coupon_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `historyviews`
--
ALTER TABLE `historyviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- AUTO_INCREMENT for table `logo`
--
ALTER TABLE `logo`
  MODIFY `logo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point`
--
ALTER TABLE `point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point_transactions`
--
ALTER TABLE `point_transactions`
  MODIFY `tran_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `pro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `res_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
