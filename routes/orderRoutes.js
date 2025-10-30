const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { authRequired } = require("../middleware/auth");
const router = express.Router();

router.post("/", authRequired, async (req, res) =>
{
  try
  {
    const { items, paymentMethod } = req.body;
    let total = 0;
    for (const i of items)
    {
      const prod = await Product.findById(i.product);
      total += prod.price * i.quantity;
      prod.stock -= i.quantity;
      await prod.save();
    }

    const order = await Order.create(
    {
      user: req.user.id,
      items,
      totalAmount: total,
      paymentMethod,
    }
    );
    res.status(201).json(order);
  }
  catch (errors)
  {
    res.status(500).json({ message: errors.message });
  }
});

router.get("/", authRequired, async (req, res) =>
{
  const orders = await Order.find({ user: req.user.id }).populate("items.product");
  res.json(orders);
});
router.get("/latest", authRequired, async (req, res) =>
{
    try
    {
      const order = await Order.findOne({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("items.product", "name price image");
      if (!order)
      {
        return res.status(404).json({ message: "No recent order found." });
      }
      console.log(order.items[0].product);
      res.json(order);
    }
    catch (errors)
    {
      console.error(errors);
      res.status(500).json({ message: "Server error retrieving order" });
    }
});
router.get("/:id", authRequired, async (req, res) =>
{
    try
    {
      const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
        .populate("items.product", "name price image");
      if (!order) 
      {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    }
    catch (errors)
    {
      res.status(500).json({ message: errors.message });
    }
});
module.exports = router;
