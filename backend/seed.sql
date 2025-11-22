-- Create Database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ims_db;
USE ims_db;

-- Insert Users (Password is 'password123' - hash generated for example)
-- Note: You might need to generate a fresh hash if using a specific bcrypt version/salt
INSERT INTO Users (name, email, password, role, createdAt, updatedAt) VALUES 
('Admin User', 'admin@example.com', '$2a$10$x.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'Manager', NOW(), NOW()),
('Staff User', 'staff@example.com', '$2a$10$x.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z.z', 'Staff', NOW(), NOW());

-- Insert Warehouses
INSERT INTO Warehouses (name, address, createdAt, updatedAt) VALUES 
('Main Warehouse', '123 Industrial Park, City', NOW(), NOW()),
('Secondary Warehouse', '456 Logistics Way, Town', NOW(), NOW());

-- Insert Locations
-- Assuming Warehouse IDs are 1 and 2
INSERT INTO Locations (warehouse_id, name, type, createdAt, updatedAt) VALUES 
(1, 'Stock', 'Internal', NOW(), NOW()),
(1, 'Production', 'Internal', NOW(), NOW()),
(1, 'Vendor', 'Vendor', NOW(), NOW()),
(1, 'Customer', 'Customer', NOW(), NOW()),
(1, 'Inventory Loss', 'Inventory Loss', NOW(), NOW()),
(2, 'Stock', 'Internal', NOW(), NOW());

-- Insert Products
INSERT INTO Products (name, sku, category, uom, description, createdAt, updatedAt) VALUES 
('Steel Rod', 'SR-001', 'Raw Material', 'kg', 'High quality steel rod', NOW(), NOW()),
('Office Chair', 'FUR-001', 'Furniture', 'Unit', 'Ergonomic office chair', NOW(), NOW()),
('Wooden Plank', 'WP-100', 'Raw Material', 'Unit', 'Teak wood plank', NOW(), NOW()),
('Paint Bucket', 'PNT-20', 'Consumable', 'Liter', 'Blue wall paint', NOW(), NOW());

-- Insert Initial Stock (via StockMoves)
-- Receiving 100kg Steel Rods from Vendor to Stock
INSERT INTO StockMoves (product_id, source_location_id, dest_location_id, quantity, type, status, reference, createdAt, updatedAt) VALUES 
(1, 3, 1, 100, 'IN', 'Done', 'REC/001', NOW(), NOW());

-- Receiving 50 Chairs from Vendor to Stock
INSERT INTO StockMoves (product_id, source_location_id, dest_location_id, quantity, type, status, reference, createdAt, updatedAt) VALUES 
(2, 3, 1, 50, 'IN', 'Done', 'REC/002', NOW(), NOW());
