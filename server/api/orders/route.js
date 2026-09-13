const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');

// "کاربر"
router.get('/:cart_token/my-orders', orderController.getUserOrders);

// مشتری
router.post('/checkout', orderController.checkout);
router.get('/:code', orderController.getOrderByCode);
router.post('/:code/pay', orderController.payOrder);
router.get('/callback', orderController.paymentCallback);

// ادمین
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
