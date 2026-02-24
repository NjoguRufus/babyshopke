# Baby Shop KE - PHP + MySQL E-Commerce Setup Guide

## Prerequisites
- **XAMPP** (or WAMP/MAMP) with PHP 7.4+ and MySQL 5.7+
- A web browser

## Setup Instructions

### 1. Copy Files
Copy the entire `php-reference/` folder contents to your XAMPP htdocs:
```
C:\xampp\htdocs\babyshopke\
├── config/
├── public/          ← This is your web root
├── assets/
├── includes/
├── models/
├── controllers/
└── database.sql
```

### 2. Create Database
1. Start XAMPP (Apache + MySQL)
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`
3. Import `database.sql` — it creates the `babyshopke` database with all tables and sample data

### 3. Configure Database Connection
Edit `config/db.php` if your MySQL credentials differ from defaults:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'babyshopke');
define('DB_USER', 'root');      // Change if needed
define('DB_PASS', '');           // Change if needed
```

### 4. Update Site URL
Edit `config/config.php`:
```php
define('SITE_URL', 'http://localhost/babyshopke/public');
```

### 5. Run
Open browser: `http://localhost/babyshopke/public/index.php`

## Test Accounts

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@babyshopke.co.ke   | Admin@123  |
| User  | jane@example.com         | User@123   |

> **Note:** The password hashes in `database.sql` were generated with `password_hash()`. 
> If they don't work, register a new account and use that instead.

## Features Summary

| Feature | Location |
|---------|----------|
| Homepage + Products | `/public/index.php` |
| Product Details | `/public/product.php?id=1` |
| Login / Register | `/public/login.php`, `/public/register.php` |
| Cart | `/public/cart.php` |
| Checkout | `/public/checkout.php` |
| Order History | `/public/orders.php` |
| Family & Children | `/public/family.php` |
| Admin Dashboard | `/public/admin/dashboard.php` |
| Admin Products CRUD | `/public/admin/products.php` |
| Admin Orders | `/public/admin/orders.php` |

## Security Features
- ✅ PDO prepared statements (SQL injection prevention)
- ✅ CSRF tokens on all POST forms
- ✅ `password_hash()` / `password_verify()` for passwords
- ✅ `htmlspecialchars()` output escaping
- ✅ Auth guards for protected routes
- ✅ Admin guards for admin routes
- ✅ Server-side input validation
- ✅ Stock validation before cart additions

## File Structure
```
config/
  db.php              - PDO database connection
  config.php          - Site constants, session, helpers
  csrf.php            - CSRF token generation/validation

models/
  Product.php         - Product CRUD + age-range queries
  User.php            - User registration, login
  Order.php           - Order creation, items, status
  Family.php          - Family accounts, children, age calc

controllers/
  auth_controller.php     - Login/register/logout handlers
  cart_controller.php     - Cart add/remove/clear handlers
  product_controller.php  - Admin product CRUD handlers
  order_controller.php    - Checkout handler
  family_controller.php   - Family/child management

includes/
  header.php          - HTML head + navbar include
  footer.php          - Footer + closing HTML
  navbar.php          - Navigation bar with cart badge
  flash.php           - Flash message display
  auth_guard.php      - Redirect if not logged in
  admin_guard.php     - Redirect if not admin

public/
  index.php           - Homepage (hero, categories, age tabs, products)
  product.php         - Product detail page
  cart.php            - Shopping cart
  checkout.php        - Checkout form
  orders.php          - User order history
  order_view.php      - Order detail
  login.php           - Login form
  register.php        - Registration form
  logout.php          - Session destroy
  family.php          - Family + child management
  admin/
    dashboard.php     - Admin overview
    products.php      - Product list + add form
    product_edit.php  - Edit product
    orders.php        - All orders list
    order_update.php  - Update order status

assets/
  styles.css          - Complete CSS (Baby Shop KE branded)
  app.js              - Minimal JavaScript
```
