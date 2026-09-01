const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../../controllers/cartController');

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeCartItem);
router.delete('/clear', clearCart);

module.exports = router;
