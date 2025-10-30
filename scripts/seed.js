require("dotenv").config();
const connectDB = require("../config/db");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

async function seedData() {
    await connectDB(process.env.MONGO_URI);
    console.log("Clearing old data...");
    await Promise.all([
        Category.deleteMany(),
        Product.deleteMany(),
        User.deleteMany(),
        Order.deleteMany(),
    ]);
    console.log("Creating admin account...");
    const hashedPassword = await bcrypt.hash("admin", 10);
    const admin = await User.create({
        name: "Store Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
    });

    console.log("Admin created:");
    console.log("   Email: admin@gmail.com");
    console.log("   Password: admin\n");
    console.log("Seeding categories...");
    const categories = await Category.insertMany([
        { name: "Electronics" },
        { name: "Fashion" },
        { name: "Books" },
        { name: "Home Appliances" },
        { name: "Sports" },
        { name: "Beauty & Health" },
        { name: "Gaming" },
    ]);
    console.log("Seeding products...");
    const products = await Product.insertMany([
        {
        name: "Apple iPhone 15 Pro",
        description:
            "Flagship smartphone with A17 Pro chip and titanium build.",
        price: 1299,
        image:
            "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium",
        category: categories.find(c => c.name === "Electronics")._id,
        stock: 25,
        },
        {
        name: "Samsung Galaxy S24 Ultra",
        description:
            "Premium Android phone with 200 MP camera and S Pen.",
        price: 1199,
        image:
            "https://m.media-amazon.com/images/I/61n0lmxP5-L._AC_SY300_SX300_QL70_FMwebp_.jpg",
        category: categories.find(c => c.name === "Electronics")._id,
        stock: 30,
        },
        {
        name: "Nike Air Zoom Pegasus 41",
        description:
            "Lightweight running shoes with responsive ZoomX foam.",
        price: 159,
        image:
            "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3cfa0374-d35c-4083-a466-35c5ce5e8eaa/AIR+ZOOM+PEGASUS+41.png",
        category: categories.find(c => c.name === "Fashion")._id,
        stock: 40,
        },
        {
        name: "Atomic Habits - James Clear",
        description:
            "Bestselling guide on how small changes lead to big results.",
        price: 25,
        image:
            "https://images-na.ssl-images-amazon.com/images/I/81bGKUa1e0L.jpg",
        category: categories.find(c => c.name === "Books")._id,
        stock: 100,
        },
        {
        name: "Dyson V15 Detect Vacuum Cleaner",
        description: "Laser dust detection and powerful suction.",
        price: 749,
        image:
            "https://m.media-amazon.com/images/I/61p+FdEl5UL._AC_SY300_SX300_QL70_FMwebp_.jpg",
        category: categories.find(c => c.name === "Home Appliances")._id,
        stock: 15,
        },
        {
        name: "Wilson Evolution Basketball",
        description:
            "Official indoor ball made with microfiber composite leather.",
        price: 79,
        image:
            "https://m.media-amazon.com/images/I/91ErTRDixvL._AC_SX679_.jpg",
        category: categories.find(c => c.name === "Sports")._id,
        stock: 35,
        },
        {
        name: "Fitbit Charge 6 Fitness Tracker",
        description: "Heart-rate, sleep, and GPS tracking with Google Fit.",
        price: 159,
        image:
            "https://m.media-amazon.com/images/I/61wn2jfhBkL._AC_SY300_SX300_QL70_FMwebp_.jpg",
        category: categories.find(c => c.name === "Beauty & Health")._id,
        stock: 35,
        },
        {
        name: "Sony PlayStation 5 Slim",
        description:
            "Next-gen gaming console with ultra-fast SSD and ray tracing.",
        price: 499,
        image:
            "https://m.media-amazon.com/images/I/71aQ-zVSD6L._SX522_.jpg",
        category: categories.find(c => c.name === "Gaming")._id,
        stock: 18,
        },
    ]);

    console.log("Creating demo orders for analytics...");

    const randomUser = await User.create({
        name: "test User",
        email: "user@gmail.com",
        password: await bcrypt.hash("user", 10),
        role: "user",
    });

    const testOrders = [
        {
            user: randomUser._id,
            items: [
            { product: products[0]._id, name: products[0].name, quantity: 1, price: products[0].price },
            { product: products[2]._id, name: products[2].name, quantity: 2, price: products[2].price },
            ],
            totalAmount: products[0].price + products[2].price * 2,
            paymentMethod: "COD",
            status: "Delivered",
            createdAt: new Date("2025-01-15"),
        },
        {
            user: randomUser._id,
            items: [
            { product: products[1]._id, name: products[1].name, quantity: 1, price: products[1].price },
            { product: products[3]._id, name: products[3].name, quantity: 3, price: products[3].price },
            ],
            totalAmount: products[1].price + products[3].price * 3,
            paymentMethod: "Stripe",
            status: "Shipped",
            createdAt: new Date("2025-04-10"),
        },
        {
            user: randomUser._id,
            items: [
            { product: products[5]._id, name: products[5].name, quantity: 4, price: products[5].price },
            { product: products[7]._id, name: products[7].name, quantity: 1, price: products[7].price },
            ],
            totalAmount: products[5].price * 4 + products[7].price,
            paymentMethod: "COD",
            status: "Delivered",
            createdAt: new Date("2025-06-20"),
        },
    ];

    await Order.insertMany(testOrders);

    console.log("Seeding completed successfully!");
    console.log(`
    Admin:
        Email: admin@gmail.com
        Password: admin
    User:
        Email: user@gmail.com
        Password: user
    Products: ${products.length}
    Categories: ${categories.length}
    Orders: ${testOrders.length}
    `);

    process.exit();
}

seedData().catch(errors =>
{
  console.error("Seeding failed:", errors);
  process.exit(1);
});
