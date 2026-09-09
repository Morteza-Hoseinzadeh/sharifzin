const express = require('express');
const router = express.Router();

// PUBLIC ROUTES
const authRoutes = require('./auth/route');
router.use('/auth', authRoutes);

const addressesRoutes = require('./addresses/route');
router.use('/user/addresses', addressesRoutes);

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

const wishListRoutes = require('./wishlist/route');
router.use('/user/wishlist', wishListRoutes);

// ====================== ADMIN ROUTES ======================
const adminController = require('../controllers/adminController');
const productUpload = require('../middlewares/upload');

router.get('/admin/dashboard', adminController.getAdminDashboard);
router.get('/admin/orders', adminController.getAllOrders);
router.patch('/admin/orders/:id/status', adminController.updateOrderStatus);

// ==================== PRODUCTS ====================

router.get('/admin/products', adminController.getAllProducts);
router.post('/admin/products', adminController.createProduct);
router.patch('/admin/products/:id', adminController.updateProduct);
router.delete('/admin/products/:id', adminController.deleteProduct);

// ==================== PRODUCT IMAGES ====================
router.post('/admin/products/upload-images', productUpload.uploadMultiple, adminController.uploadProductImages);

// ==================== USERS ====================
router.get('/admin/users', adminController.getAllUsers);
router.delete('/admin/users/:id', adminController.deleteUser);

// ==================== CATEGORIES ====================
router.get('/admin/categories', adminController.getAllCategories);
router.post('/admin/categories', adminController.createCategory);
router.patch('/admin/categories/:id', adminController.updateCategory);
router.delete('/admin/categories/:id', adminController.deleteCategory);

module.exports = router;
