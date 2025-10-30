const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const { adminOnly, authRequired } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) =>
{
  try
  {
    const { search, category } = req.query;
    const query = {};
    if (search) 
    {
        query.name = { $regex: search, $options: "i" };
    }
    if (category)
    {
        const cat = await Category.findOne({ name: category });
        if (cat)
        {
            query.category = cat._id;
        }
    }
    const products = await Product.find(query).populate("category");
    res.json(products);
  }
  catch (errors)
  {
    res.status(500).json({ message: errors.message });
  }
});

router.get("/:id", async (req, res) =>
{
  try
  {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product)
    {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  }
  catch (errors)
  {
    res.status(500).json({ message: errors.message });
  }
});

router.post("/", authRequired, adminOnly, async (req, res) =>
{
  try
  {
    const { name, description, price, category, stock, image } = req.body;
    const cat = await Category.findOne({ name: category });
    const product = await Product.create({
      name,
      description,
      price,
      category: cat ? cat._id : undefined,
      stock,
      image,
    });
    res.status(201).json(product);
  }
  catch (err)
  {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
