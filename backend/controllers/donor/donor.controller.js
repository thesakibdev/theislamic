const Donor = require("../../models/donor.model");
const cloudinary = require("../../lib/cloudinary");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");

const handleImageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // File buffer from multer
    const public_id = `image_${Date.now()}`; // Generate unique public_id
    const folder = "Donor_images"; // Specify Cloudinary folder

    // Upload the image and get optimized URL and public_id
    const { optimizedUrl, public_id: uploadedPublicId } =
      await cloudinary.imageUploadUtil(fileBuffer, public_id, folder);

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

const createDonor = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      email,
      phone,
      companyName,
      profession,
      designation,
      country,
      street,
      city,
      avatar,
      avatarId,
      TotalDonation,
      isDetailsVisible,
    } = req.body;

    // data validation
    if (!phone) {
      return res.status(400).json({
        error: true,
        message: "Phone number is required.",
      });
    }

    const donorDoc = await Donor.findOne({
      email,
      phone,
      name,
      fatherName,
    });

    if (donorDoc) {
      donorDoc.TotalDonation += TotalDonation;
      await donorDoc.save();

      invalidateCache("donors");

      return res.status(200).json({
        success: true,
        message: "Donor updated successfully.",
        data: donorDoc,
      });
    }

    // Create new donor if not found
    const newDonor = new Donor({
      name,
      fatherName,
      email,
      phone,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      avatar,
      avatarId,
      TotalDonation,
      isDetailsVisible,
    });

    const savedDonor = await newDonor.save();
    invalidateCache("donors");

    return res.status(201).json({
      success: true,
      message: "Donor created successfully.",
      data: savedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const editDonor = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      name,
      fatherName,
      email,
      phone,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      avatar,
      TotalDonation,
      isDetailsVisible,
    } = req.body;

    const updatedDonor = await Donor.findOneAndUpdate(
      { _id: id },
      {
        name,
        fatherName,
        email,
        phone,
        companyName,
        designation,
        profession,
        country,
        street,
        city,
        avatar,
        TotalDonation,
        isDetailsVisible,
      },
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ error: true, message: "Donor not found." });
    }

    invalidateCache("donors");

    return res.status(200).json({
      success: true,
      message: "Donor updated successfully.",
      updatedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 10;

    const cacheKey = `donorsPage_${currentPage}_limit_${pageLimit}`;
    const cachedDonors = getCache(cacheKey);

    if (cachedDonors) {
      return res.status(200).json(cachedDonors);
    }

    // Total number of donors
    const totalDonors = await Donor.countDocuments();

    // Fetch donors with sorting & pagination
    const donors = await Donor.find({})
      .sort({ TotalDonation: -1 }) // বেশি TotalDonation থাকলে উপরে থাকবে
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    setCache(cacheKey, { donors, totalDonors }, 600);

    res.status(200).json({
      success: true,
      currentPage,
      totalPages: Math.ceil(totalDonors / pageLimit), // মোট পৃষ্ঠার সংখ্যা
      totalDonors,
      donors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

module.exports = { createDonor, handleImageUpload, getAllDonors, editDonor };
