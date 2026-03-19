const express = require("express");
const router = express.Router();
const Product = require("../schemas/products");
const Inventory = require("../schemas/inventory");

// CREATE PRODUCT + INVENTORY
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // tạo inventory tương ứng
    await Inventory.create({
      product: product._id,
      stock: 0,
      reserved: 0,
      soldCount: 0,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;