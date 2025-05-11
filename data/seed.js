import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Coupon from "../models/Coupon.js";
import SellerProfile from "../models/SellerProfile.js";
import RefundRequest from "../models/RefundRequest.js";
import Notification from "../models/Notification.js";
import { connectToDatabase } from "../lib/mongoose.js";
import Category from "../models/Category.js";

async function seedDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is undefined. Please set it in your .env.local file.");
  }

  await connectToDatabase();

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Category.deleteMany({}),
    Coupon.deleteMany({}),
    SellerProfile.deleteMany({}),
    RefundRequest.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const users = await User.insertMany([
    { name: "Ali Buyer", email: "ali@buyzaar.com", passwordHash: "hashed123", role: "buyer", status: "active" },
    { name: "Sara Seller", email: "sara@buyzaar.com", passwordHash: "hashed456", role: "seller", status: "pending" },
    { name: "Admin", email: "admin@buyzaar.com", passwordHash: "hashed789", role: "admin", status: "active" }
  ]);

  const parentCategories = [
    "Electronic Accessories",
    "TV & Home Appliances",
    "Health & Beauty",
    "Mother & Baby",
    "Electronic Devices",
    "Groceries & Pets",
    "Home & Lifestyle",
    "Women's Fashion",
    "Men's Fashion",
    "Watches, Bags & Jewellery",
    "Sports & Outdoor",
    "Automotive & Motorbike"
  ];

  const subcategoriesMap = {
    "Electronic Accessories": ["Mobile Accessories", "Wearable", "Computer Accessories"],
    "TV & Home Appliances": ["Smart TVs", "Refrigerators", "Washing Machines"],
    "Health & Beauty": ["Makeup", "Skincare", "Hair Care", "Personal Care Devices"],
    "Mother & Baby": ["Diapers", "Baby Gear", "Feeding", "Toys"],
    "Electronic Devices": ["Smartphones", "Tablets", "Laptops"],
    "Groceries & Pets": ["Dry Food", "Wet Food", "Treats"],
    "Home & Lifestyle": ["Furniture", "Lighting", "Tools & Home Improvement"],
    "Women's Fashion": ["Dresses", "Tops", "Shoes", "Handbags"],
    "Men's Fashion": ["Shirts", "Jackets", "Shoes", "Watches"],
    "Watches, Bags & Jewellery": ["Watches", "Bags", "Necklaces", "Bracelets"],
    "Sports & Outdoor": ["Exercise & Fitness", "Cycling", "Outdoor Recreation"],
    "Automotive & Motorbike": ["Motorcycle Parts", "Car Accessories", "Oils & Fluids"]
  };

  // Insert parents
  const insertedParents = await Category.insertMany(
    parentCategories.map((name) => ({ name }))
  );

  const categoryMap = {};
  insertedParents.forEach((cat) => {
    categoryMap[cat.name] = cat._id;
  });

  // Insert children
  for (const parent of insertedParents) {
    const subcats = subcategoriesMap[parent.name] || [];
    await Category.insertMany(
      subcats.map((name) => ({
        name,
        parentCategoryId: parent._id,
      }))
    );
  }

  const sellerProfile = await SellerProfile.create({
    userId: users[1]._id,
    storeName: "Sara's Fashion",
    storeDescription: "Trendy clothes by Sara",
    approvalStatus: "pending",
    logo: "/logos/saras-fashion.png",
    socialLinks: [],
    joinedAt: new Date()
  });

 const products = await Product.insertMany([
  {
    sellerId: users[1]._id,
    title: "Apple Earphones",
    description: "Noise-cancellation, 40-hour battery",
    categoryId: categoryMap["Electronic Devices"],
    price: 299.99,
    rating: { average: 5, count: 1 },
    images: ["/images/apple_earphone.jpg"],
    stock: 100,
  },
  {
    sellerId: users[1]._id,
    title: "Bose QuietComfort 45",
    description: "Noise Cancellation, 24-hour battery",
    categoryId: categoryMap["Electronic Devices"],
    price: 329.99,
    rating: { average: 4.8, count: 1 },
    images: ["/images/bose_headphone.jpg"],
    stock: 50,
  },
  {
    sellerId: users[1]._id,
    title: "Samsung Galaxy S23",
    description: "Fitness Tracking, AMOLED Display",
    categoryId: categoryMap["Electronic Devices"],
    price: 799.99,
    rating: { average: 4.6, count: 1 },
    images: ["/images/samsung_s23phone_image.png"],
    stock: 40,
  },
  {
    sellerId: users[1]._id,
    title: "Garmin Venu 2",
    description: "Noise Cancellation, 24-hour battery",
    categoryId: categoryMap["Electronic Devices"],
    price: 349.99,
    rating: { average: 5, count: 1 },
    images: ["/images/venu_watch_image.png"],
    stock: 25,
  },
  {
    sellerId: users[1]._id,
    title: "PlayStation 5",
    description: "Ultra-HD, 825GB SSD, Ray Graphics",
    categoryId: categoryMap["Electronic Devices"],
    price: 499.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/playstation_image.png"],
    stock: 20,
  },
  {
    sellerId: users[1]._id,
    title: "Canon EOS R5",
    description: "45MP Sensor, 8K Video Recording",
    categoryId: categoryMap["Electronic Devices"],
    price: 3899.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/cannon_camera_image.png"],
    stock: 15,
  },
  {
    sellerId: users[1]._id,
    title: "MacBook Pro 16",
    description: "M2 Pro Chip, 16GB RAM, 512GB SSD",
    categoryId: categoryMap["Electronic Devices"],
    price: 2499.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/macbook.jpg"],
    stock: 30,
  },
  {
    sellerId: users[1]._id,
    title: "Sony WF-1000XM5",
    description: "Noise-Cancellation, Hi-Res Audio",
    categoryId: categoryMap["Electronic Devices"],
    price: 299.99,
    rating: { average: 4.7, count: 1 },
    images: ["/images/sony_airbuds_image.png"],
    stock: 80,
  },
  {
    sellerId: users[1]._id,
    title: "Samsung Projector 4k",
    description: "4K Ultra HD, Realistic, Built-In Speaker",
    categoryId: categoryMap["Electronic Devices"],
    price: 1499.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/projector_image.png"],
    stock: 10,
  },
  {
    sellerId: users[1]._id,
    title: "ASUS ROG Zephyrus G16",
    description: "Intel Core i9, RTX 4070, 16GB, 1TB",
    categoryId: categoryMap["Electronic Devices"],
    price: 1999.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/asus_laptop_image.png"],
    stock: 18,
  },
  {
    sellerId: users[1]._id,
    title: "Phone Case",
    description: "Shockproof edges, matte finish, stylish",
    categoryId: categoryMap["Electronic Devices"],
    price: 50,
    rating: { average: 4.3, count: 1 },
    images: ["/images/phonecase.jpg"],
    stock: 120,
  },
  {
    sellerId: users[1]._id,
    title: "Bag",
    description: "Faux leather, gold-toned hardware, sleek design",
    categoryId: categoryMap["Electronic Devices"],
    price: 100,
    rating: { average: 4.6, count: 1 },
    images: ["/images/bag.jpg"],
    stock: 90,
  },
  {
    sellerId: users[1]._id,
    title: "Ring",
    description: "Rose gold-plated with cubic zirconia",
    categoryId: categoryMap["Electronic Devices"],
    price: 10,
    rating: { average: 4.2, count: 1 },
    images: ["/images/ring.png"],
    stock: 200,
  },
  {
    sellerId: users[1]._id,
    title: "Belt",
    description: "Genuine leather, matte buckle finish",
    categoryId: categoryMap["Electronic Devices"],
    price: 80,
    rating: { average: 4.4, count: 1 },
    images: ["/images/belt.png"],
    stock: 150,
  },
  {
    sellerId: users[1]._id,
    title: "Spinner",
    description: "Metallic rainbow-finish fidget spinner",
    categoryId: categoryMap["Electronic Devices"],
    price: 20,
    rating: { average: 4.1, count: 1 },
    images: ["/images/spinner.jpg"],
    stock: 60,
  },
  {
    sellerId: users[1]._id,
    title: "Scissors",
    description: "Stainless-steel, soft-grip teal/gray handles",
    categoryId: categoryMap["Electronic Devices"],
    price: 10,
    rating: { average: 4.5, count: 1 },
    images: ["/images/scissors.jpg"],
    stock: 75,
  },
  {
    sellerId: users[1]._id,
    title: "Tool Kit",
    description: "24-piece mini toolkit, zippered case",
    categoryId: categoryMap["Electronic Devices"],
    price: 120,
    rating: { average: 4.6, count: 1 },
    images: ["/images/toolkit.jpg"],
    stock: 50,
  },
  {
    sellerId: users[1]._id,
    title: "Sunglasses",
    description: "Polarized UV400, matte/tortoise/clear frame",
    categoryId: categoryMap["Electronic Devices"],
    price: 100,
    rating: { average: 4.7, count: 1 },
    images: ["/images/sunglasses.jpg"],
    stock: 100,
  },
  {
    sellerId: users[1]._id,
    title: "Pillow",
    description: "Memory foam, ergonomic support",
    categoryId: categoryMap["Electronic Devices"],
    price: 39.99,
    rating: { average: 4.5, count: 1 },
    images: ["/images/pillow.png"],
    stock: 110,
  },
  {
    sellerId: users[1]._id,
    title: "Suitcase",
    description: "Expandable hardshell travel case",
    categoryId: categoryMap["Electronic Devices"],
    price: 189.99,
    rating: { average: 4.8, count: 1 },
    images: ["/images/suitcase.png"],
    stock: 70,
  }
]);


  await Review.create({
    userId: users[0]._id,
    productId: products[0]._id,
    rating: 5,
    comment: "Excellent product!"
  });

  await Order.create({
    buyerId: users[0]._id,
    items: [{ productId: products[0]._id, quantity: 1, price: 299.99 }],
    totalAmount: 299.99,
    status: "processing",
    paymentMethod: "COD",
    paymentStatus: "paid",
    shippingAddress: {
      name: "Ali",
      phone: "123456789",
      address: "123 Street",
      city: "Lahore",
      postalCode: "54000",
      country: "Pakistan"
    }
  });

  await Coupon.create({
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minPurchaseAmount: 50,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  await RefundRequest.create({
    orderId: null,
    buyerId: users[0]._id,
    reason: "Product not as described",
    images: []
  });

  await Notification.create({
    userId: users[0]._id,
    message: "Your order has been shipped!",
    type: "order"
  });

  console.log("✅ Dummy data seeded successfully");
  mongoose.connection.close();
}

seedDatabase().catch(console.error);

