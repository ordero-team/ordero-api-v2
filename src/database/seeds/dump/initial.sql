SET
	FOREIGN_KEY_CHECKS = 0;

-- Dumping data for table `role`
INSERT INTO
	`role` (`id`, `slug`, `permissions`, `created_at`)
VALUES
	(
		'01EP4ZDWCZCHVFA1ZHV13YGRJZ',
		'owner',
		'["owner_profile@read", "owner_profile@create", "owner_profile@update", "owner_profile@delete", "owner_restaurant@read", "owner_restaurant@create", "owner_restaurant@update", "owner_restaurant@delete", "owner_dashboard@read", "owner_dashboard@create", "owner_dashboard@update", "owner_dashboard@delete", "owner_staff@read", "owner_staff@create", "owner_staff@update", "owner_staff@delete", "owner_role@read", "owner_role@create", "owner_role@update", "owner_role@delete", "owner_location@read", "owner_location@create", "owner_location@update", "owner_location@delete", "owner_table@read", "owner_table@create", "owner_table@update", "owner_table@delete", "owner_category@read", "owner_category@create", "owner_category@update", "owner_category@delete", "owner_variant@read", "owner_variant@create", "owner_variant@update", "owner_variant@delete", "owner_product@read", "owner_product@create", "owner_product@update", "owner_product@delete", "owner_stock@read", "owner_stock@create", "owner_stock@update", "owner_stock@delete", "owner_order@read", "owner_order@create", "owner_order@update", "owner_order@delete", "owner_notification@read", "owner_notification@create", "owner_notification@update", "owner_notification@delete"]',
		'2023-01-06 16:00:00.501148'
	);

INSERT INTO
	`staff_role` (
		`id`,
		`created_at`,
		`updated_at`,
		`slug`,
		`permissions`,
		`is_default`
	)
VALUES
	(
		'01J1QHZNYKXAFHTAX7WX1Z3K1W',
		'2024-07-01 23:41:25.000000',
		'2024-08-10 20:34:01.173032',
		'cashier',
		'[
    "staff_profile@create",
    "staff_profile@read",
    "staff_profile@update",
    "staff_profile@delete",
    "staff_restaurant@create",
    "staff_restaurant@read",
    "staff_restaurant@update",
    "staff_restaurant@delete",
    "staff_dashboard@create",
    "staff_dashboard@read",
    "staff_dashboard@update",
    "staff_dashboard@delete",
    "staff_role@create",
    "staff_role@read",
    "staff_role@update",
    "staff_role@delete",
    "staff_location@create",
    "staff_location@read",
    "staff_location@update",
    "staff_location@delete",
    "staff_table@create",
    "staff_table@read",
    "staff_table@update",
    "staff_table@delete",
    "staff_category@create",
    "staff_category@read",
    "staff_category@update",
    "staff_category@delete",
    "staff_variant@create",
    "staff_variant@read",
    "staff_variant@update",
    "staff_variant@delete",
    "staff_product@create",
    "staff_product@read",
    "staff_product@update",
    "staff_product@delete",
    "staff_stock@create",
    "staff_stock@read",
    "staff_stock@update",
    "staff_stock@delete",
    "staff_order@create",
    "staff_order@read",
    "staff_order@update",
    "staff_order@delete",
    "staff_notification@create",
    "staff_notification@read",
    "staff_notification@update",
    "staff_notification@delete"
]',
		1
	);

-- Dumping data for table `owner`
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
		'owner@shimy.com',
		'+6281931006841',
		'$2a$10$9/R3pR5rP1gnnG0n06pbEORY39fXfuJ2.eJkdqvoi5oDScm1gcHRi',
		NULL,
		'verify',
		NULL,
		NULL,
		'2023-01-06 16:00:00.501148',
		'01F2KFTXX9W2Y630FKYSSC9NSQ'
	);

-- Dumping data for table `restaurant`
INSERT INTO
	`restaurant` (
		`id`,
		`name`,
		`slug`,
		`email`,
		`phone`,
		`website`,
		`status`,
		`description`,
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
		'',
		'2023-01-06 16:00:00.501148',
		'01F2KFTXZNS01CJQCGNPJKXA1N'
	);