const express = require("express");
const { adminOnly, authRequired } = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

router.get("/stats", authRequired, adminOnly, async (req, res) =>
{
  const totalOrders = await Order.countDocuments();
  const totalSales = (await Order.find()).reduce((sum, o) => sum + o.totalAmount, 0);
  const totalProducts = await Product.countDocuments();
  res.json({ totalOrders, totalSales, totalProducts });
});
router.post("/add-product", authRequired, adminOnly, async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
});

router.post("/edit-product", authRequired, adminOnly, async (req, res) => {
    const { id, price } = req.body;
    const p = await Product.findByIdAndUpdate(id, { price }, { new: true });
    res.json(p);
});

router.post("/delete-product", authRequired, adminOnly, async (req, res) => {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
});

router.get("/analytics", authRequired, adminOnly, async (req, res) => {
    const orders = await Order.find();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const sales = new Array(12).fill(0);
    orders.forEach(o =>
    {
      const m = new Date(o.createdAt).getMonth();
      sales[m] += o.totalPrice;
    });
    const topMap = {};
    orders.forEach(o => o.items.forEach(i =>
    {
      topMap[i.name] = (topMap[i.name] || 0) + i.quantity;
    }));
    const topProducts = Object.entries(topMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0,5);
    res.json({ months, sales, topProducts });
});
module.exports = router;
