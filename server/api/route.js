const express = require('express');
const router = express.Router();

// PUBLIC ROUTES
const authRoutes = require('./auth/route');
router.use('/auth', authRoutes);

const blogRoutes = require('./blog/route');
router.use('/blogs', blogRoutes);

const categoriesRoute = require('./categories/route');
router.use('/categories', categoriesRoute);

const cartRoutes = require('./cart/route');
router.use('/cart', cartRoutes);

const discountRoutes = require('./discount/route');
router.use('/discount', discountRoutes);

const productsRoute = require('./products/route');
router.use('/products', productsRoute);

const ordersRoute = require('./orders/route');
router.use('/orders', ordersRoute);

// ----------------------------------------------------------------------------------------------------------- //

// PRIVARE ROUTES
const adminProductsRoute = require('./admin/products/route');
router.use('/admin/products', adminProductsRoute);

module.exports = router;
