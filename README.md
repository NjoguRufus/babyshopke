🍼 BabyShopKe
Premium Baby & Kids E-Commerce Platform
PHP + MySQL Implementation

📌 Project Overview
BabyShopKe is a premium, modern web-based e-commerce platform designed for the online sale of baby and kids products.

The system features:

🛒 Dynamic product catalog

👨‍👩‍👧 Family account system

🎯 Age-based product recommendations

🧾 Secure checkout process

📦 Inventory automation

🔐 Role-based authentication (User/Admin)

This project demonstrates full frontend and backend integration using PHP and MySQL.

🎨 Brand Identity
Primary Colors

Turquoise — #2EC4B6

Pastel Crimson — #FF6B8A

Light Background — #FFF7F2

Dark Text — #1F2933

Design Style:
Premium, soft, modern baby boutique aesthetic with rounded UI components and subtle shadows.

🛠 Technology Stack
Frontend
HTML5

CSS3

JavaScript

Bootstrap (Responsive UI)

Backend
PHP (Server-side logic)

MySQL (Database)

XAMPP (Local development environment)

Development Tools
VS Code / Cursor / Codex

GitHub (Version Control)

Draw.io (ERD)

Figma (UI Design)

⚙ System Features
👤 Authentication System
User registration

User login/logout

Password hashing (password_hash)

Session management

Role-based access control (Admin/User)

👨‍👩‍👧 Family Accounts
Create family profile

Add child profiles (Name + DOB)

Select active child

Child profile stored in session

Used for age-based product filtering

🛍 Product Management
Admin Dashboard

Add product

Edit product

Delete product

Manage stock

View orders

Update order status

Products include:

Name

Description

Price

Image

Category

Stock

age_min_months

age_max_months

🎯 Age-Based Recommendation Engine
Unique Feature of BabyShopKe.

How it works:

System calculates child age in months.

Queries products where:

age_min_months <= child_age <= age_max_months
Displays "Top Picks for X Months"

If no child selected:

Default recommendation = 6–12 months.

🛒 Shopping Cart
Add to cart

Update quantity

Remove item

Stock validation

Cart badge counter

Session-based cart

💳 Checkout System
Customer details form

Delivery option

Payment simulation:

M-Pesa (Simulated)

Cash on Delivery

Order stored in database

Stock auto-updated

Order confirmation page

📦 Orders
Users can view order history

Admin can:

View all orders

Change status (Pending / Paid / Shipped / Delivered)

🗂 Project Structure
babyshopke/
│
├── config/
│   ├── db.php
│   ├── config.php
│   └── csrf.php
│
├── public/
│   ├── index.php
│   ├── cart.php
│   ├── checkout.php
│   ├── login.php
│   ├── register.php
│   ├── family.php
│   ├── orders.php
│   └── admin/
│
├── includes/
│   ├── header.php
│   ├── footer.php
│   ├── navbar.php
│   └── auth_guard.php
│
├── controllers/
├── models/
├── assets/
│   ├── styles.css
│   └── app.js
│
└── database.sql
🗄 Database Structure
Tables:

users

families

family_members

children

products

orders

order_items

Relationships:

User → Family

Family → Children

Orders → Users

Orders → Order Items

Order Items → Products

🚀 Installation Guide (XAMPP)
Step 1 — Setup Environment
Install XAMPP

Start Apache & MySQL

Step 2 — Create Database
Open phpMyAdmin

Create database:

babyshopke
Import:

database.sql
Step 3 — Configure Connection
Edit:

config/db.php
Update credentials:

$host = "localhost";
$db   = "babyshopke";
$user = "root";
$pass = "";
Step 4 — Run Project
Place project folder in:

htdocs/babyshopke
Open browser:

http://localhost/babyshopke/public/
🔐 Security Measures
Password hashing

Prepared statements (PDO)

CSRF tokens

Input validation

Output escaping (htmlspecialchars)

Role-based route protection

📈 Non-Functional Requirements
Responsive design

Scalable database structure

Secure data handling

Real-time stock updates

System availability via local server

🎓 Academic Objectives Achieved
✔ Frontend & Backend Integration
✔ Database CRUD operations
✔ Dynamic content loading
✔ E-commerce transaction simulation
✔ Authentication & Authorization
✔ Unique Recommendation Engine

👥 Project Team Roles
Project Manager

UI/UX Designer

Frontend Developer

Backend Developer

Database Administrator

Security Analyst

QA Engineer

📌 Conclusion
BabyShopKe successfully digitizes baby retail operations by:

Improving product accessibility

Automating inventory management

Securing transaction handling

Enhancing customer experience

Implementing intelligent age-based recommendations

The system demonstrates practical application of e-commerce architecture using PHP and MySQL.
