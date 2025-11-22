-- Odoo IMS Database Schema
-- Updated with workflow management and stock tracking

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS OrderLines;
DROP TABLE IF EXISTS StockQuants;
DROP TABLE IF EXISTS StockMoves;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Warehouses;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Users;

-- Users Table
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Manager', 'Staff') DEFAULT 'Staff',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table (with quantity and unit_cost)
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  uom VARCHAR(50) DEFAULT 'Unit',
  quantity INT DEFAULT 0 NOT NULL,
  unit_cost DECIMAL(10,2) DEFAULT 0.00,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Warehouses Table
CREATE TABLE Warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Locations Table
CREATE TABLE Locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT,
  name VARCHAR(255) NOT NULL,
  type ENUM('Internal', 'Customer', 'Vendor', 'Inventory Loss') DEFAULT 'Internal',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES Warehouses(id) ON DELETE SET NULL
);

-- StockMoves Table (with workflow status and scheduling)
CREATE TABLE StockMoves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  source_location_id INT,
  dest_location_id INT,
  quantity FLOAT NOT NULL,
  type ENUM('IN', 'OUT', 'INT', 'ADJ') NOT NULL,
  status ENUM('Draft', 'Waiting', 'Ready', 'Done', 'Cancelled') DEFAULT 'Draft',
  reference VARCHAR(255),
  responsible VARCHAR(255),
  schedule_date DATETIME,
  delivery_address TEXT,
  contact_person VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  FOREIGN KEY (source_location_id) REFERENCES Locations(id) ON DELETE SET NULL,
  FOREIGN KEY (dest_location_id) REFERENCES Locations(id) ON DELETE SET NULL
);

-- OrderLines Table (for multi-product operations)
CREATE TABLE OrderLines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  stock_move_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) DEFAULT 0.00,
  subtotal DECIMAL(10,2) DEFAULT 0.00,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (stock_move_id) REFERENCES StockMoves(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);

-- StockQuants Table (tracks quantity per product per location)
CREATE TABLE StockQuants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT DEFAULT 0 NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_location (product_id, location_id)
);

-- Indexes for better performance
CREATE INDEX idx_products_sku ON Products(sku);
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_stockmoves_type ON StockMoves(type);
CREATE INDEX idx_stockmoves_status ON StockMoves(status);
CREATE INDEX idx_stockmoves_reference ON StockMoves(reference);
CREATE INDEX idx_stockquants_product ON StockQuants(product_id);
CREATE INDEX idx_stockquants_location ON StockQuants(location_id);
