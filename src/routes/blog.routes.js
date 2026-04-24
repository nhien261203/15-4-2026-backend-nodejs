const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { authRequired, requireAdmin } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostById);

// Admin routes
router.post('/', authRequired, requireAdmin, blogController.createBlogPost);
router.put('/:id', authRequired, requireAdmin, blogController.updateBlogPost);
router.delete('/:id', authRequired, requireAdmin, blogController.deleteBlogPost);

module.exports = router;