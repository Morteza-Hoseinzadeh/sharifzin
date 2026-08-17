const express = require('express');
const router = express.Router();

// PUBLIC ROUTES
const productsRoute = require('./products/route');
router.use('/products', productsRoute);

const categoriesRoute = require('./categories/route');
router.use('/categories', categoriesRoute);

const blogRoutes = require('./blog/route');
router.use('/blogs', blogRoutes);

// ----------------------------------------------------------------------------------------------------------- //

// PRIVARE ROUTES
const adminProductsRoute = require('./admin/products/route');
router.use('/admin/products', adminProductsRoute);

module.exports = router;
