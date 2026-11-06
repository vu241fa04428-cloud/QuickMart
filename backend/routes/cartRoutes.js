const router = require("express").Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart || { items: [] });
});

router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);
    if (!productId || !Number.isInteger(qty) || qty < 1) return res.status(400).json({ message: "Valid product and quantity required." });
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable || product.stock < qty) return res.status(400).json({ message: "Product unavailable or insufficient stock." });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const item = cart.items.find(i => i.product.toString() === productId);
    if (item) item.quantity += qty;
    else cart.items.push({ product: productId, quantity: qty });
    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch { res.status(400).json({ message: "Could not add item to cart." }); }
});

router.patch("/:productId", async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ message: "Quantity must be at least 1." });
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found." });
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Item not found." });
    item.quantity = qty;
    await cart.save();
    res.json(await cart.populate("items.product"));
  } catch { res.status(400).json({ message: "Could not update cart." }); }
});

router.delete("/:productId", async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(await cart.populate("items.product"));
});

module.exports = router;
