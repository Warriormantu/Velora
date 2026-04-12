# Velora 🛒

**Velora** is a full-stack quick-commerce grocery delivery platform built with the **MERN stack**. It provides a smooth shopping experience with a clean, modern UI and a solid backend for managing products, orders, and users.

![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)

---

## 📌 About

Velora is a grocery delivery app focused on fast product discovery, a clean checkout flow, and easy order management. It includes both a customer-facing storefront and a protected admin panel.

---

## ✨ Features

### User Side
- Browse **28 seeded grocery products** across multiple categories
- Search and filter by category
- Add to cart, update quantity, remove items
- Checkout with delivery address
- View order history

### Admin Panel
- Dashboard with total revenue, orders, products, and low stock alerts
- Full **CRUD** on products (add, edit, delete)
- View and update order status (Pending → Processing → Delivered)
- Payment status management

---

## 🛠 Tech Stack

### Frontend (`/frontend`)
- **React 18** with **Vite**
- **React Router DOM v6**
- **Vanilla CSS** (custom design system)
- **Axios** with JWT interceptors
- **React Context API** — `AuthContext`, `CartContext`
- **react-hot-toast** for notifications
- **React Icons**

### Backend (`/backend`)
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-async-handler**

---

## 📂 Project Structure

```
Velora/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, AdminLayout
│   │   │   ├── home/         # CategoryGrid, PromoBanners
│   │   │   ├── product/      # ProductCard, ProductCarousel
│   │   │   └── ui/           # Loader, EmptyState, SearchBar, LocationModal
│   │   ├── context/          # AuthContext.jsx, CartContext.jsx
│   │   ├── hooks/            # useAuth.js, useCart.js
│   │   ├── pages/            # Home, Login, Register, Cart, Checkout, Orders
│   │   │   └── admin/        # AdminDashboard, AdminProducts, AdminOrders
│   │   ├── services/         # api.js (Axios instance)
│   │   ├── App.jsx           # Routes with auth & admin guards
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── config/               # db.js (MongoDB connection)
    ├── controllers/          # authController, productController, orderController
    ├── middleware/            # authMiddleware, adminMiddleware, errorHandler
    ├── models/               # User.js, Product.js, Order.js
    ├── routes/               # authRoutes, productRoutes, orderRoutes, uploadRoutes
    ├── seed.js               # Database seeder
    ├── server.js             # Express server entry point
    └── package.json
```

---

## 🗄 Database Models

### User
`name`, `email`, `password` (hashed), `role` (admin/user), `createdAt`

### Product
`name`, `description`, `price`, `category`, `stock`, `image`, `createdAt`

### Order
`userId`, `products` (array), `totalAmount`, `deliveryAddress`, `paymentStatus`, `orderStatus`, `createdAt`

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally on port `27017`

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/velora
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

> Backend runs at `http://localhost:5000`

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at `http://localhost:3000`

---

## 🔑 Default Accounts

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | admin@velora.com    | admin123  |
| User  | user@velora.com     | user1234  |

New users can also register through the signup page.

---

## 📈 Future Plans

- Payment gateway integration (Stripe / Razorpay)
- Real-time order tracking with WebSockets
- Product recommendation system
- Mobile app (React Native)
- Delivery partner management interface

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
