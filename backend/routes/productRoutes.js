const router = require("express").Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { isAvailable: true };
    if (category && ["Books", "Stationery"].includes(category)) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch { res.status(500).json({ message: "Could not load products." }); }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch { res.status(400).json({ message: "Invalid product ID." }); }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch { res.status(400).json({ message: "Invalid product ID." }); }
});

module.exports = router;
