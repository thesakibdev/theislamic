const Donor = require("../../models/donor.model");
const cloudinary = require("../../lib/cloudinary");
const { invalidateCache, setCache, getCache } = require("../../utils/utils");
const ResponseHandler = require("../../helper/ResponseHandler");

const handleImageUpload = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const public_id = `image_${Date.now()}`;
    const folder = "Donor_images";

    const { optimizedUrl, public_id: uploadedPublicId } =
      await cloudinary.imageUploadUtil(fileBuffer, public_id, folder);

    res.json({
      success: true,
      data: { optimizedUrl, public_id: uploadedPublicId },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

// donor controller functions
const createDonor = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      typeOfDonation,
      companyName,
      profession,
      designation,
      country,
      street,
      city,
      avatar,
      avatarId,
      amount,
      isDetailsVisible,
      donateDate,
    } = req.body;

    console.log(req.body);

    if (!phone) {
      return ResponseHandler.error(res, "Phone number is required.", 404);
    }

    const donorDoc = await Donor.findOne({ phone, name, fatherName });

    if (donorDoc) {
      donorDoc.TotalDonation += amount;
      donorDoc.donationHistory.push({ amount, donateDate });
      await donorDoc.save();

      invalidateCache("donors");

      return ResponseHandler.success(
        res,
        "Donor updated successfully.",
        donorDoc
      );
    }

    const newDonor = new Donor({
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      avatar,
      avatarId,
      TotalDonation: amount,
      isDetailsVisible,
      donateDate,
      donationHistory: [{ amount, donateDate, typeOfDonation, history: [] }],
    });

    const savedDonor = await newDonor.save();
    invalidateCache("donors");

    return ResponseHandler.success(
      res,
      "Donor created successfully.",
      savedDonor,
      201
    );
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.");
  }
};

const editDonor = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      avatar,
      avatarId,
      name,
      fatherName,
      email,
      phone,
      dateOfBirth,
      companyName,
      designation,
      profession,
      country,
      street,
      city,
      isDetailsVisible,
    } = req.body;

    const findDonor = await Donor.findById(id);

    findDonor.isDetailsVisible = isDetailsVisible || findDonor.isDetailsVisible;
    findDonor.name = name || findDonor.name;
    findDonor.fatherName = fatherName || findDonor.fatherName;
    findDonor.email = email || findDonor.email;
    findDonor.phone = phone || findDonor.phone;
    findDonor.dateOfBirth = dateOfBirth || findDonor.dateOfBirth;
    findDonor.companyName = companyName || findDonor.companyName;
    findDonor.designation = designation || findDonor.designation;
    findDonor.profession = profession || findDonor.profession;
    findDonor.country = country || findDonor.country;
    findDonor.street = street || findDonor.street;
    findDonor.city = city || findDonor.city;
    findDonor.avatar = avatar || findDonor.avatar;
    findDonor.avatarId = avatarId || findDonor.avatarId;

    await findDonor.save();

    invalidateCache("donors");

    return ResponseHandler.success(res, "Donor updated successfully.");
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.");
  }
};

const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDonor = await Donor.findByIdAndDelete(id);
    invalidateCache("donors");
    return res.status(200).json({
      success: true,
      message: "Donor deleted successfully.",
      data: deletedDonor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

// donor history controller functions
const addNewDonationHistory = async (req, res) => {
  try {
    const { id: donorId } = req.params;
    const { amount, donateDate, typeOfDonation } = req.body;

    const donor = await Donor.findById(donorId);

    if (!donor) {
      return ResponseHandler.error(res, "Donor not found.", 404);
    }

    // Step 1: Push new updated donation entry
    donor.donationHistory.push({ amount, donateDate, typeOfDonation });

    // Step 2: Recalculate TotalDonation
    donor.TotalDonation = donor.donationHistory.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    // Step 3: Save the updated donor document
    await donor.save();

    invalidateCache("donors");

    return ResponseHandler.success(res, "Donation history added.", donor);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.");
  }
};

const editDonationHistory = async (req, res) => {
  const { historyId, donorId } = req.params;
  const { amount, donateDate, typeOfDonation } = req.body;

  try {
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return ResponseHandler.error(res, "Donor not found.", 404);
    }

    // Find the specific donation history entry
    const historyIndex = donor.donationHistory.findIndex(
      (item) => item._id.toString() === historyId
    );

    if (historyIndex === -1) {
      return ResponseHandler.error(res, "Donation history not found.", 404);
    }

    // Step 1: Push new updated donation entry
    donor.donationHistory.push({ amount, donateDate, typeOfDonation });

    // Step 2: Remove old donation history entry
    donor.donationHistory.splice(historyIndex, 1);

    // Step 3: Recalculate TotalDonation
    donor.TotalDonation = donor.donationHistory.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    // Step 4: Save the donor
    await donor.save();

    invalidateCache("donors");

    return ResponseHandler.success(res, "Donation history updated.", donor);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.");
  }
};

const deleteDonorHistory = async (req, res) => {
  try {
    const { donorId, historyId } = req.params;
    const donor = await Donor.findById(donorId);

    if (!donor) {
      return ResponseHandler.error(res, "Donor not found.", 404);
    }

    // Find the specific donation history entry
    const historyIndex = donor.donationHistory.findIndex(
      (item) => item._id.toString() === historyId
    );

    if (historyIndex === -1) {
      return ResponseHandler.error(res, "Donation history not found.", 404);
    }

    // Step 1: Remove the donation history entry
    donor.donationHistory.splice(historyIndex, 1);

    // Step 2: Recalculate TotalDonation
    donor.TotalDonation = donor.donationHistory.reduce(
      (total, entry) => total + entry.amount,
      0
    );

    // Step 3: Save the donor
    await donor.save();

    invalidateCache("donors");

    return ResponseHandler.success(res, "Donation history deleted.", donor);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, "Server error.");
  }
};

// get all donors controller function
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

    const totalDonors = await Donor.countDocuments();

    const donors = await Donor.find({})
      .sort({ TotalDonation: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    const donorsWithTotalDonation = donors.map((donor) => {
      const totalDonation = (donor.donationHistory || []).reduce(
        (acc, curr) => acc + (curr.amount || 0),
        0
      );
      return { ...donor, totalDonation };
    });

    setCache(cacheKey, { donors: donorsWithTotalDonation, totalDonors }, 600);

    res.status(200).json({
      success: true,
      currentPage,
      totalPages: Math.ceil(totalDonors / pageLimit),
      totalDonors,
      donors: donorsWithTotalDonation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

module.exports = {
  createDonor,
  handleImageUpload,
  getAllDonors,
  editDonor,
  deleteDonor,
  editDonationHistory,
  addNewDonationHistory,
  deleteDonorHistory,
};
