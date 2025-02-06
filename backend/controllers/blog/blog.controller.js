const Blog = require("../../models/blog.model");
const imageUploadUtil = require("../../utils/imageUpload.util");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

const addBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      shortDesc,
      metaTitle,
      metaDesc,
      metaKeyword,
    } = req.body;
    const newBlog = new Blog({
      title,
      description,
      thumbnail,
      shortDesc,
      metaTitle,
      metaDesc,
      metaKeyword,
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
      image,
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
    findBlog.image = image || findBlog.image;
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
