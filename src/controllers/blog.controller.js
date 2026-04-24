const { BlogPost } = require('../models');

const getAllBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await BlogPost.findAndCountAll({
      where: { published: true },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        items: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findByPk(id);

    if (!blogPost || !blogPost.published) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const createBlogPost = async (req, res) => {
  try {
    const { title, excerpt, content, image, author, published } = req.body;

    const blogPost = await BlogPost.create({
      title,
      excerpt,
      content,
      image,
      author: author || 'PetShop Team',
      published: published !== undefined ? published : true
    });

    res.status(201).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, author, published } = req.body;

    const blogPost = await BlogPost.findByPk(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blogPost.update({
      title,
      excerpt,
      content,
      image,
      author,
      published
    });

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const blogPost = await BlogPost.findByPk(id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blogPost.destroy();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};