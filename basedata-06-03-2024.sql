-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2024 at 08:58 AM
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
(3, '2024-03-06 07:53:33');

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
(1, 1, 'admin', '$2b$12$XC6dI0qOJMQ06AOv14ZD1.SlVSiBgf297Jy1dUzRvK9vGiLRvL3ka', 'admin', 'admin', 'admin@gmail.com', '0953582237', 'A', 'success', 'NULL', 'NULL', 0, 0, '2024-03-06 07:54:15', '2024-03-06 07:54:15');

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
  MODIFY `cu_id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coupon_user`
--
ALTER TABLE `coupon_user`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `historyviews`
--
ALTER TABLE `historyviews`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `tran_id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promotion`
--
ALTER TABLE `promotion`
  MODIFY `pro_id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `res_id` smallint(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` smallint(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
