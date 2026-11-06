const router = require("express").Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);

router.post("/", async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    if (!deliveryAddress?.trim()) return res.status(400).json({ message: "Delivery address is required." });
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || !cart.items.length) return res.status(400).json({ message: "Your cart is empty." });

    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;
      if (!product || !product.isAvailable || product.stock < item.quantity) {
        return res.status(400).json({ message: `${product?.name || "A product"} is out of stock.` });
      }
      orderItems.push({ product: product._id, name: product.name, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ user: req.user._id, items: orderItems, totalAmount, deliveryAddress });
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch { res.status(500).json({ message: "Could not place order." }); }
});

router.get("/my", async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/", adminOnly, async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/:id/status", adminOnly, async (req, res) => {
  const allowed = ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(req.body.orderStatus)) return res.status(400).json({ message: "Invalid order status." });
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json(order);
});

module.exports = router;
