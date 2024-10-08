import {
	boolean,
	datetime,
	int,
	mysqlTable,
	text,
	varchar,
} from 'drizzle-orm/mysql-core';

export const vehicle = mysqlTable('vehicles', {
	id: int('id').primaryKey(),
	vehicle_id: varchar('vehicle_id', { length: 64 }).notNull(),
	color: varchar('color', { length: 20 }),
	category: varchar('category', { length: 15 }),
	plate_number: varchar('plate_number', { length: 15 }),
	image: text('image'),
	user_role: varchar('user_role', { length: 15 }),
	user_id: varchar('user_id', { length: 64 }).notNull(),
	blacklisted: boolean('blacklisted').notNull().default(false),
	current_driver: varchar('current_driver', { length: 64 }), // Assuming driver IDs are longer
	status: varchar('status', { length: 10 }),
	deleted: boolean('deleted').notNull().default(false),
	vehicle_type: varchar('vehicle_type', { length: 10 }),
	vin: varchar('vin', { length: 32 }),
	barcode_string: varchar('barcode_string', { length: 32 }),
	owners_phone_number: varchar('owners_phone_number', { length: 20 }),
	owners_name: varchar('owners_name', { length: 64 }),
	tracker_id: varchar('tracker_id', { length: 64 }).notNull(),
	createdAt: datetime('createdAt').notNull(),
	updatedAt: datetime('updatedAt').notNull(),
});

export const vehicle_balance = mysqlTable('vehicle_balance', {
	id: int('id').primaryKey(),
	vehicle_balance_id: varchar('vehicle_id', { length: 64 }).notNull(),
	vehicle_id: varchar('vehicle_id', { length: 64 }).notNull(),
	wallet_balance: varchar('color', { length: 20 }),
	deficit_balance: varchar('category', { length: 15 }),
	net_total: varchar('plate_number', { length: 15 }),
	next_transaction_date: text('image'),
	createdAt: datetime('createdAt').notNull(),
	updatedAt: datetime('updatedAt').notNull(),
});
