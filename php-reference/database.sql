-- ============================================
-- Baby Shop KE E-Commerce Database Schema
-- MySQL 5.7+ / MariaDB 10.3+
-- ============================================

CREATE DATABASE IF NOT EXISTS babyshopke CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE babyshopke;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    role ENUM('user','admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- FAMILIES
-- ============================================
CREATE TABLE families (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id INT UNSIGNED NOT NULL,
    invite_code VARCHAR(20) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- FAMILY MEMBERS (join table)
-- ============================================
CREATE TABLE family_members (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    family_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    role ENUM('owner','member') NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (family_id, user_id)
) ENGINE=InnoDB;

-- ============================================
-- CHILDREN
-- ============================================
CREATE TABLE children (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    family_id INT UNSIGNED NOT NULL,
    child_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500) DEFAULT 'https://placehold.co/300x300/FFF7F2/1F2933?text=Product',
    category VARCHAR(50) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    age_min_months INT UNSIGNED NOT NULL DEFAULT 0,
    age_max_months INT UNSIGNED NOT NULL DEFAULT 48,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_age_range (age_min_months, age_max_months),
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    delivery_option ENUM('delivery','pickup') NOT NULL DEFAULT 'delivery',
    payment_method ENUM('mpesa','cod') NOT NULL DEFAULT 'mpesa',
    status ENUM('pending','paid','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Admin user (password: Admin@123)
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES
('Admin User', 'admin@babyshopke.co.ke', '$2y$12$LJ3m4ys3Gzf0Ga2VEjKIiOjJN1QF.r6.x6YfBqKq9jjLkRjhDu.tu', '0700000000', 'admin');

-- Test user (password: User@123)
INSERT INTO users (full_name, email, password_hash, phone, role) VALUES
('Jane Wanjiku', 'jane@example.com', '$2y$12$XuQ5z8gVfMkJ.yqU3E.0a.Vk0v4HsZ2kJYp1b2W6rD1mNpX5m3xXe', '0712345678', 'user');

-- Products: Diapers & Wipes (4)
INSERT INTO products (name, description, price, image_url, category, stock, age_min_months, age_max_months) VALUES
('Pampers Premium Size 3', 'Ultra-soft Pampers diapers, size 3 (6-10kg). 52 pack.', 1850.00, 'https://placehold.co/300x300/E0F7FA/1F2933?text=Pampers+S3', 'Diapers & Wipes', 120, 3, 12),
('Huggies Dry Comfort Size 4', 'All-night dryness, size 4 (8-14kg). 60 pack.', 1650.00, 'https://placehold.co/300x300/E0F7FA/1F2933?text=Huggies+S4', 'Diapers & Wipes', 95, 6, 18),
('BabyLove Wet Wipes 80s', 'Gentle alcohol-free baby wipes, 80 sheets.', 350.00, 'https://placehold.co/300x300/E0F7FA/1F2933?text=Wipes', 'Diapers & Wipes', 200, 0, 48),
('Molfix Newborn Diapers', 'Extra soft for newborns (2-5kg). 44 pack.', 950.00, 'https://placehold.co/300x300/E0F7FA/1F2933?text=Molfix+NB', 'Diapers & Wipes', 80, 0, 3);

-- Products: Feeding (3)
INSERT INTO products (name, description, price, image_url, category, stock, age_min_months, age_max_months) VALUES
('Philips Avent Bottle 260ml', 'Anti-colic bottle with natural latch. BPA-free.', 1200.00, 'https://placehold.co/300x300/FFF3E0/1F2933?text=Avent+Bottle', 'Feeding', 65, 0, 12),
('Bamboo Suction Bowl Set', 'Eco-friendly bamboo bowl with suction base + spoon.', 1450.00, 'https://placehold.co/300x300/FFF3E0/1F2933?text=Bowl+Set', 'Feeding', 40, 6, 48),
('NUK Learner Cup', 'Spill-proof sippy cup with soft spout. 150ml.', 890.00, 'https://placehold.co/300x300/FFF3E0/1F2933?text=NUK+Cup', 'Feeding', 55, 6, 24);

-- Products: Toys (3)
INSERT INTO products (name, description, price, image_url, category, stock, age_min_months, age_max_months) VALUES
('Stacking Rings Classic', 'Colourful stacking rings for motor skill development.', 750.00, 'https://placehold.co/300x300/E8F5E9/1F2933?text=Stacking+Rings', 'Toys', 70, 6, 18),
('Soft Plush Teddy Bear', 'Super soft, hypoallergenic teddy bear. 30cm.', 1100.00, 'https://placehold.co/300x300/E8F5E9/1F2933?text=Teddy+Bear', 'Toys', 45, 0, 48),
('Musical Activity Cube', 'Interactive cube with sounds, shapes & textures.', 2500.00, 'https://placehold.co/300x300/E8F5E9/1F2933?text=Activity+Cube', 'Toys', 30, 12, 36);

-- Products: Clothing (2)
INSERT INTO products (name, description, price, image_url, category, stock, age_min_months, age_max_months) VALUES
('Cotton Onesie 3-Pack', 'Organic cotton bodysuits. Snap closure. Assorted colours.', 1800.00, 'https://placehold.co/300x300/FCE4EC/1F2933?text=Onesie+3pk', 'Clothing', 60, 0, 12),
('Baby Safari Romper', 'Adorable safari-print romper with feet. 100% cotton.', 1350.00, 'https://placehold.co/300x300/FCE4EC/1F2933?text=Safari+Romper', 'Clothing', 35, 3, 18);
