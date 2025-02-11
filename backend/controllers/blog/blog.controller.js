const Blog = require("../../models/blog.model");
const { imageUploadUtil, cloudinaryDelete } = require("../../lib/cloudinary");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

const handleImageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // File buffer from multer
    const public_id = `image_${Date.now()}`; // Generate unique public_id
    const folder = "Blog_images"; // Specify Cloudinary folder

    // Upload the image and get optimized URL and public_id
    const { optimizedUrl, public_id: uploadedPublicId } = await imageUploadUtil(
      fileBuffer,
      public_id,
      folder
    );

    // Respond with the optimized URL and public_id
    res.json({
      success: true,
      data: {
        optimizedUrl,
        public_id: uploadedPublicId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

const addBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      thumbnailId,
      shortDesc,
      slug,
      metaDesc,
      metaKeyword,
      author,
    } = req.body;
    const newBlog = new Blog({
      title,
      description,
      thumbnail,
      thumbnailId,
      shortDesc,
      slug,
      metaDesc,
      metaKeyword,
      author,
    });

    await newBlog.save();

    invalidateCache();

    res.status(201).json({
      success: true,
      data: newBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from creating blog",
    });
  }
};

const fetchAllBlog = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  try {
    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 1;

    const cacheKey = `surahsPage_${currentPage}_limit_${pageLimit}`;
    const cachedSurahs = getCache(cacheKey);

    if (cachedSurahs) {
      return res.status(200).json(cachedSurahs);
    }

    const listOfBlogs = await Blog.find({})
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);
    setCache(cacheKey, listOfBlogs, 600);

    res.status(200).json(listOfBlogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from fetching blog",
    });
  }
};

const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      thumbnail,
      shortDesc,
      slug,
      metaDesc,
      metaKeyword,
      metaUrl,
    } = req.body;

    let findBlog = await Blog.findById(id);
    if (!findBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    findBlog.title = title || findBlog.title;
    findBlog.description = description || findBlog.description;
    findBlog.thumbnail = thumbnail || findBlog.thumbnail;
    findBlog.shortDesc = shortDesc || findBlog.shortDesc;
    findBlog.slug = slug || findBlog.slug;
    findBlog.metaDesc = metaDesc || findBlog.metaDesc;
    findBlog.metaKeyword = metaKeyword || findBlog.metaKeyword;
    findBlog.metaUrl = metaUrl || findBlog.metaUrl;

    await findBlog.save();

    invalidateCache();

    res.status(200).json({
      success: true,
      data: findBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from editing blog",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.thumbnail && blog.thumbnailId) {
      await cloudinaryDelete(blog.thumbnailId);
    }

    await Blog.findByIdAndDelete(id);

    invalidateCache();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting the blog",
    });
  }
};

module.exports = {
  addBlog,
  fetchAllBlog,
  editBlog,
  deleteBlog,
  handleImageUpload,
};
