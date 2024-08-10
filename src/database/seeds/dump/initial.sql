SET
	FOREIGN_KEY_CHECKS = 0;

--
-- Dumping data for table `role`
--
INSERT INTO
	`role` (`id`, `slug`, `permissions`, `created_at`)
VALUES
	(
		'01EP4ZDWCZCHVFA1ZHV13YGRJZ',
		'owner',
		'[\"owner_role@read\", \"owner_role@create\", \"owner_role@update\", \"owner_role@delete\", \"owner_restaurant@read\", \"owner_restaurant@create\", \"owner_restaurant@update\", \"owner_restaurant@delete\", \"owner_profile@read\", \"owner_profile@create\", \"owner_profile@update\", \"owner_profile@delete\", \"owner_staff@read\", \"owner_staff@create\", \"owner_staff@update\", \"owner_staff@delete\", \"owner_location@read\", \"owner_location@create\", \"owner_location@update\", \"owner_location@delete\", \"owner_table@read\", \"owner_table@create\", \"owner_table@update\", \"owner_table@delete\", \"owner_category@read\", \"owner_category@create\", \"owner_category@update\", \"owner_category@delete\", \"owner_variant@read\", \"owner_variant@create\", \"owner_variant@update\", \"owner_variant@delete\", \"owner_product@read\", \"owner_product@create\", \"owner_product@update\", \"owner_product@delete\", \"owner_stock@read\", \"owner_stock@create\", \"owner_stock@update\", \"owner_stock@delete\", \"owner_order@read\", \"owner_order@create\", \"owner_order@update\", \"owner_order@delete\", \"owner_dashboard@read\", \"owner_dashboard@create\", \"owner_dashboard@update\", \"owner_dashboard@delete\"]'
		'2023-01-06 16:00:00.501148'
	);

--
-- Dumping data for table `owner`
--
INSERT INTO
	`owner` (
		`id`,
		`name`,
		`email`,
		`phone`,
		`password`,
		`verification_code`,
		`status`,
		`verified_at`,
		`last_login_at`,
		`created_at`,
		`restaurant_id`
	)
VALUES
	(
		'01F2KFTXZNS01CJQCGNPJKXA1N',
		'Yudha',
		'owner@yuppey.com',
		'+6281931006841',
		'$2a$10$9/R3pR5rP1gnnG0n06pbEORY39fXfuJ2.eJkdqvoi5oDScm1gcHRi',
		NULL,
		'verify',
		NULL,
		NULL,
		'2023-01-06 16:00:00.501148',
		'01F2KFTXX9W2Y630FKYSSC9NSQ'
	);

--
-- Dumping data for table `restaurant`
--
INSERT INTO
	`restaurant` (
		`id`,
		`name`,
		`slug`,
		`email`,
		`phone`,
		`website`,
		`status`,
		`created_at`,
		`owner_id`
	)
VALUES
	(
		'01F2KFTXX9W2Y630FKYSSC9NSQ',
		'Yuppey',
		'yuppey',
		NULL,
		NULL,
		NULL,
		'active',
		'2023-01-06 16:00:00.501148',
		'01F2KFTXZNS01CJQCGNPJKXA1N'
	);