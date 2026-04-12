# VELORA — Luxury in Every Delivery 🛒✨

**VELORA** is a premium full-stack quick-commerce grocery delivery platform built using the **MERN stack**. The platform provides a seamless shopping experience with a luxury-inspired UI and a powerful backend for managing products, orders, and users.

The application focuses on **performance, simplicity, and premium user experience**, combining modern frontend technologies with a scalable backend architecture.

![Velora Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)

---

# 📌 Project Vision

VELORA aims to deliver everyday essentials through a **fast, elegant, and intuitive digital platform**. Unlike cluttered grocery marketplaces, VELORA focuses on:

* Minimalistic design
* Fast product discovery
* Smooth checkout experience
* Efficient inventory and order management

---

# 🌟 Core Features

## 👤 User Features

### Premium UI / UX
The interface uses a **midnight blue and champagne gold theme**, creating a luxury shopping experience. Custom fonts such as **Playfair Display** and **Inter** provide elegance and readability.

Key UI characteristics:
* Glassmorphism elements
* Smooth animations
* Mobile-first responsive layout
* Clean product cards

### 🛍 Product Discovery
Users can browse **20+ seeded grocery products** categorized into:
* Fresh Produce
* Pantry Items
* Beverages
* Bakery

The product discovery system includes:
* Product grid layout
* Category filters
* Search functionality
* Detailed product pages

### 🛒 Dynamic Shopping Cart
The cart system allows users to manage items efficiently.

Features include:
* Add to cart
* Remove items
* Increase or decrease quantity via interactive stepper
* Dynamic price calculation
* Persistent cart storage

Cart updates automatically across the entire application, including:
* Navbar cart badge
* Product cards
* Cart page totals

### 💳 Checkout Flow
The checkout process includes:
1. Delivery address entry
2. Cart review
3. Order placement simulation

Orders are then securely stored in the database, automatically deducting product stock.

### 📦 Order History
Users can view their past orders including:
* Ordered items
* Total price
* Delivery address
* Order status

This allows users to track and review their purchase history.

---

# 👨‍💼 Administrator Features

Administrators manage the platform through a protected admin dashboard.

Admin features include:

### Dashboard Overview
Displays important metrics running in real-time such as:
* Total Revenue
* Total Orders
* Total Products
* Low Stock Alerts

### Inventory Management
Admins can perform **full CRUD operations** on products:
* Create new products
* Update product details
* Delete products
* Manage inventory stock

These actions are performed through clean modal interfaces.

### Order Management
Admins can monitor incoming orders and update their status.

Order states include:
* Pending
* Processing
* Delivered

Payment status can also be updated.

---

# 🛠 Technology Stack

## Frontend (`/frontend`)

* **Language:** JavaScript (ES6+) and JSX
* **Framework:** React 18 with **Vite** for fast development and optimized builds
* **Routing:** React Router DOM (v6)
* **Styling:** TailwindCSS v4
* **State Management:** React Context API
  * Contexts used: `AuthContext`, `CartContext`
* **HTTP Client:** Axios with interceptors for automatic JWT token injection
* **Icons:** React Icons (Heroicons)
* **Notifications:** react-hot-toast

## Backend (`/backend`)

* **Language:** Node.js (JavaScript runtime)
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT)
* **Password Security:** bcryptjs hashing
* **Error Handling:** express-async-handler

---

# 🧠 System Architecture

VELORA follows a **three-layer architecture**:

```text
Client (React)
      ↓
API Layer (Express.js)
      ↓
Database (MongoDB)
```

### Frontend Responsibilities
* UI rendering & state management
* Cart logic tracking
* API communication handling via Axios
* Authentication token storage keeping sessions alive

### Backend Responsibilities
* Business logic layer defining application rules (i.e. blocking orders containing out of stock items)
* Database relations handling (saving relations inside MongoDB)
* JSON Web Token issuance and verification
* Error boundary logic and response formatting

---

# 📂 Project Structure

```text
VELORA/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, AdminLayout
│   │   │   ├── product/      # ProductCard, ProductGrid, Filters
│   │   │   └── ui/           # Loader, EmptyState
│   │   ├── context/          # AuthContext.jsx, CartContext.jsx
│   │   ├── hooks/            # useAuth.js, useCart.js
│   │   ├── pages/            # Home, Login, Register, Cart, Checkout, Orders
│   │   │   └── admin/        # AdminDashboard, AdminProducts, AdminOrders
│   │   ├── services/         # api.js
│   │   ├── App.jsx           # Includes Route guards (Protected & Admin routing)
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js        # Vite configurations (backend proxying)
│
└── backend/
    ├── config/               # db.js
    ├── controllers/          # authController, productController, orderController
    ├── middleware/           # authMiddleware, errorMiddleware
    ├── models/               # User.js, Product.js, Order.js
    ├── routes/               # authRoutes, productRoutes, orderRoutes
    ├── utils/                # generateToken.js
    ├── serveServer.js        # Seed Logic
    ├── server.js             # Main server entry & middleware execution
    └── package.json
```

---

# 🗄 Database Models

## User Model
Stores user information.
Fields: `name`, `email`, `password` (hashed), `role`, `createdAt`
* Roles determine whether the user is **admin or shopper**.

## Product Model
Stores product information.
Fields: `name`, `description`, `price`, `category`, `stock`, `image`, `createdAt`

## Order Model
Stores order details.
Fields: `userId`, `products` (embedded array logic), `totalAmount`, `deliveryAddress`, `paymentStatus`, `orderStatus`, `createdAt`

---

# 🚀 Running the Project Locally

## Prerequisites
You must have:
* Node.js v18+
* MongoDB Community Server running locally (port 27017)

## Backend Setup

Navigate to backend folder:
```bash
cd backend
npm install
```

Create `.env` file inside `/backend`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/velora
JWT_SECRET=velorasecretkey2024
NODE_ENV=development
```

Seed database:
```bash
npm run seed
```

Start server:
```bash
npm run dev
```
*(Backend runs at: `http://localhost:5000`)*

## Frontend Setup

Open another terminal and navigate to `/frontend`:
```bash
cd frontend
npm install
npm run dev
```
*(Frontend runs at: `http://localhost:3000`)*

---

# 🔑 Default Admin Account

* **Email**: `admin@velora.com`
* **Password**: `admin123`

*(Users can create their own accounts through the signup page).*

---

# 📈 Future Improvements

Potential upgrades include:
* Real payment gateway integration (Stripe/Razorpay)
* Real-time order tracking with WebSockets
* Mobile app version (React Native)
* AI-based product recommendations
* Delivery partner system interface

---

💡 **For Reviewers / Interviewers**: Let's discuss our robust use of `AuthContext` and `CartContext` for centralized state management, how our Axios interceptors safely pass our JWT tokens, and how our `Mongoose` models interact securely with our `Express.js` API endpoints to provide a scalable quick-commerce architecture!
