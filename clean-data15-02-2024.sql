-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2024 at 11:19 PM
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
(1, 'banner-1705440926839.jpg', '2024-01-17');

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
(2, '2024-02-14 22:18:33');

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
(1, 'logo1.png', '2024-01-17');

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
(1, 100000, '00:00:00');

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
(2, 2, 4, 'อิ่มดี อาหารตามสั่ง', 'eimdee@gmail.com', '<iframe src=\"https://www.google.com/maps/embed?pb=!3m2!1sth!2sth!4v1706041586244!5m2!1sth!2sth!6m8!1m7!1s5y3Z8dz1T7vSTyA0PKLqbQ!2m2!1d18.75310814939448!2d99.01659854600113!3f79.40173313798459!4f5.2713443604833685!5f0.7820865974627469\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>', '0979682017', 'ร้านอาหารตามสั่ง', 'นาง', 'พร', 'จำแลงรัตน์', '0953582234', 'porn@gmail.com', 'NULL', 'image-1706041668785.jpg', 'success', '2024-01-23 20:27:48', '2024-01-23 20:28:01');

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
(2, 2, 'test', '$2b$12$LF.qrMimZOil8nNes0Svm.AVGotZsuXQVFdzQ.DsgW3gSI3Edo2Ma', 'test', 'test', 'test@gmail.com', '0958795531', 'U', 'success', 'Profile-1707863755044.jpg', 'อิอิ', 37276, 0, '2024-01-23 19:44:05', '2024-02-14 17:17:25'),
(3, 3, 'testresturant', '$2b$12$dqISJAbwtF8hNO.FwOIr7uLulDcdxHBXwjwr9a5/z6I1V9Wtj85Sy', 'testresturant', 'testresturant', 'testresturant@gmail.com', '0953582238', 'R', 'success', 'NULL', 'NULL', 200, 1, '2024-01-23 19:44:53', '2024-02-14 22:08:58'),
(4, 4, 'resturant', '$2b$12$1lyyNRq78RBB.9cfBq1rb.lFv2ovLa74mDj136nmZmhMyyQ.ThmVu', 'resturant', 'resturant', 'resturant@gmail.com', '0958974456', 'R', 'success', 'NULL', 'NULL', 0, 2, '2024-01-23 20:22:18', '2024-02-14 21:18:26');

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
  MODIFY `cu_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_user`
--
ALTER TABLE `coupon_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historyviews`
--
ALTER TABLE `historyviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `tran_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `pro_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `res_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
