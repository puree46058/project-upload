-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2024 at 11:59 PM
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
  `banner_id` smallint(5) NOT NULL,
  `banner` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`banner_id`, `banner`, `date`) VALUES
(1, 'background.jpg', '2024-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `boostpromote`
--

CREATE TABLE `boostpromote` (
  `boost_id` smallint(5) NOT NULL,
  `boost_id_pro` smallint(5) NOT NULL,
  `boost_point` int(5) NOT NULL,
  `boost_day` tinyint(1) NOT NULL,
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
  `cu_id` smallint(5) NOT NULL,
  `id_pro_coupon` smallint(5) NOT NULL,
  `name_pro_coupon` varchar(50) NOT NULL,
  `type_pro_coupon` varchar(50) NOT NULL,
  `id_res_coupon` smallint(5) NOT NULL,
  `cu_code` varchar(5) NOT NULL,
  `cu_amountcanused` tinyint(1) NOT NULL,
  `price_pro` int(5) NOT NULL,
  `status` varchar(7) NOT NULL,
  `date_start` date NOT NULL,
  `date_end` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `img_pro` text NOT NULL,
  `id_user` smallint(5) NOT NULL,
  `cu_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `cu_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`cu_id`, `id_pro_coupon`, `name_pro_coupon`, `type_pro_coupon`, `id_res_coupon`, `cu_code`, `cu_amountcanused`, `price_pro`, `status`, `date_start`, `date_end`, `time_start`, `time_end`, `img_pro`, `id_user`, `cu_current`, `cu_update`) VALUES
(1, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', 1, 'f2eaP', 1, 650, 'Order', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00', 'imageFood-1709764828782.jpg', 0, '2024-03-06 22:40:28', '2024-03-06 22:54:10'),
(2, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', 1, '072G8', 1, 650, 'Order', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00', 'imageFood-1709764828782.jpg', 0, '2024-03-06 22:40:29', '2024-03-06 22:54:10'),
(3, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', 1, 'PnfPY', 1, 650, 'Order', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00', 'imageFood-1709764828782.jpg', 0, '2024-03-06 22:40:29', '2024-03-06 22:54:10'),
(4, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', 1, 'dTYyg', 1, 650, 'Order', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00', 'imageFood-1709764828782.jpg', 0, '2024-03-06 22:40:29', '2024-03-06 22:54:10'),
(5, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', 1, 'Dz43U', 1, 650, 'Order', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00', 'imageFood-1709764828782.jpg', 0, '2024-03-06 22:40:29', '2024-03-06 22:54:10'),
(6, 2, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 1, 'uth69', 1, 150, 'Book', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00', 'imageFood-1709764881383.jpg', 2, '2024-03-06 22:41:21', '2024-03-06 22:55:15'),
(7, 2, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 1, 's38Y0', 1, 150, 'Order', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00', 'imageFood-1709764881383.jpg', 0, '2024-03-06 22:41:21', '2024-03-06 22:41:21'),
(8, 2, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 1, '5umxR', 1, 150, 'Order', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00', 'imageFood-1709764881383.jpg', 0, '2024-03-06 22:41:21', '2024-03-06 22:41:21'),
(9, 2, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 1, 'OYThg', 1, 150, 'Order', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00', 'imageFood-1709764881383.jpg', 0, '2024-03-06 22:41:21', '2024-03-06 22:41:21'),
(10, 2, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 1, '7ID0y', 1, 150, 'Order', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00', 'imageFood-1709764881383.jpg', 0, '2024-03-06 22:41:21', '2024-03-06 22:41:21'),
(11, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'E61ZR', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(12, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'tM9UW', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(13, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'HuGit', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(14, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'hH5wz', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(15, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'A7flu', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(16, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'GWmIe', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(17, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'RSyY8', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(18, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'HoN9Y', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(19, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, 'XyJsb', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:45', '2024-03-06 22:42:45'),
(20, 3, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 1, '9fiCB', 1, 0, 'Order', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00', 'imageFood-1709764965334.jpg', 0, '2024-03-06 22:42:46', '2024-03-06 22:42:46'),
(21, 4, 'อาหารเช้าแถมไส้กรอก', 'ประเภท1แถม1', 1, 'MORqB', 1, 599, 'Order', '2024-03-07', '2024-03-16', '05:50:00', '22:00:00', 'imageFood-1709765039705.jpg', 0, '2024-03-06 22:43:59', '2024-03-06 22:43:59'),
(22, 4, 'อาหารเช้าแถมไส้กรอก', 'ประเภท1แถม1', 1, 'DWbE4', 1, 599, 'Order', '2024-03-07', '2024-03-16', '05:50:00', '22:00:00', 'imageFood-1709765039705.jpg', 0, '2024-03-06 22:43:59', '2024-03-06 22:43:59'),
(23, 4, 'อาหารเช้าแถมไส้กรอก', 'ประเภท1แถม1', 1, 'YfJIP', 1, 599, 'Order', '2024-03-07', '2024-03-16', '05:50:00', '22:00:00', 'imageFood-1709765039705.jpg', 0, '2024-03-06 22:43:59', '2024-03-06 22:43:59'),
(24, 5, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 1, '0XeSe', 1, 1000, 'Order', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00', 'imageFood-1709765358577.jpg', 0, '2024-03-06 22:49:18', '2024-03-06 22:49:18'),
(25, 5, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 1, 'JFGpO', 1, 1000, 'Order', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00', 'imageFood-1709765358577.jpg', 0, '2024-03-06 22:49:18', '2024-03-06 22:49:18'),
(26, 5, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 1, 'h5LW6', 1, 1000, 'Order', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00', 'imageFood-1709765358577.jpg', 0, '2024-03-06 22:49:18', '2024-03-06 22:49:18'),
(27, 5, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 1, 'dM99f', 1, 1000, 'Order', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00', 'imageFood-1709765358577.jpg', 0, '2024-03-06 22:49:18', '2024-03-06 22:49:18'),
(28, 5, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 1, 'UhAK4', 1, 1000, 'Order', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00', 'imageFood-1709765358577.jpg', 0, '2024-03-06 22:49:18', '2024-03-06 22:49:18'),
(29, 6, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 1, 'URvjT', 1, 800, 'Order', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00', 'imageFood-1709765897959.jpg', 0, '2024-03-06 22:58:18', '2024-03-06 22:58:18'),
(30, 6, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 1, 'A3ZGA', 1, 800, 'Order', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00', 'imageFood-1709765897959.jpg', 0, '2024-03-06 22:58:18', '2024-03-06 22:58:18'),
(31, 6, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 1, 'KLhRZ', 1, 800, 'Order', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00', 'imageFood-1709765897959.jpg', 0, '2024-03-06 22:58:18', '2024-03-06 22:58:18'),
(32, 6, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 1, '2cHcT', 1, 800, 'Order', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00', 'imageFood-1709765897959.jpg', 0, '2024-03-06 22:58:18', '2024-03-06 22:58:18'),
(33, 6, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 1, 'DJLhF', 1, 800, 'Order', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00', 'imageFood-1709765897959.jpg', 0, '2024-03-06 22:58:18', '2024-03-06 22:58:18');

-- --------------------------------------------------------

--
-- Table structure for table `coupon_user`
--

CREATE TABLE `coupon_user` (
  `id` smallint(5) NOT NULL,
  `user_id` smallint(5) NOT NULL,
  `coupon_id` smallint(5) NOT NULL,
  `status` varchar(7) NOT NULL,
  `datebook` date NOT NULL,
  `timebook` time NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon_user`
--

INSERT INTO `coupon_user` (`id`, `user_id`, `coupon_id`, `status`, `datebook`, `timebook`, `date_time`) VALUES
(1, 2, 6, 'Book', '2024-03-15', '08:00:00', '2024-03-06 22:55:15');

-- --------------------------------------------------------

--
-- Table structure for table `historyviews`
--

CREATE TABLE `historyviews` (
  `id` smallint(5) NOT NULL,
  `timestamp_towebsite` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historyviews`
--

INSERT INTO `historyviews` (`id`, `timestamp_towebsite`) VALUES
(1, '2024-03-06 07:49:52'),
(2, '2024-03-06 07:52:53'),
(3, '2024-03-06 07:53:33'),
(4, '2024-03-06 22:14:46'),
(5, '2024-03-06 22:16:54'),
(6, '2024-03-06 22:21:23'),
(7, '2024-03-06 22:22:21'),
(8, '2024-03-06 22:22:56'),
(9, '2024-03-06 22:25:56'),
(10, '2024-03-06 22:26:11'),
(11, '2024-03-06 22:34:45'),
(12, '2024-03-06 22:35:12'),
(13, '2024-03-06 22:49:26'),
(14, '2024-03-06 22:52:26'),
(15, '2024-03-06 22:52:51'),
(16, '2024-03-06 22:53:13'),
(17, '2024-03-06 22:53:45'),
(18, '2024-03-06 22:54:42'),
(19, '2024-03-06 22:55:49'),
(20, '2024-03-06 22:55:58'),
(21, '2024-03-06 22:58:23'),
(22, '2024-03-06 22:58:38'),
(23, '2024-03-06 22:58:47'),
(24, '2024-03-06 22:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `logo`
--

CREATE TABLE `logo` (
  `logo_id` smallint(5) NOT NULL,
  `logo` text NOT NULL,
  `date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `logo`
--

INSERT INTO `logo` (`logo_id`, `logo`, `date`) VALUES
(1, 'logo1.png', '2024-01-17');

-- --------------------------------------------------------

--
-- Table structure for table `point`
--

CREATE TABLE `point` (
  `id` tinyint(1) NOT NULL,
  `point` int(5) NOT NULL,
  `update_point` time NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point`
--

INSERT INTO `point` (`id`, `point`, `update_point`) VALUES
(1, 10000, '00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `point_transactions`
--

CREATE TABLE `point_transactions` (
  `tran_id` smallint(5) NOT NULL,
  `user_id` smallint(5) NOT NULL,
  `res_id` smallint(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `point_earn` int(5) NOT NULL,
  `bank_name` varchar(50) NOT NULL,
  `point_img` text NOT NULL,
  `status` varchar(7) NOT NULL,
  `tran_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `point_transactions`
--

INSERT INTO `point_transactions` (`tran_id`, `user_id`, `res_id`, `name`, `email`, `point_earn`, `bank_name`, `point_img`, `status`, `tran_date`) VALUES
(1, 2, 0, 'นายภากร', 'phakorn@gmail.com', 2250, 'ธนาคารกรุงไทย', 'point-1709765530414.jpg', 'Order', '2024-03-07'),
(2, 2, 0, 'นายภากร', 'phakorn@gmail.com', 1250, 'ธนาคารกรุงไทย', 'point-1709765545151.jpg', 'Order', '2024-03-07');

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `pro_id` smallint(5) NOT NULL,
  `id_pro` smallint(5) NOT NULL,
  `id_restb` smallint(5) NOT NULL,
  `pro_name` varchar(50) NOT NULL,
  `pro_type` varchar(50) NOT NULL,
  `pro_detail` varchar(150) NOT NULL,
  `pro_price` int(5) NOT NULL,
  `pro_amount` smallint(5) NOT NULL,
  `like` smallint(5) NOT NULL,
  `boost` smallint(5) NOT NULL,
  `status` varchar(5) NOT NULL,
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
(1, 1, 1, 'เงินเดือนออกก็ออกมากิน !! ', 'ประเภทราคาพิเศษ', '✨  เงินเดือนออก 🥢เย็นนี้เจอกันที่กั๊ตจังนะคะ \r\n🥓เราคัดสรร วัตถุดิบ สด สะอาด ใหม่ทุกวันค่ะ 🥬\r\n🕑 : เวลาเปิด-ปิด 11:00- 22:00 น.\r\n☎️ : 083-2091112 ', 650, 5, 0, 0, 'Order', 'imageFood-1709764828782.jpg', '2024-03-06', '2024-03-20', '17:40:00', '23:00:00'),
(2, 2, 1, 'โปรเนื้อน่องลายพิเศษ 199', 'โปรโมชั่นส่วนลดพิเศษ', 'โปรเนื้อน่องลายพิเศษ 199 บาท ในราคา 150 แต้ม', 150, 5, 1, 0, 'Order', 'imageFood-1709764881383.jpg', '2024-03-07', '2024-03-09', '07:00:00', '07:00:00'),
(3, 3, 1, 'ไข่เจียวทานฟรี', 'ประเภทกินฟรี', 'สำหรับ คนแก่ คนท้อง ผู้พิการ คนยากไร้ ทานฟรี \r\nถึงสินเดือนนี้ 31 มีนาคม', 0, 10, 0, 0, 'Order', 'imageFood-1709764965334.jpg', '2024-03-07', '2024-03-31', '10:00:00', '16:00:00'),
(4, 4, 1, 'อาหารเช้าแถมไส้กรอก', 'ประเภท1แถม1', 'อาหารเช้าแถมไส้กรอก ในราคา 599 สำหรับ สั่ง 3 ท่าน จาก 1,599 ', 599, 3, 0, 0, 'Order', 'imageFood-1709765039705.jpg', '2024-03-07', '2024-03-16', '05:50:00', '22:00:00'),
(5, 5, 1, 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน', 'ประเภทแลกของฟรี', 'มากันครบ 4 แลก สิทธิ์ ชีสฟรีที่โต๊ะ 1 ก้อน\r\nโดยใช้ แต้ม 1000 แต้ม แลกเพิ่มอีก 3 ก้อน', 1000, 5, 0, 0, 'Order', 'imageFood-1709765358577.jpg', '2024-03-07', '2024-03-15', '07:50:00', '16:00:00'),
(6, 6, 1, 'กะเพราถาดยักษ์', 'ประเภทราคาพิเศษ', 'กะเพราถาดยักษ์ 800 แต้ม  สำหรับ 4 ท่านขึ้นไป', 800, 5, 0, 0, 'Order', 'imageFood-1709765897959.jpg', '2024-03-07', '2024-03-30', '07:00:00', '17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `res_id` smallint(5) NOT NULL,
  `id_res` smallint(5) NOT NULL,
  `id_usertb` smallint(5) NOT NULL,
  `res_name` varchar(50) NOT NULL,
  `res_email` varchar(50) NOT NULL,
  `res_address` text NOT NULL,
  `res_phone` varchar(10) NOT NULL,
  `res_status_resturant` varchar(50) NOT NULL,
  `res_owner_profile` varchar(6) NOT NULL,
  `res_owner_name` varchar(50) NOT NULL,
  `res_owner_lnam` varchar(50) NOT NULL,
  `res_owner_phone` varchar(10) NOT NULL,
  `res_owner_email` varchar(50) NOT NULL,
  `res_profile` text NOT NULL,
  `res_certificate` text NOT NULL,
  `status` varchar(7) NOT NULL,
  `time_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`res_id`, `id_res`, `id_usertb`, `res_name`, `res_email`, `res_address`, `res_phone`, `res_status_resturant`, `res_owner_profile`, `res_owner_name`, `res_owner_lnam`, `res_owner_phone`, `res_owner_email`, `res_profile`, `res_certificate`, `status`, `time_current`, `time_update`) VALUES
(1, 1, 3, 'ร้านอาหาร กั๊ตจัง ชาบู หมูจุ่ม & สุกี้', 'gutjung@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2312.1767600434255!2d99.00970549377713!3d18.75794231828716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da301f15f2efd5%3A0xc26d85bab858a381!2z4Lij4LmJ4Liy4LiZ4Lit4Liy4Lir4Liy4LijIOC4geC4seC5iuC4leC4iOC4seC4hyDguIrguLLguJrguLkg4Lir4Lih4Li54LiI4Li44LmI4LihICYg4Liq4Li44LiB4Li14LmJ!5e0!3m2!1sth!2sth!4v1709763545224!5m2!1sth!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0953589978', 'ร้านบุฟเฟต์', 'นางสาว', 'วริศรา', 'ยานะจิต', '0953589978', 'warisara@gmail.com', 'ProfileRes-1709763811019.jpg', 'image-1709763683229.jpg', 'success', '2024-03-06 22:21:23', '2024-03-06 22:23:31'),
(2, 2, 4, 'อิ่มดี-อาหารตามสั่ง', 'nungnin9@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!3m2!1sth!2sth!4v1709764433709!5m2!1sth!2sth!6m8!1m7!1sHOTWi2XM1aub1UkPpzoG7g!2m2!1d18.75339061763473!2d99.01659930484716!3f154.49244812066206!4f1.1623359367258672!5f0.7820865974627469\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0979682017', 'ร้านอาหารตามสั่ง', 'นาง', 'นันทิกา', 'ชนันกุล', '0871778527', 'nungnin9@gmail.com', 'NULL', 'image-1709764485647.jpg', 'process', '2024-03-06 22:34:45', '2024-03-06 22:34:45');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` smallint(5) NOT NULL,
  `id_user` smallint(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `level` varchar(1) NOT NULL,
  `status` varchar(7) NOT NULL,
  `Profile` text NOT NULL,
  `address` text NOT NULL,
  `user_point` int(7) NOT NULL,
  `id_restb` smallint(5) NOT NULL,
  `time_current` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `id_user`, `username`, `password`, `fname`, `lname`, `email`, `phone`, `level`, `status`, `Profile`, `address`, `user_point`, `id_restb`, `time_current`, `time_update`) VALUES
(1, 1, 'admin', '$2b$12$XC6dI0qOJMQ06AOv14ZD1.SlVSiBgf297Jy1dUzRvK9vGiLRvL3ka', 'admin', 'admin', 'admin@gmail.com', '0953582237', 'A', 'success', 'NULL', 'NULL', 0, 0, '2024-03-06 07:54:15', '2024-03-06 07:54:15'),
(2, 2, 'hut', '$2b$12$2OZ5Ucx63QMHeNp.vublE.EMLTkZqdwNSf0kvyuLi1azG7NMg554i', 'นายภากร', 'คำเขียว', 'phakorn@gmail.com', '0953588974', 'U', 'success', 'Profile-1709765512968.jpg', '40/10 หมู่4 ซอย3 อ.เมือง จ.เชียงใหม่ ต.หนองหอย', 0, 0, '2024-03-06 22:16:39', '2024-03-06 22:55:15'),
(3, 3, 'warisara', '$2b$12$SS8MTsqX0UyLBb.sRkYASO4QHy3N8A28WPZ.a4CURtnn4MqVDdWR.', 'นางสาววริศรา', 'ยานะจิต', 'warisara@gmail.com', '0958974456', 'R', 'success', 'Profile-1709763774362.jpg', '99/1 บ้านเบ้อหมู่5 ซอย4 ต.สันผักหวาน อ.หางดง', 500, 1, '2024-03-06 22:17:57', '2024-03-06 22:52:44'),
(4, 4, 'eimd', '$2b$12$1xk6ovsvLxCuTL1ZtZo9s.CZTfBtAEYhLSYQz13yEczBxLeXYmz7K', 'นันทิกา', 'ชนันกุล', 'nuntiga@gmail.com', '0871778527', 'U', 'process', 'NULL', 'NULL', 1000, 2, '2024-03-06 22:32:48', '2024-03-06 22:52:49');

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
  MODIFY `banner_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `boostpromote`
--
ALTER TABLE `boostpromote`
  MODIFY `boost_id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `cu_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `coupon_user`
--
ALTER TABLE `coupon_user`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `historyviews`
--
ALTER TABLE `historyviews`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `logo`
--
ALTER TABLE `logo`
  MODIFY `logo_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point`
--
ALTER TABLE `point`
  MODIFY `id` tinyint(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `point_transactions`
--
ALTER TABLE `point_transactions`
  MODIFY `tran_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `pro_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `res_id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
