const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');

// مشتری
router.post('/checkout', orderController.checkout);
router.get('/:code', orderController.getOrderByCode);
router.post('/:code/pay', orderController.payOrder);
router.get('/api/v1/payment/callback', orderController.paymentCallback);

// ادمین
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
