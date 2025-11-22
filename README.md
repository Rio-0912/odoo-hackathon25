# Odoo IMS - Inventory Management System

A modern, full-stack Inventory Management System built with Next.js and Express, designed for the Odoo Hackathon.

![Odoo IMS](https://img.shields.io/badge/Odoo-IMS-714B67?style=for-the-badge&logo=odoo&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Contributing](#contributing)

---

## 🎯 Overview

Odoo IMS is a comprehensive inventory management solution that digitizes and streamlines all stock-related operations within a business. It replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

### Target Users
- **Inventory Managers** - Manage incoming & outgoing stock
- **Warehouse Staff** - Perform transfers, picking, shelving, and counting

---

## ✨ Features

### Authentication
- ✅ User Sign Up / Login
- ✅ Session Management
- ✅ Role-based Access (Manager/Staff)

### Dashboard
- ✅ **Real-time KPIs:**
  - Total Products in Stock
  - Low Stock / Out of Stock Items
  - Pending Receipts
  - Pending Deliveries
- ✅ Recent Activity Feed
- ✅ Dynamic Filters

### Product Management
- ✅ Create/Update Products
- ✅ Product Categories
- ✅ Stock Availability per Location
- ✅ SKU Search & Smart Filters
- ✅ Unit of Measure (UoM)

### Operations
- ✅ **Receipts** (Incoming Stock from Vendors)
- ✅ **Delivery Orders** (Outgoing Stock to Customers)
- ✅ **Internal Transfers** (Between Warehouses/Locations)
- ✅ **Inventory Adjustments** (Stock Corrections)
- ✅ Move History & Tracking

### Additional Features
- ✅ Multi-warehouse Support
- ✅ Location Management
- ✅ Modern UI with Shadcn Dashboard Components
- ✅ Odoo Purple/Teal Theme
- ✅ Responsive Design

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript (JSX)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (dashboard-01 template)
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** MySQL
- **Authentication:** Simple session-based (no JWT)

### Development Tools
- **Dev Server:** Nodemon
- **Package Manager:** npm
- **Version Control:** Git

---

## 📁 Project Structure

```
odoo/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD
│   │   ├── operationController.js # Stock operations
│   │   └── dashboardController.js # Dashboard KPIs
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Product.js           # Product model
│   │   ├── Warehouse.js         # Warehouse model
│   │   ├── Location.js          # Location model
│   │   └── StockMove.js         # Stock movement model
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── operationRoutes.js
│   │   └── dashboardRoutes.js
│   ├── schema.sql               # Database schema
│   ├── seed_node.js             # Database seeding script
│   ├── list_users.js            # User listing utility
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.jsx
│   │   │   │   └── signup/page.jsx
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── products/page.jsx
│   │   │   ├── operations/page.jsx
│   │   │   ├── settings/page.jsx
│   │   │   ├── page.jsx         # Landing page
│   │   │   ├── layout.js        # Root layout
│   │   │   └── globals.css      # Global styles
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn UI components
│   │   │   ├── forms/           # Form components
│   │   │   ├── app-sidebar.jsx  # Main sidebar
│   │   │   ├── nav-main.jsx     # Main navigation
│   │   │   ├── nav-user.jsx     # User menu
│   │   │   └── site-header.jsx  # Header
│   │   └── lib/
│   │       ├── api.js           # Axios instance
│   │       └── utils.js         # Utility functions
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.mjs
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odoo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file in backend directory**
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ims_db
   JWT_SECRET=your_secret_key
   ```

4. **Create MySQL Database**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE ims_db;
   USE ims_db;
   ```

5. **Run Database Schema**
   ```bash
   # Option 1: Using SQL file
   mysql -u root -p ims_db < schema.sql

   # Option 2: Using Node.js (auto-creates tables)
   # Tables will be created automatically when server starts
   ```

6. **Seed Database with Initial Data**
   ```bash
   node seed_node.js
   ```
   This creates:
   - Admin user: `admin@example.com` / `password123`
   - Staff user: `staff@example.com` / `password123`
   - Sample warehouses and locations
   - Sample products

7. **Start Backend Server**
   ```bash
   nodemon server.js
   # Server will run on http://localhost:5000
   ```

8. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

9. **Start Frontend Development Server**
   ```bash
   npm run dev
   # App will run on http://localhost:3000
   ```

### Verify Installation

Run the user listing script to verify database setup:
```bash
cd backend
node list_users.js
```

Expected output:
```
--- USERS IN DB ---
ID: 1 | Name: Admin User | Email: admin@example.com | Role: Manager
ID: 2 | Name: Staff User | Email: staff@example.com | Role: Staff
-------------------
```

---

## 💻 Usage

### Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Staff Account:**
- Email: `staff@example.com`
- Password: `password123`

### User Flow

1. **Landing Page**: Navigate to `http://localhost:3000`
2. **Login**: Click "Login" and enter credentials
3. **Dashboard**: View KPIs and recent activity
4. **Products**: Manage product catalog
   - Click "Add Product" to create new items
   - Search products by name or SKU
5. **Operations**: Manage stock movements
   - Create Receipts (incoming stock)
   - Create Deliveries (outgoing stock)
   - Create Internal Transfers
   - Create Adjustments
6. **Settings**: Configure warehouses (placeholder)
7. **Logout**: Click user avatar → Log out

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Staff"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "Manager"
  }
}
```

### Products

#### Get All Products
```http
GET /products
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Steel Rod",
  "sku": "SR-001",
  "category": "Raw Material",
  "uom": "kg",
  "description": "High quality steel rod"
}
```

#### Update Product
```http
PUT /products/:id
Content-Type: application/json

{
  "name": "Updated Product Name"
}
```

#### Delete Product
```http
DELETE /products/:id
```

### Operations

#### Get All Operations
```http
GET /operations
```

#### Create Operation
```http
POST /operations
Content-Type: application/json

{
  "type": "IN",
  "product_id": 1,
  "source_location_id": 3,
  "dest_location_id": 1,
  "quantity": 100,
  "reference": "REC/001"
}
```

**Operation Types:**
- `IN` - Receipt (Incoming)
- `OUT` - Delivery (Outgoing)
- `INT` - Internal Transfer
- `ADJ` - Adjustment

### Dashboard

#### Get KPIs
```http
GET /dashboard/kpis
```

Response:
```json
{
  "totalProducts": 4,
  "lowStock": 0,
  "pendingReceipts": 0,
  "pendingDeliveries": 0
}
```

#### Get Recent Activity
```http
GET /dashboard/recent
```

---

## 🗄 Database Schema

### Users
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('Manager', 'Staff') DEFAULT 'Staff',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products
```sql
CREATE TABLE Products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255),
  uom VARCHAR(50) DEFAULT 'Unit',
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Warehouses
```sql
CREATE TABLE Warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Locations
```sql
CREATE TABLE Locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT,
  name VARCHAR(255) NOT NULL,
  type ENUM('Internal', 'Customer', 'Vendor', 'Inventory Loss') DEFAULT 'Internal',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES Warehouses(id)
);
```

### StockMoves
```sql
CREATE TABLE StockMoves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  source_location_id INT,
  dest_location_id INT,
  quantity INT NOT NULL,
  type ENUM('IN', 'OUT', 'INT', 'ADJ') NOT NULL,
  status ENUM('Draft', 'Done', 'Cancelled') DEFAULT 'Done',
  reference VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Products(id),
  FOREIGN KEY (source_location_id) REFERENCES Locations(id),
  FOREIGN KEY (dest_location_id) REFERENCES Locations(id)
);
```

---

## 📸 Screenshots

### Landing Page
Modern landing page with call-to-action buttons

### Dashboard
Real-time KPIs and recent activity tracking

### Products Management
Product catalog with search and create functionality

### Operations
Stock movement management with filtering

---

## 🧪 Testing

### Manual Testing

A comprehensive testing guide is available in the artifacts directory:
- `testing_guide.md` - Complete test cases
- `test_results.md` - Test execution results

### Run Backend API Tests

```bash
cd backend
node test_api.js      # Test registration and login
node test_login.js    # Test login endpoint
node list_users.js    # List all users
```

### Test Coverage

- ✅ Authentication Flow
- ✅ Dashboard KPIs
- ✅ Product CRUD Operations
- ✅ Stock Operations (IN, OUT, INT, ADJ)
- ✅ Navigation & Routing
- ✅ Form Validation
- ✅ API Integration

---

## 🎨 Design System

### Color Palette (Odoo Theme)

- **Primary**: `oklch(0.45 0.1 300)` - Purple
- **Secondary**: `oklch(0.55 0.15 200)` - Teal
- **Sidebar**: `oklch(0.25 0.05 300)` - Dark Purple

### Typography

- **Font Family**: Geist Sans & Geist Mono
- **Headings**: Bold, tracking-tight
- **Body**: Regular weight

---

## 🤝 Contributing

This project was developed for the Odoo Hackathon.

### Development Guidelines

1. Follow the existing code structure
2. Use meaningful commit messages
3. Test changes before committing
4. Update documentation as needed

---

## 📝 License

This project is developed for educational and hackathon purposes.

---

## 👥 Authors

Developed for Odoo Hackathon

---

## 🙏 Acknowledgments

- **Shadcn UI** for the beautiful dashboard components
- **Odoo** for the hackathon opportunity
- **Next.js Team** for the amazing framework

---

## 📞 Support

For issues or questions, please refer to the testing documentation or create an issue in the repository.

---

## 🚧 Future Enhancements

- [ ] OTP-based password reset
- [ ] Advanced stock level calculations
- [ ] Real-time low stock alerts
- [ ] Barcode scanning support
- [ ] Export reports (PDF, Excel)
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced analytics

---

**Built with ❤️ for Odoo Hackathon**
