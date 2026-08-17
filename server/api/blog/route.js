const express = require('express');
const { query } = require('../../utils/dbQuery');
const router = express.Router();

// GET /blog  -> list of posts + categories (unchanged, kept here for context)
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM blog_posts');
    const blogCategories = await query('SELECT * FROM blog_categories');
    if (result) return res.status(200).json({ message: 'اطلاعات با موفقیت دریافت شد', data: { posts: result, blogCategories } });
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در دریافت اطلاعات', message_en: error.message, error });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const posts = await query('SELECT * FROM blog_posts WHERE slug = ? AND status = ? LIMIT 1', [slug, 'published']);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message_fa: 'مقاله مورد نظر یافت نشد', message_en: 'Post not found' });
    }

    const post = posts[0];

    // best-effort view increment, never blocks the response on failure
    query('UPDATE blog_posts SET views = views + 1 WHERE id = ?', [post.id]).catch(() => {});

    const blogCategories = await query('SELECT * FROM blog_categories');
    const category = blogCategories.find((c) => String(c.id) === String(post.category_id)) || null;

    const relatedPosts = await query('SELECT id, slug, title, excerpt, thumbnail, category_id, views, published_at FROM blog_posts WHERE category_id = ? AND status = ? AND id != ? ORDER BY published_at DESC LIMIT 3', [post.category_id, 'published', post.id]);

    return res.status(200).json({ message: 'اطلاعات با موفقیت دریافت شد', data: { post: { ...post, views: post.views + 1 }, category, relatedPosts } });
  } catch (error) {
    return res.status(500).json({ message_fa: 'خطا در دریافت اطلاعات', message_en: error.message, error });
  }
});

module.exports = router;
