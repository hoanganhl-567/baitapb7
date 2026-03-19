const express = require("express");
const router = express.Router();
const Inventory = require("../schemas/inventory");


// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const data = await Inventory.find().populate("product");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= GET BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const data = await Inventory.findById(req.params.id).populate("product");
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= ADD STOCK =================
router.post("/add-stock", async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const inv = await Inventory.findOne({ product });
    if (!inv) return res.status(404).json({ message: "Inventory not found" });

    inv.stock += quantity;
    await inv.save();

    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= REMOVE STOCK =================
router.post("/remove-stock", async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const inv = await Inventory.findOne({ product });
    if (!inv) return res.status(404).json({ message: "Inventory not found" });

    if (inv.stock < quantity)
      return res.status(400).json({ message: "Không đủ hàng" });

    inv.stock -= quantity;
    await inv.save();

    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= RESERVATION =================
router.post("/reservation", async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const inv = await Inventory.findOne({ product });
    if (!inv) return res.status(404).json({ message: "Inventory not found" });

    if (inv.stock < quantity)
      return res.status(400).json({ message: "Không đủ hàng trong kho" });

    inv.stock -= quantity;
    inv.reserved += quantity;

    await inv.save();
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= SOLD =================
router.post("/sold", async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const inv = await Inventory.findOne({ product });
    if (!inv) return res.status(404).json({ message: "Inventory not found" });

    if (inv.reserved < quantity)
      return res.status(400).json({ message: "Không đủ hàng đã giữ" });

    inv.reserved -= quantity;
    inv.soldCount += quantity;

    await inv.save();
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;