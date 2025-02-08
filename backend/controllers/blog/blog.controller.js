const Blog = require("../../models/blog.model");
const { imageUploadUtil } = require("../../lib/cloudinary");

const handleImageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // File buffer from multer
    const public_id = `image_${Date.now()}`; // Generate unique public_id
    const folder = "my_images"; // Specify Cloudinary folder

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
      metaTitle,
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
      metaTitle,
      metaDesc,
      metaKeyword,
      author,
    });

    await newBlog.save();
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
  try {
    const listOfBlogs = await Blog.find({});
    res.status(200).json({
      success: true,
      data: listOfBlogs,
    });
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
      metaTitle,
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
    findBlog.thumbnail = image || findBlog.image;
    findBlog.shortDesc = shortDesc || findBlog.shortDesc;
    findBlog.metaTitle = metaTitle || findBlog.metaTitle;
    findBlog.metaDesc = metaDesc || findBlog.metaDesc;
    findBlog.metaKeyword = metaKeyword || findBlog.metaKeyword;
    findBlog.metaUrl = metaUrl || findBlog.metaUrl;

    await findBlog.save();
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
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error from editing blog",
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
