-- Odoo IMS Seed Data
-- Updated for new schema with quantity tracking

USE ims_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE OrderLines;
TRUNCATE TABLE StockQuants;
TRUNCATE TABLE StockMoves;
TRUNCATE TABLE Locations;
TRUNCATE TABLE Warehouses;
TRUNCATE TABLE Products;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Users (passwords are hashed 'password123')
INSERT INTO Users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$rVQZJZjZxJxJxJxJxJxJxeGKqGqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'Manager'),
('Staff User', 'staff@example.com', '$2a$10$rVQZJZjZxJxJxJxJxJxJxeGKqGqGqGqGqGqGqGqGqGqGqGqGqGqGqG', 'Staff');

-- Insert Warehouses
INSERT INTO Warehouses (name, address) VALUES
('Main Warehouse', '123 Industrial Ave, City'),
('Branch Warehouse', '456 Commerce St, Town');

-- Insert Locations
INSERT INTO Locations (warehouse_id, name, type) VALUES
(1, 'Main Store', 'Internal'),
(1, 'Production Floor', 'Internal'),
(1, 'Quality Check Area', 'Internal'),
(2, 'Branch Storage', 'Internal'),
(NULL, 'Vendors', 'Vendor'),
(NULL, 'Customers', 'Customer'),
(NULL, 'Scrap/Damage', 'Inventory Loss');

-- Insert Products (with quantity and unit_cost)
INSERT INTO Products (name, sku, category, uom, quantity, unit_cost, description) VALUES
('Steel Rod', 'SR-001', 'Raw Material', 'kg', 100, 150.00, 'High quality steel rod for manufacturing'),
('Office Chair', 'OC-001', 'Furniture', 'Unit', 50, 2500.00, 'Ergonomic office chair'),
('Desk Lamp', 'DL-001', 'Electronics', 'Unit', 75, 500.00, 'LED desk lamp with adjustable brightness'),
('A4 Paper', 'AP-001', 'Stationery', 'Ream', 200, 250.00, 'Premium white A4 paper, 500 sheets per ream');

-- Initial Stock in locations (using StockQuants)
INSERT INTO StockQuants (product_id, location_id, quantity) VALUES
(1, 1, 100),  -- 100 kg Steel Rod in Main Store
(2, 1, 30),   -- 30 Office Chairs in Main Store
(2, 4, 20),   -- 20 Office Chairs in Branch Storage
(3, 1, 50),   -- 50 Desk Lamps in Main Store
(3, 2, 25),   -- 25 Desk Lamps in Production Floor
(4, 1, 200);  -- 200 Reams A4 Paper in Main Store

-- Sample Stock Moves (initial history)
INSERT INTO StockMoves (product_id, source_location_id, dest_location_id, quantity, type, status, reference, createdAt) VALUES
-- Receipts from vendors
(1, 5, 1, 100, 'IN', 'Done', 'REC/001', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 5, 1, 50, 'IN', 'Done', 'REC/002', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(3, 5, 1, 75, 'IN', 'Done', 'REC/003', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 5, 1, 200, 'IN', 'Done', 'REC/004', DATE_SUB(NOW(), INTERVAL 4 DAY)),

-- Internal Transfers
(2, 1, 4, 20, 'INT', 'Done', 'INT/001', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 1, 2, 25, 'INT', 'Done', 'INT/002', DATE_SUB(NOW(), INTERVAL 2 DAY)),

-- Deliveries to customers
(2, 4, 6, 5, 'OUT', 'Done', 'DEL/001', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Sample pending operations (Draft status)
INSERT INTO StockMoves (product_id, source_location_id, dest_location_id, quantity, type, status, reference, responsible, schedule_date) VALUES
(1, 5, 1, 50, 'IN', 'Draft', 'REC/005', 'John Doe', DATE_ADD(NOW(), INTERVAL 2 DAY)),
(3, 1, 6, 10, 'OUT', 'Waiting', 'DEL/002', 'Jane Smith', DATE_ADD(NOW(), INTERVAL 1 DAY));
