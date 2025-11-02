-- Local Cart Store Inventory & Online Order System
-- MySQL Database Schema
-- Normalized relational database structure

-- Create database
CREATE DATABASE IF NOT EXISTS cart_store;
USE cart_store;

-- Products table
-- Stores product information for the inventory
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100),
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customers table
-- Stores customer information for orders
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
-- Stores order information linked to customers
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_order_date (order_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order_Items table
-- Stores individual items within each order (many-to-many relationship)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample products for testing
INSERT INTO products (name, description, price, stock, category, image_path) VALUES
('Rice 5kg', 'Premium quality rice, 5kg bag', 450.00, 50, 'Food', '/uploads/rice.jpg'),
('Wheat Flour 2kg', 'Fresh wheat flour, 2kg pack', 120.00, 30, 'Food', '/uploads/flour.jpg'),
('Cooking Oil 1L', 'Refined cooking oil, 1 liter', 180.00, 40, 'Food', '/uploads/oil.jpg'),
('Soap Bar', 'Gentle soap bar for daily use', 25.00, 100, 'Personal Care', '/uploads/soap.jpg'),
('Toothpaste', 'Fluoride toothpaste, 100g', 55.00, 60, 'Personal Care', '/uploads/toothpaste.jpg'),
('Detergent Powder 1kg', 'Laundry detergent, 1kg pack', 150.00, 35, 'Household', '/uploads/detergent.jpg'),
('Notebook A4', 'Spiral bound notebook, A4 size', 45.00, 80, 'Stationery', '/uploads/notebook.jpg'),
('Pen Set', 'Set of 3 blue ink pens', 30.00, 120, 'Stationery', '/uploads/pen.jpg');

