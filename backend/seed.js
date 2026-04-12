const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

dotenv.config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const products = [
  // Dairy, Bread & Eggs
  { name: "Amul Gold Full Cream Milk", price: 35, category: "Dairy, Bread & Eggs", weight: "500 ml", stock: 50, image: "https://images.unsplash.com/photo-1550583724-b2692bcac993?w=400", description: "Rich and creamy full cream milk from Amul." },
  { name: "Amul Masti Pouch Curd", price: 35, category: "Dairy, Bread & Eggs", weight: "390 g", stock: 40, image: "https://images.unsplash.com/photo-1550583724-b2692bcac993?w=400", description: "Fresh and thick dahi for everyday use." },
  { name: "Amul Salted Butter", price: 58, category: "Dairy, Bread & Eggs", weight: "100 g", stock: 20, image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400", description: "Classic Amul salted butter." },
  { name: "Amul Taaza Toned Milk", price: 29, category: "Dairy, Bread & Eggs", weight: "500 ml", stock: 50, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", description: "Toned milk for a lighter choice." },
  { name: "Farm Fresh Brown Eggs", price: 85, category: "Dairy, Bread & Eggs", weight: "6 pieces", stock: 15, image: "https://images.unsplash.com/photo-1587486913049-53fc88980afc?w=400", description: "Free range brown eggs, farm fresh." },
  { name: "Harvest Gold White Bread", price: 40, category: "Dairy, Bread & Eggs", weight: "400 g", stock: 30, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", description: "Soft and fresh white sandwich bread." },

  // Snacks & Munchies
  { name: "Lo Foods Gluten Free Millet Ragi Chips", price: 99, category: "Snacks & Munchies", weight: "75 g", stock: 10, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", description: "Healthy gluten-free chips made from ragi millet." },
  { name: "Beanly Choco Hazelnut Spread with Breadsticks", price: 99, category: "Snacks & Munchies", weight: "52 g", stock: 10, discount: 25, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", description: "Premium chocolate hazelnut spread with crispy breadsticks." },
  { name: "Lay's India's Magic Masala", price: 20, category: "Snacks & Munchies", weight: "50 g", stock: 100, discount: 10, image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400", description: "The iconic masala flavored potato chips." },
  { name: "Doritos Nacho Cheese", price: 50, category: "Snacks & Munchies", weight: "85 g", stock: 45, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", description: "Bold nacho cheese flavored tortilla chips." },
  { name: "Kurkure Masala Munch", price: 20, category: "Snacks & Munchies", weight: "90 g", stock: 80, image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400", description: "Crunchy masala munch snack for those spicy cravings." },
  { name: "Haldiram's Bhujia Sev", price: 105, category: "Snacks & Munchies", weight: "400 g", stock: 25, discount: 5, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400", description: "Traditional Rajasthani bhujia sev, crispy and spicy." },

  // Fruits & Vegetables
  { name: "Fresh Onion (Pyaz)", price: 45, category: "Fruits & Vegetables", weight: "1 kg", stock: 200, discount: 15, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400", description: "Farm fresh onions, essential kitchen staple." },
  { name: "Fresh Tomato (Tamatar)", price: 30, category: "Fruits & Vegetables", weight: "500 g", stock: 150, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400", description: "Juicy and fresh red tomatoes." },
  { name: "Local Potato (Aloo)", price: 35, category: "Fruits & Vegetables", weight: "1 kg", stock: 300, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", description: "Fresh potatoes for all your cooking needs." },
  { name: "Robusta Banana", price: 60, category: "Fruits & Vegetables", weight: "6 pieces", stock: 40, image: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=400", description: "Ripe and sweet Robusta bananas." },
  { name: "Fresh Coriander Leaves", price: 15, category: "Fruits & Vegetables", weight: "100 g", stock: 50, image: "https://images.unsplash.com/photo-1599909631718-2e0302ebcb71?w=400", description: "Fresh green coriander for garnishing and cooking." },
  { name: "Green Capsicum", price: 55, category: "Fruits & Vegetables", weight: "500 g", stock: 60, image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", description: "Fresh green bell peppers for salads and cooking." },
  { name: "Alphonso Mango", price: 199, category: "Fruits & Vegetables", weight: "4 pieces", stock: 20, discount: 10, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", description: "King of mangoes - sweet and juicy Alphonso." },

  // Cold Drinks & Juices
  { name: "Coca-Cola Original Taste", price: 40, category: "Cold Drinks & Juices", weight: "750 ml", stock: 80, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", description: "The original and iconic Coca-Cola." },
  { name: "Thumbs Up", price: 40, category: "Cold Drinks & Juices", weight: "750 ml", stock: 75, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", description: "Strong, refreshing cola with a bold taste." },
  { name: "Real Fruit Power Mixed Fruit", price: 110, category: "Cold Drinks & Juices", weight: "1 L", stock: 30, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", description: "No added preservatives, real fruit juice mix." },
  { name: "Minute Maid Pulpy Orange", price: 65, category: "Cold Drinks & Juices", weight: "1 L", stock: 40, discount: 8, image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400", description: "Refreshing orange juice with real pulp." },
  { name: "Red Bull Energy Drink", price: 125, category: "Cold Drinks & Juices", weight: "250 ml", stock: 60, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400", description: "Gives you wings! Premium energy drink." },

  // Personal Care
  { name: "Colgate MaxFresh Red Paste", price: 95, category: "Personal Care", weight: "150 g", stock: 60, image: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400", description: "Cooling red gel toothpaste for fresh breath." },
  { name: "Dettol Original Bar Soap", price: 150, category: "Personal Care", weight: "4x75 g", stock: 40, image: "https://images.unsplash.com/photo-1584824486516-0555a07fc511?w=400", description: "Trusted antibacterial protection soap." },
  { name: "Dove Moisturising Body Wash", price: 340, category: "Personal Care", weight: "250 ml", stock: 25, discount: 12, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", description: "Gentle moisturising body wash with 1/4 moisturising cream." },
  { name: "Head & Shoulders Cool Menthol", price: 299, category: "Personal Care", weight: "340 ml", stock: 35, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", description: "Anti-dandruff shampoo with cool menthol relief." },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    console.log("🗑️  Cleared existing data");

    // Seed products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    // Seed admin user
    const adminUser = await User.create({
      name: "Velora Admin",
      email: "admin@velora.com",
      password: "admin123",
      role: "admin",
    });
    console.log(`✅ Admin user created: admin@velora.com / admin123`);

    // Seed test user
    const testUser = await User.create({
      name: "Test User",
      email: "user@velora.com",
      password: "user1234",
      role: "user",
    });
    console.log(`✅ Test user created: user@velora.com / user1234`);

    console.log("\n🚀 Database seeded successfully!");
    console.log("   Admin: admin@velora.com / admin123");
    console.log("   User:  user@velora.com / user1234");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();
