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
		'[\"role@read\",\"role@create\",\"role@update\",\"role@delete\",\"restaurant@read\",\"restaurant@create\",\"restaurant@update\",\"restaurant@delete\",\"profile@read\",\"profile@create\",\"profile@update\",\"profile@delete\",\"staff@read\",\"staff@create\",\"staff@update\",\"staff@delete\",\"location@read\",\"location@create\",\"location@update\",\"location@delete\",\"table@read\",\"table@create\",\"table@update\",\"table@delete\",\"category@read\",\"category@create\",\"category@update\",\"category@delete\",\"variant@read\",\"variant@create\",\"variant@update\",\"variant@delete\",\"product@read\",\"product@create\",\"product@update\",\"product@delete\",\"stock@read\",\"stock@create\",\"stock@update\",\"stock@delete\",\"order@read\",\"order@create\",\"order@update\",\"order@delete\"]',
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