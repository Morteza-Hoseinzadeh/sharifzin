const express = require('express');

const router = express.Router();

const orderController = require('../../controllers/orderController');

// ======================================================
// Payment Callback
// IMPORTANT:
// باید قبل از /:code قرار بگیرد
// ======================================================

router.get('/callback', orderController.paymentCallback);

// ======================================================
// User Orders
// ======================================================

router.get('/:cart_token/my-orders', orderController.getUserOrders);

// ======================================================
// Checkout
// ======================================================

router.post('/checkout', orderController.checkout);

// ======================================================
// Pay
// ======================================================

router.post('/:code/pay', orderController.payOrder);

// ======================================================
// Get Order By Code
// IMPORTANT:
// بعد از callback قرار گرفته
// ======================================================

router.get('/:code', orderController.getOrderByCode);

// ======================================================
// Admin
// ======================================================

router.get('/', orderController.getAllOrders);

router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
