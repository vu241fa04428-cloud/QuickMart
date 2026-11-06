const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const products = [
  { name: "The Alchemist", description: "A popular inspirational novel.", price: 299, category: "Books", stock: 20, brand: "HarperCollins", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700" },
  { name: "Atomic Habits", description: "A practical guide to building good habits.", price: 399, category: "Books", stock: 15, brand: "Penguin", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700" },
  { name: "Clean Code", description: "A software craftsmanship book.", price: 599, category: "Books", stock: 10, brand: "Pearson", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=700" },
  { name: "Classmate Notebook", description: "Single-line ruled notebook.", price: 65, category: "Stationery", stock: 100, brand: "Classmate", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700" },
  { name: "Blue Ball Pen Pack", description: "Pack of five smooth-writing pens.", price: 50, category: "Stationery", stock: 80, brand: "Reynolds", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=700" },
  { name: "Geometry Box", description: "Student geometry instrument set.", price: 120, category: "Stationery", stock: 35, brand: "Camlin", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700" },
  { name: "Highlighter Set", description: "Set of four assorted highlighters.", price: 95, category: "Stationery", stock: 40, brand: "Camlin", image: "https://images.unsplash.com/photo-1455390582262-044ccea277a8?w=700" },
  { name: "Academic Planner", description: "Undated planner for study schedules.", price: 199, category: "Stationery", stock: 25, brand: "QuickMart", image: "https://images.unsplash.com/photo-1506784983877-45594f4fa7c2?w=700" }
];

async function seed() {
  try {
    await connectDB();
    const adminEmail = "admin@quickmart.local";
    if (!(await User.findOne({ email: adminEmail }))) {
      await User.create({
        name: "QuickMart Admin",
        email: adminEmail,
        password: await bcrypt.hash("Admin@12345", 12),
        role: "admin"
      });
      console.log("Demo admin created: admin@quickmart.local / Admin@12345");
    }
    for (const item of products) {
      await Product.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });
    }
    console.log("Sample products are ready.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seed();
