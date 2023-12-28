--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `created_at`, `code`, `name`, `description`) VALUES
('01GA8ANZBGS57WNG9KPERKHQX8', '2022-08-12 06:08:21.380182', 'travel', 'Asuransi Perjalanan', 'Lorem ipsum dolor sit amet');

--
-- Dumping data for table `provider`
--

INSERT INTO `provider` (`id`, `created_at`, `code`, `name`, `email`, `phone`) VALUES
('01GA89DRGBTPSRHXG4344EZC45', '2022-08-12 05:46:23.650390', 'sompo', 'PT Asuransi SOMPO', 'support@sompo.com', '+628118500889'),
('01GA8FBHDA2EB3GXW0MWHT8ZSC', '2022-08-12 07:30:02.320454', 'axa', 'PT Mandiri AXA General Insurance', 'customer.general@axa-mandiri.co.id', '1500733');

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `created_at`, `api_key`, `email`, `name`, `password`, `phone`, `reset_token`, `verification_token`, `verified_at`, `status`) VALUES
('01GA7W7FP6FH1RK4V77M8ZB3DJ', '2022-08-12 01:55:46.538717', 'ASKT-KEY-V5C518LeJdeB2bDRDtJh9D', 'gaghan430@gmail.com', 'Dodik Gaghan', '$2a$10$d4poVM61VRxegwUxYDMqIeWV45ESvAbNtOLnVs4xglJQOsk3wwmou', '+6281230420110', NULL, NULL, '2022-08-12 01:58:34', 'active');

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `created_at`, `code`, `name`, `description`, `broker`, `category_id`, `provider_id`) VALUES
('01GA9CHGMFN1592AM5W1DG5EVA', '2022-08-12 16:00:06.831337', 'sompo-travel-premiro', 'Auransi Perjalanan', 'Lorem ipsum', 'premiro', '01GA8ANZBGS57WNG9KPERKHQX8', '01GA89DRGBTPSRHXG4344EZC45');

--
-- Dumping data for table `product_variant`
--

INSERT INTO `product_variant` (`id`, `created_at`, `code`, `name`, `price`, `level`, `status`, `product_id`) VALUES
('01GA9CHGMWNTDJ9JT9CZQABW5P', '2022-08-12 16:00:06.842737', 'economy', 'Ekonomi', '2500.00', 0, 'active', '01GA9CHGMFN1592AM5W1DG5EVA'),
('01GA9CHGN6YH729Y9SZBACK1T2', '2022-08-12 16:00:06.851348', 'business', 'Bisnis', '3500.00', 1, 'active', '01GA9CHGMFN1592AM5W1DG5EVA'),
('01GA9CHGNFT6VZMBD8EPVZ8RVH', '2022-08-12 16:00:06.860703', 'executive', 'Eksekutif', '4500.00', 3, 'active', '01GA9CHGMFN1592AM5W1DG5EVA');
