const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../../models/Cart');
const cartController = require("../../controllers/cartController");
const router = express.Router();

router.get("/", cartController.getCart);
router.post('/add', cartController.addToCart);
router.put("/update", cartController.updateCart);
router.delete("/remove", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
