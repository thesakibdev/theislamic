const Comment = require("../../models/comment.model");
const Blog = require("../../models/blog.model");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

// Helper function to update blog statistics
const updateBlogStats = async (blogId) => {
  try {
    // Get approved comments for this blog
    const approvedComments = await Comment.find({ 
      blogId, 
      isApproved: true 
    });

    // Calculate comment count
    const commentCount = approvedComments.length;

    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    
    approvedComments.forEach(comment => {
      if (comment.rating) {
        const ratingValues = {
          "Angry": 1,
          "Average": 2,
          "Normal": 3,
          "Good": 4,
          "Excellent": 5
        };
        totalRating += ratingValues[comment.rating] || 0;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

    // Update blog with new stats
    await Blog.findByIdAndUpdate(blogId, {
      commentCount,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: ratingCount
    });

  } catch (error) {
    console.error("Error updating blog stats:", error);
  }
};

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { blogId, name, email, website, comment, rating } = req.body;
    
    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'] || '';

    const newComment = new Comment({
      blogId,
      name,
      email,
      website,
      comment,
      rating,
      ipAddress,
      userAgent,
    });

    await newComment.save();

    // Invalidate cache for this blog's comments
    invalidateCache();

    res.status(201).json({
      success: true,
      message: "Comment submitted successfully. It will be visible after admin approval.",
      data: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting comment",
    });
  }
};

// Get approved comments for a specific blog (for frontend)
const getApprovedComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const cacheKey = `comments_${blogId}_page_${currentPage}_limit_${pageLimit}`;
    const cachedComments = getCache(cacheKey);

    if (cachedComments) {
      return res.status(200).json(cachedComments);
    }

    const comments = await Comment.find({ 
      blogId, 
      isApproved: true 
    })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .populate('approvedBy', 'name');

    const totalComments = await Comment.countDocuments({ 
      blogId, 
      isApproved: true 
    });

    const result = {
      comments,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalComments / pageLimit),
        totalComments,
        hasNext: currentPage * pageLimit < totalComments,
        hasPrev: currentPage > 1,
      },
    };

    setCache(cacheKey, result, 300); // Cache for 5 minutes

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
    });
  }
};

// Get all comments for admin (including pending ones)
const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, blogId } = req.query;

    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 20;

    let query = {};
    
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }

    if (blogId) {
      query.blogId = blogId;
    }

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .populate('blogId', 'title')
      .populate('approvedBy', 'name');

    const totalComments = await Comment.countDocuments(query);

    const result = {
      comments,
      pagination: {
        currentPage,
        totalPages: Math.ceil(totalComments / pageLimit),
        totalComments,
        hasNext: currentPage * pageLimit < totalComments,
        hasPrev: currentPage > 1,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all comments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
    });
  }
};

// Approve a comment
const approveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.isApproved = true;
    comment.approvedBy = approvedBy;
    comment.approvedAt = new Date();

    await comment.save();

    // Update blog comment count and rating
    await updateBlogStats(comment.blogId);

    // Invalidate cache
    invalidateCache();

    res.status(200).json({
      success: true,
      message: "Comment approved successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Error approving comment:", error);
    res.status(500).json({
      success: false,
      message: "Error approving comment",
    });
  }
};

// Reject/Delete a comment
const rejectComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update blog stats if comment was approved
    if (comment.isApproved) {
      await updateBlogStats(comment.blogId);
    }

    // Invalidate cache
    invalidateCache();

    res.status(200).json({
      success: true,
      message: "Comment rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting comment:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting comment",
    });
  }
};

// Get comment statistics
const getCommentStats = async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments();
    const approvedComments = await Comment.countDocuments({ isApproved: true });
    const pendingComments = await Comment.countDocuments({ isApproved: false });

    const stats = {
      total: totalComments,
      approved: approvedComments,
      pending: pendingComments,
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching comment stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comment statistics",
    });
  }
};

// Update all blog statistics (for existing blogs)
const updateAllBlogStats = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    let updatedCount = 0;
    
    for (const blog of blogs) {
      await updateBlogStats(blog._id);
      updatedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Successfully updated statistics for ${updatedCount} blogs`,
    });
  } catch (error) {
    console.error("Error updating all blog stats:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog statistics",
    });
  }
};

module.exports = {
  addComment,
  getApprovedComments,
  getAllComments,
  approveComment,
  rejectComment,
  getCommentStats,
  updateAllBlogStats,
}; 